import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import GradientBackground from '../Components/GradientBackground';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BackButton from '../Components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoadRanger from '../assets/RoadRanger.png';

const HomeChat = (props) => {
  const navigation = useNavigation();
  const traveler = props.route.params;
  const [travelers, setTravelers] = useState([]);
  const [activeChats, setActiveChats] = useState([]);

  useEffect(() => {
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/Traveler')
      .then((response) => response.json())
      .then((data) => {
        setTravelers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useFocusEffect(() => {
    const getActiveChats = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('activeChats');
        if (jsonValue !== null) {
          setActiveChats(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    getActiveChats();
  });
  //AsyncStorage.clear();
  const handleUserPress = async (user, loggeduser) => {
    // Check if the traveler is already in activeChats
    const existingIndex = activeChats.findIndex((traveler) => traveler.traveler_id === user.traveler_id);
    if (existingIndex === -1) {
      const updatedActiveChats = [...activeChats, user];
      setActiveChats(updatedActiveChats);
      try {
      
        await AsyncStorage.setItem('activeChats', JSON.stringify(updatedActiveChats));
      } catch (e) {
        console.error(e);
      }
    }
    navigation.navigate('Chat', { user, loggeduser });
  };
  

  return (
    <View style={styles.container}>
      <GradientBackground>
        <BackButton />
        <Image source={RoadRanger} style={styles.RoadRanger} />
        <TouchableOpacity style={styles.groupChatBtn} onPress={() => { navigation.navigate("Group chat", traveler) }}>
          <Text style={styles.btnText}>
            group chat
          </Text>
        </TouchableOpacity>
        <View style={styles.chatContainer}>
          <ScrollView>
            {travelers.map((traveler1) => (
              <TouchableOpacity key={traveler1.id} onPress={() => handleUserPress(traveler1, traveler)}>
                <View style={styles.row}>
                  <Image style={styles.img} source={{ uri: traveler1.Picture }} />
                  <Text style={styles.text}>{traveler1.first_name} </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.groupChatBtn}>
              <Text style={styles.btnText}>
                active chats
              </Text>
            </View>
        <View style={styles.chatContainer}>
          <ScrollView>
            {activeChats.map((traveler2) => (
              <TouchableOpacity key={traveler2.id} onPress={() => handleUserPress(traveler2, traveler)}>
                <View style={styles.row}>
                  <Image style={styles.img} source={{ uri: traveler2.Picture }} />
                  <Text style={styles.text}>{traveler2.first_name} </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </GradientBackground>
    </View>
  );
};

export default HomeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    top: 0,
  },
  groupChatBtn: {
    marginVertical: 20,
    width: "50%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: '#144800'
  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,
  },
  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100

  },
  chatContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 15,
    padding: 10,
    height: '25%',
    width: '80%',
    alignSelf: 'center',
  },
});
