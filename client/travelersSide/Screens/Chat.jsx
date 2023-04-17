import React, { useLayoutEffect, useEffect, useCallback, useState } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import GradientBackground from '../Components/GradientBackground';
import BackButton from "../Components/BackButtom";



export default function Chat(props) {
    const navigation = useNavigation();
    const [message, setMessage] = useState([]);

const traveler = props.route.params;
console.log(traveler.Picture)
    const onSignOut = () => {
        signOut(auth).catch(error => console.log(error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={onSignOut}>
                    <Text> Hi</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef,orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, snapshot => {
            console.log('snapshot');
            setMessage(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });
        return () => unsubscribe();
    },[]);

    
    const onSend= useCallback((message=[])=>{
        setMessage(prevmesseg => GiftedChat.append(prevmesseg,message));
        const {_id,createdAt, text, user}= message[0];
        addDoc(collection(database,'chats'),{
            _id,
            createdAt,
            text,
            user
        });
    },[])
    return (
        <View style={styles.container}>
            <GradientBackground>
                <BackButton/>
            <GiftedChat 
            showAvatarForEveryMessage={true}
            messages={message}
            onSend={message => onSend(message)}
            user={{
                _id: auth?.currentUser?.email,
                avatar: traveler.Picture
            }}
            // messagesContainerStyle={{

            // }}
            />
            </GradientBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 40,
        marginBottom: 30
    }
})
