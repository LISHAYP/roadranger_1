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
const Stack = createNativeStackNavigator()

// const AuthenticatedUserContext = createContext({});
// const AuthenticatedUserProvider = ({children}) => {
//   const [user, setUser] = useState(null);
//   return(
//     <AuthenticatedUserContext.Provider value={{user, setUser}}>
//       {children}
//     </AuthenticatedUserContext.Provider>
//   )
// }
export default function App() {
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