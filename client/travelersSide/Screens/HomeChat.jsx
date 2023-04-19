import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../Components/GradientBackground';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BackButton from '../Components/BackButton';

const HomeChat = (props) => {
  const navigation = useNavigation();
  const traveler = props.route.params;
  const [travelers, setTravelers] = useState([]);

  useEffect(() => {
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/Traveler')
      .then((response) => response.json())
      .then((data) => {
        setTravelers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleUserPress = (user, loggeduser) => {
    console.log(user,loggeduser)
    navigation.navigate('Chat', {user,loggeduser});
  };

  return (
    <View style={styles.container}>
      <GradientBackground>
        <Text>HomeChat</Text>
        {travelers.map((traveler1) => (
          <TouchableOpacity key={traveler1.id} onPress={() => handleUserPress(traveler1,traveler)}>
            <View style={styles.row}>
              <Image style={styles.img} source={{ uri: traveler1.Picture }} />
              <Text style={styles.text}>{traveler1.first_name} </Text>
            </View>

            <BackButton />

          </TouchableOpacity>
        ))}
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
    alignItems: 'center',
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
});
