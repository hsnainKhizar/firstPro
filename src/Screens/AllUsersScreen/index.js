import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import User from '../../Components/User';

 


const AllUsersScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUserUid = auth().currentUser.uid;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const usersSnapshot = await firestore().collection('users').get();

                const usersData = usersSnapshot.docs
                    .map(doc => ({
                        uid: doc.id,
                        ...doc.data(),
                    }))
                    .filter(user => user.uid !== currentUserUid);

                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUserUid]);

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ padding: 12 }}>
                <Text style={{ fontSize: 18 }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>All Users</Text>

            {loading ? (
                <ActivityIndicator size="large" color="purple" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            ) : (
                <View>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => <User user={item}  />}
                />
                </View>

            )}
        </View>
    );
};

export default AllUsersScreen;



