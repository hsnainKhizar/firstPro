import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator,Image, TouchableOpacity,BackHandler } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import { useFocusEffect } from '@react-navigation/native';
// import { Image } from 'react-native-reanimated/lib/typescript/Animated';

const ProfileScreen = ({ navigation }) => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchUserData = async () => {
        try {
            // Start loading
            setLoading(true);

            const userDoc = await firestore().collection('users').doc(auth().currentUser.uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                setUserData(userData);
            } else {
                console.log('User data not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            // Stop loading
            setLoading(false);
        }
    };

    // Use useFocusEffect to refetch data when the screen gains focus
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );


    // functions

    function updateProfile() {
        console.log('update');
        navigation.navigate('updateProfile')
    }

    // logout
    const logout = async ()=> {
        console.log('logout');
        try {
            await auth().signOut();
            

        }catch (e){
            console.log(e);
        } finally {
            navigation.navigate('login');
        }
    }



    return (
        <View style={{ flex: 1, padding: 12 }}>
            {/* <Text style={{ alignSelf: "center", marginTop: 20 }}>Profile Screen of {auth().currentUser.uid}</Text> */}

            {/* user Data */}

            {/* Loading indicator */}
            {loading && (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {/* <ActivityIndicator size="large" color="purple" /> */}
                    <Image source={require('../../assets/gifs/Spinner-2.gif')}/>

                </View>
            )}

            {/* Display user data */}
            {userData && (
                <View style={{ marginTop: 20 }}>

                    <Image style={{width:200,height:200,alignSelf:'center',marginBottom:30}} source={require('../../assets/Icons/vk.png')}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Name:</Text>
                        <Text>{userData.firstName}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Last Name:</Text>
                        <Text>{userData.lastName}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Email</Text>
                        <Text>{userData.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>UID</Text>
                        <Text>{userData.uid}</Text>
                    </View>






                    {/* update button */}

                    <TouchableOpacity onPress={updateProfile} style={{ alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: 'purple', marginTop: 100, borderRadius: 8 }}>
                        <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>Update Profile</Text>
                    </TouchableOpacity>

                    {/* all uses */}
                    <TouchableOpacity onPress={()=>{navigation.navigate('allUsers')}} style={{ alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: 'purple', marginTop: 40, borderRadius: 8 }}>
                        <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>All Users</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{navigation.navigate('chatL')}} style={{ alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: 'purple', marginTop: 40, borderRadius: 8 }}>
                        <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>Chats</Text>
                    </TouchableOpacity>

                    {/* logout button */}
                    <TouchableOpacity onPress={logout} style={{ alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: 'white', borderWidth: 1, borderColor: 'gray', marginTop: 40, borderRadius: 8 }}>
                        <Text style={{ color: "black", fontWeight: "700", fontSize: 18 }}>Logout</Text>
                    </TouchableOpacity>

                    {/* Add more fields as needed */}
                </View>
            )}

        </View>
    );
}

export default ProfileScreen;