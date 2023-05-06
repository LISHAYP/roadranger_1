import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';
import GradientBackground from '../Components/GradientBackground';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BackButton from '../Components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import { Swipeable , GestureHandlerRootView } from 'react-native-gesture-handler';


const HomeChat = (props) => {
  const navigation = useNavigation();
  const stakeholder=props.route.params.stakeholder;
  console.log('aaa', stakeholder)
  const [travelers, setTravelers] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/Traveler')
      .then((response) => response.json())
      .then((data) => {
        console.log("All travelers:", data);
        console.log("Stakeholder name:", stakeholder.StakeholderName);
        const filteredTravelers = data.filter((traveler) => traveler.insurence_company === stakeholder.StakeholderName);
        setTravelers(filteredTravelers);
      })
      .catch((error) => console.error(error));
  }, [stakeholder]);

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
  const handleUserPress = async (user, loggeduser) => {
    const isUserPresent = activeChats.find((chatUser) => chatUser.traveler_id === user.traveler_id);
    if (!isUserPresent) {
      const updatedActiveChats = [user, ...activeChats];
      setActiveChats(updatedActiveChats);
      try {
        await AsyncStorage.setItem('activeChats', JSON.stringify(updatedActiveChats));
      } catch (e) {
        console.error(e);
      }
    }
    console.log(user, loggeduser)
    navigation.navigate('Chat', { user, loggeduser });
  };


  const handleClearActiveChats = async () => {
    try {
      await AsyncStorage.removeItem('activeChats');
      setActiveChats([]);
    } catch (e) {
      console.error(e);
    }
  };
  const renderRightActions = (user) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteChat(user)}>
      <Icon name="trash-outline" size={35} />
    </TouchableOpacity>
  );

  const handleDelete = async (user) => {
    const updatedActiveChats = activeChats.filter((chatUser) => chatUser.traveler_id !== user.traveler_id);
    setActiveChats(updatedActiveChats);
    try {
      await AsyncStorage.setItem('activeChats', JSON.stringify(updatedActiveChats));
    } catch (e) {
      console.error(e);
    }
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      <GradientBackground>
        <ScrollView>
          <View style={styles.back}>
            <BackButton />
          </View>
          <View>
            <Image source={{ uri: stakeholder.picture }} style={styles.user} />
            <Text style={styles.name}>
              {stakeholder.FullName} {stakeholder.StakeholderName}
            </Text>
          </View>

          <View
            style={styles.chatContainer}
          >
            <ScrollView>
              <TouchableOpacity style={styles.row} onPress={handleClearActiveChats}>
                <Icon name="trash-outline" size={35} style={styles.icon} />
                <Text style={styles.text}>Clear all chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.row} onPress={() => setShowModal(true)}>
                <Icon name="search-outline" size={35} style={styles.icon} />
                <Text style={styles.text}>Search </Text>
              </TouchableOpacity>
              <Modal
                visible={showModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setShowModal(false)}
              >
                <View style={styles.modal}>
                  <TouchableOpacity onPress={() => setShowModal(false)} style={styles.btnClose}>
                    <Icon name="close-outline" size={35} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a user"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                  />
                  <ScrollView>
                    {travelers
                      .filter(traveler1 => traveler1.first_name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((traveler1) => (
                        <TouchableOpacity key={traveler1.id} onPress={() => {
                          handleUserPress(traveler1, stakeholder);
                          setShowModal(false);
                        }}>
                          <View style={styles.row}>
                            <Image style={styles.img} source={{ uri: traveler1.Picture }} />
                            <Text style={styles.text}>{traveler1.first_name} </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              </Modal>
              <TouchableOpacity style={styles.row} onPress={() => { navigation.navigate("Group chat", traveler) }}>
                <Image style={styles.img} source={{ uri: 'https://img.fruugo.com/product/1/86/14364861_max.jpg' }} />
                <Text style={styles.text}>
                 Group chat
                </Text>
              </TouchableOpacity>
              {activeChats.map((traveler2) => (
                <Swipeable
                renderRightActions={() => renderRightActions(traveler2)}
                onSwipeableRightOpen={() => handleDelete(traveler2)}
              >
                <TouchableOpacity onPress={() => handleUserPress(traveler2, stakeholder)}>
                  <View style={styles.row}>
                    <Image style={styles.img} source={{ uri: traveler2.Picture }} />
                    <Text style={styles.text}>{traveler2.first_name}</Text>
                  </View>
                </TouchableOpacity>
              </Swipeable>
              
              ))}
            </ScrollView>

          </View>
        </ScrollView>
      </GradientBackground>

    </View>
    </GestureHandlerRootView>


  );
};

export default HomeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  searchInput: {
    padding: 20,
    fontSize: 20
  },
  dropdown: {
    height: 40,
    borderColor: '#8FBC8F',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
    width: "90%",

  },
  btnClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  row: {

    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'white',
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    padding: 10,
    // width:'70%'
    borderColor: 'rgba(0, 0, 0, 0.07)',
    borderWidth: 2,
    borderRadius: 15,
    margin: 5
  },
  group: {
    top: 20
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
    top: 20,
    marginVertical: 20,
    // width: "50%",
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
    // backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 15,
    padding: 10,
    // height: '30%',
    // width: '50%',
    top: 20,

  },
  back: {
    paddingTop: 30,
    marginLeft: 20
  },
  user: {
    alignSelf: 'center',
    // resizeMode: 'cover',
    height: 150,
    borderRadius: 75,
    width: 150,

  },
  name: {
    position: "absolute",
    fontSize: 20,
    alignSelf: 'center',
    top: 150
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 100,
    marginBottom: 100,
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clear: {
    position: 'absolute',
    right: 20
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    position: 'absolute',
    right: 0,
  },
});
