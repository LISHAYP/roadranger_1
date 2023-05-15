import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import { useEffect } from 'react';
import BackButton from '../Components/BackButton';
import * as Notifications from 'expo-notifications';
import { auth } from '../firebase';


export default function NewEvent(props) {
  const traveler = props.route.params.traveler;
  const userLocation = props.route.params.userLocation;
  const labels = props.route.params.labels;
  const navigation = useNavigation();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const serialType = [
    //creating type of different eventtypes
    { label: 'Weather', value: '1' },
    { label: 'Car Accidents', value: '1002' },
    { label: 'Road closures', value: '2' },
    { label: 'Natural disasters', value: '3' },
    { label: 'Health emergencies', value: '4' },
    { label: 'Accommodation issues', value: '5' },
    { label: 'Protests', value: '6' },
    { label: 'Strikes', value: '7' },
    { label: 'Security threats', value: '8' },
    { label: 'Animal-related incidents', value: '9' },
    { label: 'Financial issues', value: '10' }
  ]

  const id = traveler.traveler_id;
  const [details, setDetails] = useState('');
  const [eventStatus, setEventStatus] = useState('true');
  const [picture, setPicture] = useState('#');
  const [stackholderId, setStackholderId] = useState('null');
  const [serialTypeNumber, setSerialTypeNumber] = useState('');
  const [countryNumber, setCountryNumber] = useState('');
  const [areaNumber, setAreaNumber] = useState('');
  const [selectedSerialType, setSelectedSerialType] = useState(null);


  useEffect(() => {
    //insert the API Key
    Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');
    Geocoder.from(userLocation.coords.latitude, userLocation.coords.longitude)
      .then(json => {
        const addressComponents = json.results[0].address_components;
        const countryComponent = addressComponents.find(component => component.types.includes('country'));
        const cityComponent = addressComponents.find(component => component.types.includes('locality'));
        // const continentComponent = addressComponents.find(component => component.types.includes('continent'));
        setCountry(countryComponent.long_name);
        setCity(cityComponent.long_name);
        addContry();
        console.log("////", labels);
      })
      .catch(error => console.warn(error))
  }, []);


  const newEvent = {
    Details: details,
    event_date: new Date().toISOString().slice(0, 10),
    event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    Latitude: userLocation.coords.latitude,
    Longitude: userLocation.coords.longitude,
    event_status: eventStatus,
    Picture: picture,
    TravelerId: id,
    StackholderId: stackholderId,
    serialTypeNumber: serialTypeNumber,
    country_number: countryNumber,
    area_number: areaNumber,
    labels: JSON.stringify(labels)
  };
  //console.log("--------", { newEvent, labels })
  const countryObj = {
    country_name: country,
  };
  addContry = () => {

    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/country', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(countryObj),
    })
      .then(response => response.json())
      .then(data => {

        setCountryNumber(data)
        addCity();
      }
      )
      .catch(error => {
        console.error(error);

      });
  }

  addCity = () => {
    const areaObj = {
      country_number: countryNumber,
      area_name: city
    }

    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/area', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaObj),
    })
      .then(response => response.json())
      .then(data => {
        setAreaNumber(data)

      }
      )
      .catch(error => {
        console.error(error);
        console.log('Error');
      });
  }
  const createEvent = async () => {

    if (newEvent.Details === '' || newEvent.serialTypeNumber === '') {
      Alert.alert('Please enter details and type');
    }
    else {
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
          //console.log({ data })
          const comonventdetailsObj = {
            serialTypeNumber: serialTypeNumber,
            event_status: eventStatus,
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude
          };
          fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/neweventdistance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(comonventdetailsObj),
          })
            .then(response => response.json())
            .then(data1 => {
              console.log("related?*************", data1);
              // Search term for the label description
              const searchTerm = 'Product';

              // Loop through the array of events
              const filteredEvents = data1.filter(event => {
                // Parse the labels string into an array of objects
                const labels = JSON.parse(event.labels);

                // Check if any of the objects in the labels array have a description that matches the search term
                return labels.some(label => label.description.toLowerCase().includes(searchTerm.toLowerCase()));
              })

              // Log the filtered events to the console
              console.log("filteredEvents",filteredEvents);
              Alert.alert('Publish')
              navigation.goBack(); // Navigate back to the "Around You" screen
            })
            .catch(error => {
              console.error(error);
              Alert.alert('Error', error);
            });
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', error);
        });
    }
  }

  const OpenCameraE = () => {
    navigation.navigate('CameraE', { idE: `${new Date().getHours()}:${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`, userLocation, traveler });
    const date = `${new Date().getHours()}_${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`
    setPicture(`http://cgroup90@194.90.158.74/cgroup90/prod/uploadEventPic/E_${date}.jpg`)
  }

  return (
    < GradientBackground>
      <ScrollView>
        <View style={styles.container}>
          <BackButton />
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
            data={serialType}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={"Select type of event"}
            value={selectedSerialType}
            onChange={item => {
              setSerialTypeNumber(item.value)
              setSelectedSerialType(item) // Update the selected item state variable

            }} />

          <TouchableOpacity style={styles.photo} onPress={OpenCameraE}>
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
    marginTop: 20,
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



