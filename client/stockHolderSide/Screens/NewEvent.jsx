import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch,Alert } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import { useEffect } from 'react';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NewEvent(props) {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });
  const stakeholder = props.route.params.stakeholder;
  // const userLocation = props.route.params.userLocation
  const navigation = useNavigation();
   console.log("--------------", stakeholder)
  // const serialType = [
  //   //creating type of different eventtypes
  //   { label: 'Missing traveler', value: '1003' },
  //   { label: 'Travel warning', value: '1004' },

  // ]
  
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const eventStatus = 'true';
  const [picture, setPicture] = useState('#');
  const stackholderId = stakeholder.StakeholderId
  const TravelerId = null;
  const serialTypeNumber = 1004;
  const [countryNumber, setCountryNumber] = useState('');
  const [areaNumber, setAreaNumber] = useState('');
  const [selectedSerialType, setSelectedSerialType] = useState(null);
  const [location, setLocation] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);


  useEffect(() => { 
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');       
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("&&&&&&&&&", currentLocation);
      setLocationFetched(true); // Set locationFetched to true after location is fetched  
      getLocation()
    })();
  }, []);
  
  const getLocation=()=>{
    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
    Geocoder.from(location.coords.latitude, location.coords.longitude)
      .then(json => {
        const addressComponents = json.results[0].address_components;
        const countryComponent = addressComponents.find(component => component.types.includes('country'));
        const cityComponent = addressComponents.find(component => component.types.includes('locality'));
        // const continentComponent = addressComponents.find(component => component.types.includes('continent'));
        setCountry(countryComponent.long_name);
        setCity(cityComponent.long_name);
        console.log("^^^^^^^^^^^^^^^^^^^^",location.coords.latitude)
       
      })
      .catch(error => console.warn(error))
  }

  useEffect(() => {
    addContry();

  }, [location,locationFetched]);

  const countryObj = {
    country_name: country,
  };

  addContry = () => {

    fetch(`${cgroup90}/api/post/country`, {
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
    fetch(`${cgroup90}/api/post/area`, {
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
    const newEvent = {
      Details: details,
      event_date: new Date().toISOString().slice(0, 10),
      event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      Latitude: location.coords.latitude,
      Longitude: location.coords.longitude,
      event_status: eventStatus,
      Picture: picture,
      TravelerId: TravelerId,
      StackholderId: stackholderId,
      serialTypeNumber: serialTypeNumber,
      country_number: countryNumber,
      area_number: areaNumber,
    };
    console.log("--------", { newEvent })
    if (newEvent.Details === '') {
      Alert.alert('Please enter details and type');
    }
    else {
      // Send a POST request to your backend API with the event data
      fetch(`${cgroup90}/api/post/newevent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),

      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          console.log({ data })
          Alert.alert('Publish')
          navigation.goBack(); // Navigate back to the "Around You" screen
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', error);
        });
    }
  }

  const OpenCameraE = () => {
    navigation.navigate('CameraE', { idE: `${new Date().getHours()}:${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}` });
    const date = `${new Date().getHours()}_${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`
    setPicture(`${cgroup90}/uploadEventPic/E_${date}.jpg`)
  }
  return (
    < GradientBackground>
       <BackButton text={"New Warning"}/>
      <Navbar stakeholder={stakeholder}/>
      <ScrollView>
        <View style={styles.container}>
       
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
       

          <TouchableOpacity style={styles.photo} onPress={OpenCameraE}>
            <Icon name="camera-outline" style={styles.icon} size={30} color={'white'} />
            <Text style={styles.btnPText}>
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
    marginTop: 120,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",
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
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8

  },
  text: {
    fontFamily:'Roboto_400Regular',
    color: '#144800',
    fontSize: 20,

  },


  btnText: {
    fontFamily:'Roboto_400Regular_Italic',
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 25,
    

  },
  btnPText: {
    fontFamily:'Roboto_400Regular',
    color: '#A9A9A9',
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
    fontFamily:'Roboto_400Regular',
    fontSize: 18,
    alignSelf: 'center',
    color: "#A9A9A9"
  },

  input: {
    fontFamily:'Roboto_400Regular',
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    width: "90%",
    fontSize: 20,
    paddingVertical: 70,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 15,
  },
  photo: {
    
    marginVertical: 20,
    width: "90%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 50,
    flexDirection: 'row',
    borderColor: '#144800',
    borderWidth: 1
  },
  icon: {
    left: 30,
    size: 30,
    marginRight: 50,
    color:'#A9A9A9',

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
    fontFamily:'Roboto_400Regular',
    fontSize: 18,
    color: "#A9A9A9"
  },
  selectedTextStyle: {
    fontSize: 18,
  },
  btnSave: {
            height: 55,
            marginVertical: 20,
            width: "50%",
            alignSelf: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderColor: '#426c32',
            borderWidth: 2,
            borderRadius: 15,
            backgroundColor: '#426c32',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9
  },
});



