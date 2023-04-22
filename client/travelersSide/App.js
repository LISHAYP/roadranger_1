import { StatusBar } from 'expo-status-bar';
import { Settings, StyleSheet, Text, View } from 'react-native';
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
import { onAuthStateChanged } from 'firebase/auth'
import { createContext } from 'react';
import GroupChat from './Screens/GroupChat'

const Stack = createNativeStackNavigator()

export default function App() {

//   requestUserPremission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//     }
//   }

//   useEffect(()=>{
//   if(requestUserPremission()){
//       //return fcm token for the device
//       messaging().getToken().then(token=>{
//         console.log(token);
//       });
//   }
//   else{
//     console.log("Failed token status",authStatus);
//   } 
//   // Check whether an initial notification is available
//   messaging()
//   .getInitialNotification()
//   .then(async remoteMessage => {
//     if (remoteMessage) {
//       console.log(
//         'Notification caused app to open from quit state:',
//         remoteMessage.notification,
//       );
//     }
//   });

//   // Assume a message-notification contains a "type" property in the data payload of the screen to open

//   messaging().onNotificationOpenedApp(async(remoteMessage)  => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//   });

//   // Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// const unsubscribe = messaging().onMessage(async remoteMessage => {
//   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
// });

// return unsubscribe;


//   },[])


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