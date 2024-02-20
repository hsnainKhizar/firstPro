import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Ref for FlatList
  const senderId = auth().currentUser.uid;
  const receiverId = route.params.userId;
  const chatRoomId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('messages')
      .doc(chatRoomId)
      .collection('message')
      .orderBy('timestamp')
      .onSnapshot((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);

        // Scroll to the end whenever new messages are received
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd();
        }
      });

    return () => unsubscribe();
  }, [chatRoomId]);

  const sendMessage = async (text) => {
    try {
      await firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('message')
        .add({
          senderId,
          receiverId,
          text,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, padding: 12 }}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 12 }}>
          <Text style={{ fontSize: 18 }}>Back</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef} // Set the ref
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={item.senderId === senderId ? styles.senderMessage : styles.receiverMessage}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current.scrollToEnd()} // Scroll to the end on content size change
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          onChangeText={(text) => setMessageInput(text)}
          value={messageInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => sendMessage(messageInput)} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

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

export default ChatScreen;
