import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';
import { Button, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { cgroup90 } from '../cgroup90';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);
    const [devaiceToken, setDevaiceToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = () => {
        const stakeholder = {
            StakeholderEmail: email,
            Password: password
        };
        const changeToken = {
            StakeholderEmail: email,
            token: devaiceToken
        };
        console.log("********", stakeholder);
        fetch(`${cgroup90}/api/post/stackholder`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stakeholder),
        })
            .then(response => response.json())
            .then(data => {
                if (data.StakeholderEmail === email && data.Password === password) {
                    fetch(`${cgroup90}/api/stackholder/updatetoken?email=${stakeholder.StakeholderEmail}`, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(changeToken),
                    })
                        .then((response) => response.json())
                        .then((data1) => {
                            console.log(data1); // stakeholder updated successfully.
                            //Alert.alert('Token updated successfully')
                            navigation.navigate("Around You", {stakeholder: data });
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

    const navigation = useNavigation();
    state = {
        showPassword: false
    };

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
                <Text style={styles.text}>Email:</Text>
                <TextInput style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="User Email">
                </TextInput>

                {console.log({ email })}

                <Text style={styles.text}>Password:</Text>
                <View  style={styles.input}>
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
                            color='black'
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
      })