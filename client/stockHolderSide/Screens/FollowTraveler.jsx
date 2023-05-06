import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';


export default function FollowTraveler(props) {
  const navigation = useNavigation();
  const traveler = props.route.params.traveler;
  console.log("kkkkkkkkkkkk",traveler);

  useEffect(() => {
    getLocationTraveler()
  }, []);

  const getLocationTraveler = () => {
    const objTravelerId = {
      TravelerId: traveler.traveler_id
    }
    console.log("hhhhhh",objTravelerId);
      fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/locations', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objTravelerId),
      })
        .then(response => response.json())
        .then(data => {
          console.log('********', { data })
          
        }
        )
        .catch(error => {
          console.error(error);
          console.log('Error');
        });
    }

  return (
    < GradientBackground>
      <BackButton />
      <View style={styles.container}>
       
      </View>
    </GradientBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",

  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    resizeMode: "contain"
  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    top: 0
  },
});