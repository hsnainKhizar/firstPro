import React from 'react';
import {TextInput, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../Screens/LoginScreen';
import SignupScreen from '../../Screens/SignupScreen';
import ProfileScreen from '../../Screens/ProfileScreen';
import UpdateProfile from '../../Screens/UpdateProfile';
import AllUsersScreen from '../../Screens/AllUsersScreen';
import ChatScreen from '../../Screens/ChatScreen';
import ChatListScreen from '../../Screens/ChatListScreen';
import Chat from '../../Screens/Chat';
import ChatList from '../../Screens/ChatList';
import ImageUpload from '../../Screens/ImageUpload';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="login"
        component={LoginScreen}
        
        options={{headerShown: false}}
      />
      <Stack.Screen name="signup" component={SignupScreen} options={{headerShown: false}} />
      <Stack.Screen name="profile" component={ProfileScreen} options={{headerShown: false}} />
      <Stack.Screen name="updateProfile" component={UpdateProfile} options={{headerShown: false}} />
      <Stack.Screen name="allUsers" component={AllUsersScreen} options={{headerShown: false}} />
      <Stack.Screen name="chatUser" component={Chat} options={{headerShown: false}} />
      <Stack.Screen name="chatL" component={ChatList} options={{headerShown: false}} />
      <Stack.Screen name="chatList" component={ChatListScreen} options={{headerShown: false}} />
      <Stack.Screen name="chat" component={ChatScreen} options={{headerShown: false}} />
      <Stack.Screen name="uploadImage" component={ImageUpload} options={{headerShown: false}} />

    </Stack.Navigator>
  );
};

export default AuthStack;