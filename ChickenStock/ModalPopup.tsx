

// import React, { useState } from 'react';
// import { Button, Modal, Text, View } from 'react-native';

// const ModalPopup = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View>
//       <Button title="Open Modal" onPress={openModal} />
//       <Modal visible={modalVisible} animationType="slide">
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Text>Hello, Modal!</Text>
//           <Button title="Close" onPress={closeModal} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ModalPopup;
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';



const ModalPopup = () => {
  const [modalVisible, setModalVisible] = useState(true);

  type RootStackParamList = {
    ModalPopup: undefined;
    BuyPage: undefined;
  };
  type loginPageNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ModalPopup'
  >;

  const navigation = useNavigation<loginPageNavigationProp>();

  // const openModal = () => {
  //   setModalVisible(true);
  // };

  // const closeModal = () => {
  //   setModalVisible(false);
  // };
  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={()=>{navigation.navigate('BuyPage')}} activeOpacity={0.8}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text>Hello, Modal!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ModalPopup;

