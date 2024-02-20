import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigation = useNavigation();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userDoc = await firestore().collection('users').doc(auth().currentUser.uid).get();
        const userData = userDoc.data();
        if (userData) {
          setName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setEmail(userData.email || '');
        }
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update user data function
  const updateUser = async () => {
    try {
      setLoading(true);
      await firestore().collection('users').doc(auth().currentUser.uid).update({
        firstName: name,
        lastName: lastName,
        email: email,
        profileURL: '',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 12 }}>
          <Text style={{ fontSize: 18 }}>Back</Text>
        </TouchableOpacity>
      <Text>Update data of {auth().currentUser.uid}</Text>

      {loading && <ActivityIndicator size="large" color="purple" />}

      {dataLoaded && (
        <>
          {/* Display user data in TextInput for editing */}
          <Text>Name</Text>
          <TextInput
            value={name}
            onChangeText={(value) => setName(value)}
            placeholder="Name"
            style={{ backgroundColor: 'white', padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}
          ></TextInput>

          <Text>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={(value) => setLastName(value)}
            placeholder="Last Name"
            style={{ backgroundColor: 'white', padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}
          ></TextInput>

          <Text>Email</Text>
          <TextInput
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Email"
            style={{ backgroundColor: 'white', padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}
          ></TextInput>


          {/* upload pic */}
          <TouchableOpacity onPress={() => navigation.navigate('uploadImage')} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'purple', marginTop: 20, height: 40, borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>Upload Picture</Text>
          </TouchableOpacity>

          {/* Button to update user data */}
          <TouchableOpacity onPress={() => updateUser()} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'purple', marginTop: 20, height: 40, borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>Update</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default UpdateProfile;
