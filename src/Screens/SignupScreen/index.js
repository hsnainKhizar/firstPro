import React, { useState } from 'react';
import { View, Text, StyleSheet,Image, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const SignupScreen = ({navigation}) => {

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmation, setConfirmation] = useState(null);


    // 


    signup = async () => {
        console.log('signup');
        console.log(name, lastName, email, password);

        try {
            // set loading indicator.
            setLoading(true);
            await auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    //Once the user creation has happened successfully, we can add the currentUser into firestore
                    //with the appropriate details.
                    firestore().collection('users').doc(auth().currentUser.uid)
                        .set({
                            firstName: name,
                            lastName: lastName,
                            email: email,
                            createdAt: firestore.Timestamp.fromDate(new Date()),
                            uid: auth().currentUser.uid
                        })
                        .then(() => {
                            console.log('User Added');
                        })
                        .catch(error => {
                            console.log('something went wrong while added user to firestore', error);
                        });

                }).catch(error => {
                    console.log('Something went wrong while signup', error);

                })
        } catch (error) {
            console.log('Something went wrong while signup', error);
        }
        finally {
            // Hide loading indicator
            setLoading(false);
            navigation.goBack();
        }
    }

    return (
        <View style={{ flex: 1, padding: 12 }}>

            {/* Demo APP */}
            <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: "700" }}>Sign Up</Text>

            <Text style={{ marginTop: 20 }}>Name</Text>
            <TextInput value={name} onChangeText={(value) => setName(value)} placeholder='Email' style={{ backgroundColor: "white", padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}></TextInput>

            <Text style={{ marginTop: 20 }}>Last Name</Text>
            <TextInput value={lastName} onChangeText={(value) => setLastName(value)} placeholder='Email' style={{ backgroundColor: "white", padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}></TextInput>
            {/* email */}
            <Text style={{ marginTop: 20 }}>Email or Phone</Text>
            <TextInput value={email} onChangeText={(value) => setEmail(value)} placeholder='Email' style={{ backgroundColor: "white", padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}></TextInput>

            {/* password */}
            <Text style={{ marginTop: 20 }}>Password</Text>
            <TextInput value={password} onChangeText={(value) => setPassword(value)} placeholder='Email' style={{ backgroundColor: "white", padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}></TextInput>


            {/* button */}
            <TouchableOpacity onPress={() => { signup() }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "purple", marginTop: 40, height: 40, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: 'white' }}>Sign Up</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingContainer}>
                    <Image source={require('../../assets/gifs/Spinner-2.gif')}/>

                    {/* <ActivityIndicator size="large" color="purple" /> */}
                </View>
            )}



        </View>
    );

}

const styles = StyleSheet.create({
    loadingContainer: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
  });

export default SignupScreen;