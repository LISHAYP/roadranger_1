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
  const [relatedEvents, setRelatedEvents] = useState('');

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
    } else {
      // Send a POST request to your backend API with the event data
      fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/newevent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })
        .then(response => response.json())
        .then(data => {
          const comonventdetailsObj = {
            serialTypeNumber: serialTypeNumber,
            event_status: eventStatus,
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          };
          fetch(
            'http://cgroup90@194.90.158.74/cgroup90/prod/api/post/neweventdistance',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(comonventdetailsObj),
            }
          )
            .then(response => response.json())
            .then(data1 => {
              const relatedEventsData = data1; // Assign the data to a constant variable
              const matchedEvents = []; // Array to store matched events
  
              for (let i = 0; i < relatedEventsData.length; i++) {
                const event = relatedEventsData[i];
                if (compareLabels(event, newEvent)) {
                  matchedEvents.push(event);
                  break;
                }
              }
              if (matchedEvents.length > 0) {
                console.log('Matches found:', matchedEvents);
              } else {
                console.log('No matches found');
              }
              Alert.alert('Publish');
              const data = traveler;
              navigation.navigate("Around You", { data, matchedEvents});
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
  };
  
  const compareLabels = (event1, event2) => {
    if (!event1.labels || !event2.labels) {
      // If either event is missing the labels property, return false
      return false;
    }
  
    if ( event1.Details === event2.Details) {
      // If Details are defined and identical, return false
      return false;
    }
  
    const labels1 = JSON.parse(event1.labels).map(label => label.description);
    const labels2 = JSON.parse(event2.labels).map(label => label.description);
  
    for (const label1 of labels1) {
      for (const label2 of labels2) {
        if (label1 === label2) {
          return true;
        }
      }
    }
  
    return false;
  };
  
  
  
  

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
    alignSelf:'center'

  },

  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
   width: 0,
  height: 4},
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9

  },
  text: {
    color: '#144800',
    fontSize: 20,
    left:15,
  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,
   
  },

  dropdown: {
    alignSelf: 'center',
    height: 40,
    borderColor: '#8FBC8F',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
    width: "95%",

  },
  input: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    width: "100%",
    fontSize: 20,
    paddingVertical: 70,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 15,

  },
  photo: {
    marginVertical: 20,
    width: "70%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#144800',
    marginBottom: 40,
    flexDirection: 'row',
    shadowColor: "#000",
        shadowOffset: {
     	width: 0,
	    height: 4},
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9

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
   height:55,
    marginVertical: 20,
    width: "55%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#144800',
    shadowColor: "#000",
        shadowOffset: {
     	width: 0,
	    height: 5},
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9
  },
});



