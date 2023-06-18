import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';

import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {io, Socket} from 'socket.io-client';

type RootStackParamList = {
  ChoicePageOne: undefined;
  ChoicePageTwo: undefined;
  ChoicePageThree: undefined;
  ChoicePageFour: undefined;
  MainPage: undefined;
  Another: undefined;
  SignUpPage: undefined;
  LoginPage: undefined;
  MyPage: undefined;
};

type ChoicePageOneNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChoicePageTwo'
>;

interface Message {
  content: string;
  sender: string;
}

interface Message {
  content: string;
  sender: string;
}

interface Message {
  content: string;
  sender: string;
}

const TopMenuPage = () => {
  const navigation = useNavigation<ChoicePageOneNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const openModal = () => {
    setModalVisible(true);
    console.log('change1', modalVisible);
    setSocket(io('http://10.0.2.2:5000'));
  };

  const closeModal = () => {
    setModalVisible(false);
    console.log('change2', modalVisible);
    if (socket) {
      socket.disconnect(); // Close socket connection when modal is closed
      setSocket(null);
    }
  };

  const handleOverlayPress = () => {
    closeModal();
    // 모달 이외의 영역을 터치했을 때 수행할 동작을 추가할 수 있습니다.
  };

  // 모달 창을 닫는 함수
  const closeModal = () => {
    setModalVisible(false);
    if (socket) {
      socket.disconnect(); //* 모달창 닫혔을 때 소켓 연결 해제
      setSocket(null);
    }
  };

  const handleOverlayPress = () => {
    closeModal(); // 모달창이 아닌 다른 부분을 닫았을 때 함수 실행
  };

  // 마이페이지 아이콘 눌렀을 때 마이페이지로 이동하는 함수
  const goToChoicePage = () => {
    navigation.navigate('MyPage');
  };

  // const handleSend = () => {
  //   if (socket) {
  //     console.log('Sending message:', message);
  //     socket.emit('message', message);
  //   }
  //   setMessage('');
  // };

  const handleSend = () => {
    if (socket) {
      console.log('Sending message:', message);
      socket.emit('message', message);
      const userMessage: Message = {
        content: message,
        sender: 'user',
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }
    setMessage('');
  };

  useEffect(() => {
    if (socket) {
      socket.on('response', data => {
        console.log(data);
        let responseData = {
          content: data['content'],
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, responseData]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
    return () => {
      if (socket) {
        socket.off('response'); // 이벤트 핸들러 해제
      }
    };
  }, [socket]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('response', data => {
  //       console.log(data);
  //       let responseData = {
  //         content: data['content'],
  //         sender: 'bot',
  //       };
  //       setMessages(prevMessages => [...prevMessages, responseData]);
  //     });
  //   }
  //   return () => {
  //     if (socket) {
  //       socket.off('response'); // 이벤트 핸들러 해제
  //     }
  //   };
  // }, [socket]);

  return (
    <View>
      <View style={styles.icon_box}>
        <Image
          source={require('./resource/Icon_search.png')}
          style={styles.icon}
        />
        <TouchableOpacity onPress={goToChoicePage}>
          <Image
            source={require('./resource/Icon_cart.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openModal}>
          <Image
            source={require('./resource/Icon_AI_chat_bot.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View>
      <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={handleOverlayPress}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Text style={styles.chatTitle}>
                    주식 용어에 대해서 물어보세요!
                  </Text>
                  <View style={styles.chatContainer}>
                    <ScrollView
                      contentContainerStyle={styles.chatContent}
                      showsVerticalScrollIndicator={false}
                      ref={scrollViewRef}>
                      {messages.map((msg, index) => {
                        const key = `${msg.content}-${msg.sender}`;
                        return (
                          <View
                            style={[
                              styles.chatBox,
                              msg.sender === 'user'
                                ? styles.userMessage
                                : styles.botMessage,
                            ]}
                            key={key}>
                            <Text style={styles.chatText}>{msg.content}</Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="메시지를 입력하세요"
                        value={message}
                        onChangeText={setMessage}
                      />
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}>
                        <Text style={styles.sendButtonText}>Send</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon_box: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E8F6EF',
    width: '80%',
    height: '80%',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4C4C6D',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    alignItems: 'flex-end',
    marginBottom: 10,
    flexGrow: 1,
    paddingBottom: 8,
  },
  chatBox: {
    minWidth: 50,
    marginTop: 10,
    padding: 10,
    borderColor: '#4C4C6D',
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    fontSize: 15,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B9C85',
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userMessage: {
    backgroundColor: '#1B9C85',
  },
  botMessage: {
    backgroundColor: '#FFE194',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E8F6EF',
    width: '80%',
    height: '80%',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4C4C6D',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    alignItems: 'flex-end',
    marginBottom: 10,
    flexGrow: 1,
    paddingBottom: 8,
  },
  chatBox: {
    minWidth: 50,
    marginTop: 10,
    padding: 10,
    borderColor: '#4C4C6D',
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    fontSize: 15,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B9C85',
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userMessage: {
    backgroundColor: '#1B9C85',
  },
  botMessage: {
    backgroundColor: '#FFE194',
  },
});

export default TopMenuPage;
