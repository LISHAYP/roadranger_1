import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import GradientBackground from '../Components/GradientBackground';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef } from 'react';
import { Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const navigation = useNavigation();
  const [location, setLocation] = useState('');
  const [travelerId, setTravlerId] = useState('')
  const [devaiceToken, setDevaiceToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, [handleLogin]);

  const handleLogin = () => {
    const traveler = {
      travler_email: email,
      password: password
    };
    const changeToken = {
      travler_email: email,
      token: devaiceToken
    };
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(traveler),
    })
      .then(response => response.json())
      .then(data => {
        if (data.travler_email === email && data.password === password) {
          console.log("*********", data)
          console.log("*********", data.traveler_id)
          setTravlerId(data.traveler_id)
          fetch(`http://cgroup90@194.90.158.74/cgroup90/prod/api/traveler/updatetoken?email=${traveler.travler_email}`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(changeToken),
          })
            .then((response) => response.json())
            .then((data1) => {
              console.log(data1);
              console.log(data); // Traveler updated successfully.
              //Alert.alert('Token updated successfully')
              //signInWithEmailAndPassword(auth, traveler.travler_email, traveler.password)
              // saveLocation();
              navigation.navigate("Around You", { data });
            })
            .catch((error) => {
              console.error(error);
            });

        } else {
          setLoginFailed(true);
          console.log('Error', 'Invalid email or password. Please try again.');
        }
      })
      .catch(error => {
        console.error(error);
        console.log('Error', 'Failed to sign in. Please try again later.');
      });
    
  };
  
  useEffect(() => {
    try {
      if (!location) {
        console.log('Location data is not available');
        return;
      }
      AsyncStorage.setItem('latitude', location.coords.latitude.toString());
      AsyncStorage.setItem('longitude', location.coords.longitude.toString());
      console.log('Location saved successfully!');
      console.log(location.coords.latitude)
      console.log(location.coords.longitude)
      saveUserLocation()
    } catch (error) {
      console.log(error);
    }
  }, [travelerId]);

  const saveUserLocation = () => {
    console.log("&&&&&&&&&&&&&&&&",travelerId)
    const now = new Date();
    const DateAndTimeFormat = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`; console.log('dateeeee', DateAndTimeFormat)
    const userLoction = {

      DateAndTime: DateAndTimeFormat,
      TravelerId: travelerId,
      Latitude: location.coords.latitude,
      Longitude: location.coords.longitude
    }
    console.log("^^^^^^^^^", userLoction)
    //Send a POST request to your backend API with the 
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/traveler/location', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLoction),
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  }
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setDevaiceToken(token);
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    < GradientBackground>
      <View style={styles.container}>
        <Image source={RoadRanger} style={styles.RoadRanger} />

        <View style={styles.frame}>
          <Text style={styles.text}>Email:</Text>
          <TextInput style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="User Email">
          </TextInput>


          <Text style={styles.text}>Password:</Text>
          <View style={styles.input}>
            <TextInput

              value={password}
              onChangeText={text => setPassword(text)}
              placeholder="*********"
              secureTextEntry={!showPassword}
            >
            </TextInput>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconContainer}
            >
              <Icon size={25}
                name={showPassword ? 'eye-off' : 'eye'}
                type='feather'
                color={'#144800'}
              />
            </TouchableOpacity>
          </View>
          {loginFailed && (
            <Text style={{ color: 'red' }}>Invalid email or password. Please try again.</Text>
          )}


          <TouchableOpacity style={styles.btnLogIn}
            onPress={handleLogin}>
            <Text style={styles.btnText}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate("Forgot password")
          }}>
            <Text >
              Forgot your password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSignUp} onPress={() => {
            navigation.navigate("Sign Up");
          }}>
            <Text > Don't have an Account?  </Text>
            <Text style={styles.text1}> Click Here </Text>

          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', marginTop: 50 }} onPress={() => {
            navigation.navigate("Contact Us");
          }}>

            <Icon name="mail-open-outline" size={30} color={'#144800'} />
            <Text style={styles.contact}>
              Contact us
            </Text>
          </TouchableOpacity>
        </View>
      </View >
    </ GradientBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // marginVertical: 10,
    // marginHorizontal: 10,
    padding: 20,
    width: "100%",
    marginTop: 100,
    // backgroundColor:'#F0FFF0'
    // backgroundColor:'#3CB371'

  },
  frame: {
    // backgroundColor:  'rgba(0, 0, 0, 0.07)',
    padding: 20,
    borderWidth: 0,
    borderRadius: 25,
    borderColor: 'rgba(0, 0, 0, 0.07)'

  },
  iconContainer: {
    size: 35
  },
  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100

  },
  text: {
    color: '#144800',
    fontSize: 30,
  },
  input: {
    marginVertical: 20,
    width: "90%",
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnLogIn: {
    marginVertical: 20,
    width: "50%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: '#144800',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9
  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,
  },
  btnSignUp: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20
  },
  contact: {
    fontSize: 20,
    alignSelf: 'center',
    marginLeft: 10,
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 15,

  }
});