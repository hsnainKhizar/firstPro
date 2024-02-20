import React, { useState, useRef, useEffect } from 'react';
import { View, Text,Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import { Gif } from 'react-native-gif';
import { api_url } from '../../constants';


const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const loadingIndicator = useRef(null);


    useEffect(()=>{
        console.log(api_url);
    },[]);


    // login function
    login = async () => {
        console.log('login func');
        console.log('Email:', email);
        console.log('Password:', password);

        try {
            setLoading(true);
            await auth().signInWithEmailAndPassword(email, password);
            console.log('login success!', auth().currentUser.uid);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            navigation.navigate('profile');
        }

        // firestore()
        // .collection('Users')
        // .doc('ABC')
        // .set({
        //   name: 'Ada Lovelace',
        //   age: 30,
        // })
        // .then(() => {
        //   console.log('User added!');
        // });

        // update
        // firestore()
        // .collection('Users')
        // .doc('ABC').update({age: 25})
        // .then(()=>{console.log('user updated');});



    }


    // this is to add user as nonymous login

    anonymousLogin = async () => {
        auth().signInAnonymously()
            .then(() => {
                navigation.navigate('profile');
            }).catch(e => {
                console.log("Something went wrong", e);
            })
    }


    return (
        <View style={{ flex: 1, padding: 12 }}>

            {/* Demo APP */}
            <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: "700" }}>Login</Text>


            {/* email */}
            <Text style={{ marginTop: 20 }}>Email or Phone</Text>
            <TextInput value={email} onChangeText={(value) => setEmail(value)} placeholder='Email' style={{ backgroundColor: "white", padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}></TextInput>

            {/* password */}
            <Text style={{ marginTop: 20 }}>Password</Text>
            <TextInput value={password} onChangeText={(value) => setPassword(value)} placeholder='Email' style={{ backgroundColor: "white", padding: 8, borderRadius: 8, height: 40, marginTop: 14 }}></TextInput>


            {/* button */}
            <TouchableOpacity onPress={() => { login() }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "purple", marginTop: 40, height: 40, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: 'white' }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { anonymousLogin() }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "purple", marginTop: 40, height: 40, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: 'white' }}>Anonymous Login</Text>
            </TouchableOpacity>

            {/* loading indicator */}
            {loading && (
                <View style={styles.loadingContainer}>
                    {/* <Gif
                        source={require('../../assets/gifs/Spinner-2.gif')} // Update the path to your GIF file
                        style={{ width: 100, height: 100 }} // Adjust the size as needed
                    /> */}

                    <Image source={require('../../assets/gifs/Spinner-2.gif')}/>

                    {/* <ActivityIndicator size="large" color="purple" ref={loadingIndicator} /> */}
                </View>
            )}

            {/* sign up */}
            <TouchableOpacity onPress={() => { navigation.navigate('signup') }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "white", marginTop: 40, height: 40, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: 'black' }}>Sign Up</Text>
            </TouchableOpacity>

        </View>
    );

}

export default LoginScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});