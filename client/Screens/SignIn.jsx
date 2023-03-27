import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import React from 'react'
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import GradientBackground from '../Components/GradientBackground';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const traveler = {
        travler_email: email,
        password: password
    }

    const handleLogin = () => {
        fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(traveler),
        })
            .then(response =>  response.json())
            .then(data => {
                // Handle the response data as needed
                console.log(email, password)
                console.log(data);
                navigation.navigate("Around You",{email})
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Failed to sign in. Please try again later.');
            });
    };


    const navigation = useNavigation();
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



                <TouchableOpacity onPress={() => {
                    navigation.navigate("Forgot password")
                }}>
                    <Text >
                        Forgot you're password?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnLogIn}
                    onPress={handleLogin}>
                    <Text style={styles.btnText}>
                        Log In
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
