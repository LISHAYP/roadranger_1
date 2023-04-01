import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import { useEffect } from 'react';

export default function NewEvent(props) {
  const traveler = props.route.params.traveler;
  const userLocation = props.route.params.userLocation
  const navigation = useNavigation();

  const type = [
    //creating type of different eventtypes
    { label: 'Weather', value: '1' },
    { label: 'Car Accidents', value: '2' },
  ]

  const id = traveler.traveler_id;
  const [value, setValue] = useState(null);
  const [details, setDetails] = useState('');
<<<<<<< HEAD
=======
  // const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  // const [eventTime, setEventTime] = useState(`${new Date().getHours()}:${new Date().getMinutes()}`);
>>>>>>> orian
  const [eventStatus, setEventStatus] = useState('true');
  const [picture, setPicture] = useState('#');
  const [stackholderId, setStackholderId] = useState('null');
  const [serialTypeNumber, setSerialTypeNumber] = useState('');
  const [countryNumber, setCountryNumber] = useState('1');
  const [areaNumber, setAreaNumber] = useState('1');

  const newEvent = {
    details: details,
    event_date: new Date().toISOString().slice(0, 10),
    event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    event_status: eventStatus,
    picture: picture,
    travelerId: id,
    country_number: countryNumber,
    area_number: areaNumber,
    stackholderId: stackholderId,
    serialTypeNumber: serialTypeNumber,
    latitude: userLocation.coords.latitude,
    longitude: userLocation.coords.longitude
  };
<<<<<<< HEAD
=======
  console.log('new',newEvent);
>>>>>>> orian

  const createEvent = async () => {
   if (newEvent.details === '' || newEvent.serialTypeNumber === '') {
      alert('Please enter details and type');    
    }
else{
    // Send a POST request to your backend API with the event data
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/newevent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    })
      .then(response => response.json())
      .then(data => {

        // Handle the response data as needed
        console.log(data);
<<<<<<< HEAD
        navigation.navigate('Forgot password'); // Navigate back to the "Around You" screen
=======
        console.log({ newEvent })
        alert('Publish')
>>>>>>> orian
      })
      .catch(error => {
        console.error(error);
        alert('Error',error);
      });
    }
  }


  return (
    < GradientBackground>

      <ScrollView>
        <View style={styles.container}>
          <Image source={RoadRanger} style={styles.RoadRanger} />
          <Text style={styles.text}>What Happend:</Text>
          <TextInput style={styles.input}
            value={details}
            onChangeText={(text) => setDetails(text)}
            placeholder="Write here..."
            multiline
            spellCheck="true"
            onSubmitEditing={() => {
              //close the keyboard
              TextInput.State.blur(TextInput.State.currentlyFocusedInput())
            }}>
          </TextInput>
          <Text style={styles.text}>Type:</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={type}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={"Select type of event"}
            value={value}
            onChange={item => {
              setSerialTypeNumber(item.value)
            }} />
          <TouchableOpacity style={styles.photo} >
            <Icon name="camera-outline" style={styles.icon} size={30} color={'white'} />
            <Text style={styles.btnText}>
              Add Photo
            </Text>
          </TouchableOpacity>
        
          <TouchableOpacity style={styles.btnSave} onPress={createEvent}>
            <Text style={styles.btnText}>
              Publish
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView >
    </GradientBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",

  },

  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100,
    marginBottom: 20

  },
  text: {
    color: '#144800',
    fontSize: 20,

  },


  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,

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
  text1: {
    fontSize: 18,
    alignSelf: 'center',
    color: "#A9A9A9"
  },

  input: {
    flexDirection: 'row',
    marginVertical: 10,
    width: "90%",
    fontSize: 20,
    paddingVertical: 70,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 25,


  },
  photo: {
    marginVertical: 20,
    width: "80%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: '#144800',
    marginBottom: 50,
    flexDirection: 'row',

  },
  icon: {
    left: 30,
    size: 30,
    marginRight: 50

  },
  // label: {
  //   position: 'absolute',
  //   backgroundColor: 'white',
  //   left: 22,
  //   top: 8,
  //   zIndex: 999,
  //   paddingHorizontal: 8,
  //   fontSize: 14,


  // },
  placeholderStyle: {
    fontSize: 18,
    color: "#A9A9A9"
  },
  selectedTextStyle: {
    fontSize: 18,
  },
  btnSave: {
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
});