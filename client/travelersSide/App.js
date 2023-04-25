import { StatusBar } from 'expo-status-bar';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import AroundYou from './Screens/AroundYou';
import Setting from './Screens/Setting'
import ContactUs from './Screens/ContactUs';
import NewEvent from './Screens/NewEvent';
import SOS from './Screens/SOS';
import Search from './Screens/Search'
import Events from './Screens/Events';
// import TimeLine from './Screens/TimeLine'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ForgotPassword from './Screens/ForgotPassword';
import EventDetails from './Screens/EventDetails';
import OpenCamera from './Components/OpenCamera';
import OpenCameraE from './Components/OpenCameraE';
import OpenCameraSOS from './Components/OpenCameraSOS';
import Chat from './Screens/Chat';
import HomeChat from './Screens/HomeChat';
import BackButton from './Components/BackButton';
import GroupChat from './Screens/GroupChat'
import {  StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function App() {
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
  const Stack = createNativeStackNavigator()
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

    <NavigationContainer>
    <Stack.Navigator initialRouteName="Sign In" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Sign In" component={SignIn} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="Around You" component={AroundYou} />
        <Stack.Screen name="Contact Us" component={ContactUs} />
        <Stack.Screen name="Forgot password" component={ForgotPassword} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="New event" component={NewEvent} />
        <Stack.Screen name="SOS" component={SOS} />
        {/* <Stack.Screen name="TimeLine" component={Timeline} /> */}
        <Stack.Screen name="Camera" component={OpenCamera} />
        <Stack.Screen name="CameraE" component={OpenCameraE} />
        <Stack.Screen name="CameraSOS" component={OpenCameraSOS} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Event Details" component={EventDetails} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Home chat" component={HomeChat} />
        <Stack.Screen name="BackButton" component={BackButton} />
        <Stack.Screen name="Group chat" component={GroupChat} />
        {props => (
        <View style={styles.container}>
          <Text>Expo Push Token: {expoPushToken}</Text>
        </View>
      )}
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});