// ChatListScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { fetchChatList } from '../../Components/FirebaseService';
import auth from '@react-native-firebase/auth';

const ChatList = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const userId = auth().currentUser.uid; // Replace with actual user ID
    const fetchChatListData = async () => {
      try {
        const fetchedChatList = await fetchChatList(userId);
        console.log("fetched chats", fetchedChatList);
        setChatList(fetchedChatList);
      } catch (error) {
        // Handle error
      }
    };

    fetchChatListData();
  }, []);

  const handleChatItemPress = (chatId, otherUserId) => {
    console.log('chatscreen');
    navigation.navigate('chatUser', { chatId, otherUserId: otherUserId });
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>


      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 12 }}>
        <Text style={{ fontSize: 18 }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ alignSelf: 'center', justifyContent: 'center', fontWeight: '700', fontSize: 18, marginBottom:26 }}>Chat History</Text>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 10, marginTop: 16, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: 'purple' }} onPress={() => handleChatItemPress(item.id, item.otherUserId)}>
            <View style={{ flexDirection: 'row' }}>
              <Image style={{ width: 32, height: 32 }} source={require('../../assets/Icons/student.png')} />

              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' }}>{item.otherUserName}</Text>
                <Text style={{ marginTop: 4 }}>{item.lastMessage}</Text>
              </View>
            </View>


          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatList;
