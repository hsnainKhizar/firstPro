// FirebaseService.js (or wherever you handle Firebase integration)

import firestore from '@react-native-firebase/firestore';

// Fetch the chat list for the current user
// FirebaseService.js (or wherever you handle Firebase integration)

// import firestore from '@react-native-firebase/firestore';

// export const fetchChatList = async (userId) => {
//   try {
//     const chatListSnapshot = await firestore()
//       .collection('chats')
//       .where('users', 'array-contains', userId)
//       .get();
 
//     const chatList = await Promise.all(
//       chatListSnapshot.docs.map(async (doc) => {
//         const data = doc.data();
//         const otherUserId = data.users.find((uid) => uid !== userId);
//         const lastMessageSnapshot = await firestore()
//           .collection('chats')
//           .doc(doc.id)
//           .collection('messages')
//           .orderBy('timestamp', 'desc')
//           .limit(1)
//           .get();

//         let lastMessage = null;

//         if (!lastMessageSnapshot.empty) {
//           lastMessage = lastMessageSnapshot.docs[0].data();
//         }

//         return {
//           id: doc.id,
//           otherUserId: otherUserId,
//           lastMessage: lastMessage.text,
//           // Include other properties from the data if needed
//         };
//       })
//     );

//     return chatList;
//   } catch (error) {
//     console.error('Error fetching chat list:', error);
//     throw error;
//   }
// };


export const fetchChatList = async (userId) => {
  try {
    const chatListSnapshot = await firestore()
      .collection('chats')
      .where('users', 'array-contains', userId)
      .get();

    const chatList = await Promise.all(
      chatListSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const otherUserId = data.users.find((uid) => uid !== userId);

        // Fetch user details for the other user
        const otherUserSnapshot = await firestore()
          .collection('users')
          .doc(otherUserId)
          .get();

        const otherUserData = otherUserSnapshot.data();
        const otherUserName = otherUserData ? otherUserData.firstName : 'Unknown User';

        const lastMessageSnapshot = await firestore()
          .collection('chats')
          .doc(doc.id)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        let lastMessage = null;

        if (!lastMessageSnapshot.empty) {
          lastMessage = lastMessageSnapshot.docs[0].data().text;
        }

        return {
          id: doc.id,
          otherUserId: otherUserId,
          otherUserName: otherUserName,
          lastMessage: lastMessage,
          // Include other properties from the data if needed
        };
      })
    );

    return chatList;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw error;
  }
};





// Fetch messages for a specific chat
export const fetchMessages = async (chatId) => {
  try {
    const messagesSnapshot = await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp','desc')
      .get();

    const messages = messagesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        timestamp: data.timestamp.toDate(),
        senderId: data.senderId,
        receiverId: data.receiverId,
      };
    });

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Add a new message to the specified chat
export const addMessage = async (chatId, message) => {
  try {
    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        text: message.text,
        timestamp: firestore.FieldValue.serverTimestamp(),
        senderId: message.senderId,
        receiverId: message.receiverId,
      });
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};
