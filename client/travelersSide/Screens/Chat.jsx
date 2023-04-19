import React, { useLayoutEffect, useEffect, useCallback, useState } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, doc, addDoc, query, where, getDocs, orderBy, onSnapshot, push, ref } from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import GradientBackground from '../Components/GradientBackground';



export default function Chat(props) {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const traveler1 = props.route.params.user;
    const traveler = props.route.params.loggeduser;

    console.log('im the logged user', traveler.Picture);
    console.log('im the chosen one!', traveler1.Picture);

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

    const createChatRoom = async () => {
        const chatRoomQuery = query(collection(database, 'chat_rooms'), where('users', '==', [traveler.travler_email, traveler1.travler_email]));
        const chatRoomQuerySnapshot = await getDocs(chatRoomQuery);
        let chatRoomDocRef;
        alert(chatRoomDocRef)
        if (!chatRoomQuerySnapshot.empty) {
            chatRoomDocRef = chatRoomQuerySnapshot.docs[0].ref;
            console.log('Chat room exists');
        } else {
            // Create a new chat room with the two users if one does not exist
            const newChatRoomDocRef = await addDoc(collection(database, 'chat_rooms'), {
                users: [traveler.travler_email, traveler1.travler_email],
                messages: []
            });
            alert(chatRoomDocRef)
            chatRoomDocRef = newChatRoomDocRef;
            console.log('Chat room created');
        }

        // check if both users are in the chat room
        if (chatRoomDocRef.data().users.includes(traveler.travler_email) && chatRoomDocRef.data().users.includes(traveler1.travler_email)) {
            return { ...chatRoomDocRef.data(), id: chatRoomDocRef.id }; // return the chat room document with messages array property and document id
        } else {
            // return null if the chat room doesn't have both users
            return null;
        }
    };

    useEffect(() => {
        const getMessages = async () => {
            const chatRoomDocRef = await createChatRoom();

            if (!chatRoomDocRef) {
                // chat room doesn't exist or doesn't have both users
                alert(chatRoomDocRef)
                return;
            }
            alert(chatRoomDocRef)
            const messagesRef = collection(chatRoomDocRef.id, 'messages');
            const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
                const newMessages = querySnapshot.docChanges().filter(change => change.type === 'added').map(change => {
                    const data = change.doc.data();
                    return {
                        _id: change.doc.id,
                        createdAt: data.createdAt.toDate(),
                        text: data.text,
                        user: data.user
                    };
                });
                setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
            });

            return () => {
                unsubscribe();
            };
        };

        getMessages();
    }, []);

    const onSend = useCallback(async (newMessages = []) => {
        const chatRoomDocRef = await createChatRoom();
        const messagesRef = collection(chatRoomDocRef, 'messages');
        console.log(chatRoomDocRef)
        const promises = newMessages.map((message) => {
            const messageId = Math.random().toString(36).substring(7); // generate a random ID for each message
            const createdAt = new Date();
            const messageData = {
                _id: messageId, // add the generated ID to the message object
                text: message.text,
                createdAt: createdAt,
                user: {
                    _id: traveler.traveler_id,
                    name: traveler.firstName,
                    avatar: traveler.Picture
                }
            };
            return addDoc(messagesRef, messageData);
        });

        Promise.all(promises)
            .then(() => {
                console.log('Messages sent');
            })
            .catch((error) => {
                console.error(error);
            });
        console.log(chatRoomDocRef)
        // Add the new messages to the messages array in the chat room
        const newMessagesData = newMessages.map((message) => ({

            text: message.text,
            user: {
                _id: traveler.traveler_id,
                name: traveler.first_name,
                avatar: traveler.Picture
            },
            createdAt: new Date(),
        }));
        console.log(chatRoomDocRef)
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessagesData));
    }, [createChatRoom, traveler]);

    return (
        <View style={styles.container}>
            <GradientBackground>
                <GiftedChat
                    showAvatarForEveryMessage={true}
                    messages={messages}
                    onSend={onSend}
                    user={{
                        _id: traveler.traveler_email,
                        avatar: traveler.Picture
                    }}
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
