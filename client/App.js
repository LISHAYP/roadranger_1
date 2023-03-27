import { StatusBar } from 'expo-status-bar';
import { Settings, StyleSheet, Text, View } from 'react-native';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import AroundYou from './Screens/AroundYou';
import Setting from './Screens/Setting'
import ContactUs from './Screens/ContactUs';

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ForgotPassword from './Screens/ForgotPassword';

const Stack = createNativeStackNavigator()
export default function App() {
  return (
    <AroundYou/>
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Sign In">
    //     <Stack.Screen name="Sign In" component={SignIn} />
    //     <Stack.Screen name="Sign Up" component={SignUp} />
    //     <Stack.Screen name="Around You" component={AroundYou} />
    //     <Stack.Screen name="Contact Us" component={ContactUs} />
    //     <Stack.Screen name="Forgot password" component={ForgotPassword} />
    //     <Stack.Screen name="Setting" component={Setting} />

    //   </Stack.Navigator> 
    // </NavigationContainer>
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