import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);
  const userId = auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('messages')
      .where('message', 'array-contains', userId)
      .onSnapshot((snapshot) => {
        const chats = snapshot.docs.map((doc) => {
          const data = doc.data();
          const otherUserId = data.message.find(senderId => senderId !== userId);
          return {
            userId: otherUserId,
            chatRoomId: doc.id,
            lastMessage: data.lastMessage, // Assuming you have a field for the last message
          };
        });
        console.log(chats);
        setChatList(chats);
      });

    return () => unsubscribe();
  }, [userId]);

  const navigateToChatScreen = (otherUserId, chatRoomId) => {
    // Replace 'ChatScreen' with the actual name of your chat screen
    navigation.navigate('ChatScreen', {
      userId: otherUserId,
      chatRoomId: chatRoomId,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigateToChatScreen(item.userId, item.chatRoomId)}
          >
            <Text style={styles.username}>{item.userId}</Text>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {item.lastMessage}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
});

export default ChatListScreen;
