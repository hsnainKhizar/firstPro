import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { fetchMessages, addMessage } from '../../Components/FirebaseService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';

const Chat = ({ route }) => {
  const { chatId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null); // Ref for FlatList
  const navigation = useNavigation();


  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc') // Adjust the ordering based on your timestamp field
      .onSnapshot((snapshot) => {
        const updatedMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(updatedMessages);

        if (flatListRef.current) {
          flatListRef.current.scrollToEnd();
        }
      });

    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    try {
      const currentUserId = auth().currentUser.uid; // Replace with actual user ID

      // If chatId is null, create a new chat and use the generated chatId
      if (!chatId) {
        const newChatId = await createNewChat(currentUserId, otherUserId);
        route.params.chatId = newChatId; // Update the route params with the new chatId
      }

      // Send the message using the updated chatId
      await addMessage(route.params.chatId, {
        text: newMessage,
        senderId: currentUserId,
        receiverId: otherUserId,
      });

      setNewMessage('');
    } catch (error) {
      // Handle error
    }
  };

  const createNewChat = async (user1Id, user2Id) => {
    try {
      // Create a new chat and return the generated chatId
      const chatDoc = await firestore().collection('chats').add({
        users: [user1Id, user2Id],
      });
      return chatDoc.id;
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === auth().currentUser.uid;

    return (
      <View style={{ alignSelf: isSender ? 'flex-end' : 'flex-start', margin: 5 }}>
        <View
          style={{
            backgroundColor: isSender ? '#DCF8C5' : '#E8E8E8',
            borderRadius: 8,
            padding: 10,
          }}
        >
          <Text>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 12 }}>
          <Text style={{ fontSize: 18 }}>Back</Text>
        </TouchableOpacity>
        <FlatList
          ref={flatListRef} // Set the ref
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          // inverted
          onContentSizeChange={() => flatListRef.current.scrollToEnd()} // Scroll to the end on content size change

        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            onChangeText={(text) => setNewMessage(text)}
            value={newMessage}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <TextInput
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
            placeholder="Type your message..."
            style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
          />
          <Button title="Send" onPress={handleSendMessage} /> 
        </View> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
const styles = StyleSheet.create({
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:12,
    justifyContent: 'space-between',
    paddingBottom: 48, // Added paddingBottom to create space between input and button
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
    backgroundColor: 'purple',
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
  },
});