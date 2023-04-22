import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import GradientBackground from '../Components/GradientBackground';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);
    const navigation = useNavigation();
    const [location, setLocation] = useState('');
    const [travelerId, setTravlerId] = useState('')

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
    }, []);
    const handleLogin = () => {
        const traveler = {
            travler_email: email,
            password: password
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
                    setTravlerId(data.traveler_id)
                    signInWithEmailAndPassword(auth, traveler.travler_email, traveler.password)
                    navigation.navigate("Around You", { data });

                } else {
                    setLoginFailed(true);
                    console.log('Error', 'Invalid email or password. Please try again.');
                }


            })


            .catch(error => {
                console.error(error);
                console.log('Error', 'Failed to sign in. Please try again later.');
            });
        saveLocation();
    };

    const saveLocation = () => {
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
    }


    const saveUserLocation = () => {
        const now = new Date();
        const DateAndTimeFormat = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`; console.log('dateeeee', DateAndTimeFormat)
        const userLoction = {

            DateAndTime: DateAndTimeFormat,
            Latitude: location.coords.latitude,
            Longitude: location.coords.longitude,
            TravelerId: travelerId
        }
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

    state = {
        showPassword: false
    };
    return (
        < GradientBackground>
            <View style={styles.container}>
                <Image source={RoadRanger} style={styles.RoadRanger} />
                <Text style={styles.text}>Email:</Text>
                <TextInput style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="User Email">
                </TextInput>
                {console.log({ email })}
                <Text style={styles.text}>Password:</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    placeholder="*******"
                    secureTextEntry={!this.state.showPassword}
                >
                    {/* <Icon
                        name={this.state.showPassword ? 'eye-outline' : 'eye-outline'}
                        size={30}
                        onPress={() =>
                            this.setState(prevState => ({
                                showPassword: !prevState.showPassword
                            }))
                        }
                    /> */}
                </TextInput>
                {console.log({ password })}
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
                        Forgot you're password?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSignUp} onPress={() => {
                    navigation.navigate("Sign Up");
                }}>
                    <Text > Don't have an Account?  </Text>
                    <Text style={styles.text1}> Click Here </Text>

                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 150 }} onPress={() => {
                    navigation.navigate("Contact Us");
                }}>
                    <Icon name="mail-open-outline" size={30} />
                    <Text style={styles.contact}>
                        Contact us
                    </Text>
                </TouchableOpacity>
            </View >
        </ GradientBackground>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        width: "100%",
        marginTop: 100

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
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center'

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
        backgroundColor: '#144800'
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
