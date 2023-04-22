import React, { useLayoutEffect, useEffect, useCallback, useState } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, doc, addDoc, query, where, getDocs, orderBy, onSnapshot, push, ref } from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import GradientBackground from '../Components/GradientBackground';
import BackButton from "../Components/BackButton";
import { v4 as uuidv4 } from 'uuid';


export default function Chat(props) {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const traveler1 = props.route.params.user;
    const traveler = props.route.params.loggeduser;
    const [chatRoomDocRef, setChatRoomDocRef] = useState('')
    const [shouldRender, setShouldRender] = useState(false); // add state variable

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
        const sortedUsers = [traveler.traveler_id, traveler1.traveler_id].sort();
        const chatRoomQuery = query(collection(database, 'chat_rooms'), where('users', '==', sortedUsers));
        const chatRoomQuerySnapshot = await getDocs(chatRoomQuery);
        if (chatRoomQuerySnapshot.size !== 0) {
            const existingChatRoomRef = chatRoomQuerySnapshot.docs[0].ref;
            setChatRoomDocRef(chatRoomQuerySnapshot.docs[0].ref);
            console.log('Chat room exists');
            const messagesRef = collection(database, 'chat_rooms', existingChatRoomRef.id, 'messages');
            const q = query(messagesRef,orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const messages = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  _id: uuidv4(),
                  createdAt: data.createdAt.toDate(),
                  text: data.text,
                  user: data.user
                };
              });
             // console.log('Fetched messages:', messages); // add this line
             setMessages(messages);
             setShouldRender(false); // update state variable to trigger re-render
            });
            return false; // indicate that chat room already exists
        } else {
            const newChatRoomDocRef = await addDoc(collection(database, 'chat_rooms'), {
                users: sortedUsers,
                messages: []
            });
            setChatRoomDocRef(newChatRoomDocRef);
            console.log('Chat room created');
            return true; // indicate that new chat room was created
        }
    };
    
    useLayoutEffect(() => {
        const getMessages = async () => {
          // Call createChatRoom() to make sure chat room exists
          const isNewChatRoom = await createChatRoom();
          if (!isNewChatRoom) {
            // If a new chat room was created, do any necessary setup here
            const messagesRef = collection(database, 'chat_rooms', chatRoomDocRef.id, 'messages');
            const q = query(messagesRef,orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const messages = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  _id: uuidv4(),
                  createdAt: data.createdAt.toDate(),
                  text: data.text,
                  user: data.user
                };
              });
             // console.log('Fetched messages:', messages); // add this line
             setMessages(messages);
             setShouldRender(false); // update state variable to trigger re-render
            });
      
            return () => {
              unsubscribe();
            };
          }
        };
      
        getMessages();
      }, [traveler, traveler1]);
      

      const onSend = useCallback(async (newMessages = []) => {
        const messagesRef = chatRoomDocRef ? collection(database, `chat_rooms/${chatRoomDocRef.id}/messages`) : null;
        if (messagesRef) {
          const promises = newMessages.map((message) => {
            const messageId = Math.random().toString(36).substring(7); // generate a random ID for each message
            const createdAt = new Date();
            const messageData = {
              _id: uuidv4(), // add the generated ID to the message object
              text: message.text,
              createdAt: createdAt,
              user: {
                _id: traveler.traveler_id,
                avatar: traveler.Picture
              }
            };
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messageData));
            return addDoc(messagesRef, messageData);
          });
      
          Promise.all(promises)
            .then(() => {
              console.log('Messages sent');
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, [traveler,traveler1, chatRoomDocRef]);
    

    return (
        <View style={styles.container}>
            <GradientBackground>
                <BackButton />
                {messages && (
                    <GiftedChat
                        showAvatarForEveryMessage={true}
                        messages={messages}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: traveler.traveler_id,
                            avatar: traveler.Picture
                        }}
                    />
                )}
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
