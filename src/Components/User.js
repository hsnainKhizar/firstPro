// import React from 'react';

// import {View,Text,TouchableOpacity} from 'react-native'
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import { useNavigation } from '@react-navigation/native';

// const User = ({ user }) => {

//     const navigation = useNavigation();

//     return (
//         <View>
//             <TouchableOpacity onPress={() => {// Navigating to the UserDetails screen with userId as a parameter
//                 navigation.navigate('chatUser',{ userId: user.uid });
//             }} style={{ padding: 10, borderBottomWidth: 1, borderColor: 'gray' }}>

//                 <Text>Name: {user.firstName}</Text>
//                 <Text>UID: {user.uid}</Text>

//             </TouchableOpacity>
//         </View>
//     );
// };

// export default User;

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const User = ({ user }) => {
  const navigation = useNavigation();
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    // Fetch the chatId for the current user and the selected user
    const fetchChatId = async () => {
      try {
        const currentUserId = auth().currentUser.uid;
        const userUid = user.uid;

        // First, query for chats where the current user is in 'users' array
        const userChatsSnapshot = await firestore()
          .collection('chats')
          .where('users', 'array-contains', currentUserId)
          .get();

        // Check if there are any user chats
        if (!userChatsSnapshot.empty) {
          // Then, iterate through the user chats and check if the other user is also in 'users' array
          for (const chatDoc of userChatsSnapshot.docs) {
            const chatData = chatDoc.data();

            if (chatData.users.includes(userUid)) {
              // If the other user is also in the 'users' array, set the chatId
              setChatId(chatDoc.id);
              console.log('Chat Data:', chatData);
              return; // Exit the loop once chatId is found
            }
          }
        }

        // If no matching chat is found, set chatId to null
        setChatId(null);
      } catch (error) {
        console.error('Error fetching chatId:', error);
      }
    };



    fetchChatId();
  }, [user.uid]);

  const handleChatUserPress = () => {
    // Navigating to the Chat screen with chatId as a parameter
    navigation.navigate('chatUser', { chatId, otherUserId: user.uid });
  };

  return (
    <View style={{padding:12}}>
      <TouchableOpacity
        onPress={handleChatUserPress}
        style={{ padding: 10,backgroundColor:'white',borderRadius:8,borderWidth:1,borderColor:'purple' }}
      >

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 32, height: 32 }} source={require('../assets/Icons/student.png')} />
          <Text style={{marginLeft:12,color:'black',fontWeight:'700'}}>Name: {user.firstName}</Text>

        </View>

      </TouchableOpacity>
    </View>
  );
};

export default User;
