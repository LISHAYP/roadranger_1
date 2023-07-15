import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Keyboard } from 'react-native';
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import GradientBackground from '../Components/GradientBackground';
import { Dropdown } from 'react-native-element-dropdown';
import BackButton from '../Components/BackButton';
import {
    useFonts,
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
  } from '@expo-google-fonts/roboto';

export default function ContactUs() {
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
    const Subject = [
        { label: 'General', value: '1' },
        { label: 'Help', value: '2' },
        { label: 'Question', value: '3' },
        { label: 'Create a stakeholder', value: '4' },
        { label: 'Faults', value: '5' },
    ]
    const [value, setValue] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [requestType, setRequestType] = useState('');
    const [details, setDetails] = useState('');
    const [requestTypeSelection, setRequestTypeSelection] = useState(null);

    const navigation = useNavigation();
    state = {
        showPassword: false
    };

    const sendRequest = () => {
        const objNewContactRequest = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Date: new Date().toISOString().slice(0, 10),
            Time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            PhoneNumber: phoneNumber,
            RequestType: requestType,
            Details: details
        };
        console.log("*****", objNewContactRequest);
        if (!firstName || !lastName | !email || !phoneNumber || !details || !requestType) {
            // Some fields are missing
            Alert.alert('Please fill in all fields.');
            return;
        }
        // Email validation
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!emailPattern.test(email)) {
            // Email format is invalid
            alert('Please enter a valid email address.');
            return;
        }
        if (phoneNumber.length != 10) {
            // Phone is too short
            Alert.alert('Phone must be 10 numbers.');

            return;
        }
        fetch(`${cgroup90}/prod/api/newcontactus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objNewContactRequest),


        })
            .then(response => response.json())
            .then(data => {
                // Handle the response data as needed
                console.log("lllllllllllll", data);
                Alert.alert('Publish')
                setDetails('')
                setEmail('')
                setFirstName('')
                setLastName('')
                setRequestType('')
                setPhoneNumber('')

            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', error);
            });
    }
    return (
        < GradientBackground>
         <BackButton text={"Contact Us"}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
               
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={{fontFamily:'Roboto_400Regular_Italic'}}>Be sure to leave an accurate message so we can get back to you as soon as possible  </Text>
                        {/* <Image source={RoadRanger} style={styles.RoadRanger} /> */}
                        <Text style={styles.text}>Email:</Text>
                        <TextInput style={styles.input}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="Email">
                        </TextInput>
                        <Text style={styles.text}>Name:</Text>
                        <TextInput style={styles.input}
                            onChangeText={(text) => setFirstName(text)}
                            value={firstName}
                            placeholder="First Name">
                        </TextInput>
                        <TextInput style={styles.input}
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                            placeholder="Last Name">
                        </TextInput>
                        <Text style={styles.text}>Phone Number:</Text>
                        <TextInput style={styles.input}
                            placeholder="Phone"
                            value={phoneNumber}
                            keyboardType='numeric'
                            onChangeText={(text) => setPhoneNumber(text)}
                        >
                        </TextInput>
                        <Text style={styles.text}>Subject:</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={Subject}
                            // maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"select a subject type"}
                            value={requestTypeSelection}
                            onChange={item => {
                                setRequestType(item.label);
                                setRequestTypeSelection(item)
                            }}

                        />
                        <Text style={styles.text}>Message:</Text>
                        <TextInput style={styles.input1}
                            value={details}
                            onChangeText={(text) => setDetails(text)}
                            placeholder="Write here..."
                            spellCheck="true"
                            multiline={true}
                            numberOfLines={4}
                            editable={true}
                            onSubmitEditing={() => {
                                //close the keyboard
                                TextInput.State.blur(TextInput.State.currentlyFocusedInput())
                            }}
                        >
                        </TextInput>

                        <TouchableOpacity style={styles.btnLogIn} onPress={sendRequest}>
                            <Text style={styles.btnText}>
                                Send
                            </Text>

                        </TouchableOpacity>
                    </View >
                </ScrollView>
            </KeyboardAvoidingView>
        </ GradientBackground>

    )
}
const styles = StyleSheet.create({
    container: {
        // padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        width: "100%",
        paddingTop:50
    },

    RoadRanger: {
        alignSelf: 'center',
        resizeMode: 'contain',
        height: 100

    },
    text: {
        fontFamily:'Roboto_400Regular',
        paddingTop: 10,
        color: '#144800',
        fontSize: 25,
    },
    input: {
        fontFamily:'Roboto_400Regular',
        alignSelf: 'center',
        flexDirection: 'row',
        marginVertical: 10,
        width: "100%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnLogIn: {
        height: 55,
            marginVertical: 8,
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
    btnText: {
        fontFamily:'Roboto_400Regular_Italic',
        color: '#F8F8FF',
        alignSelf: 'center',
        fontSize: 22,
    },
    placeholderStyle: {
        fontFamily:'Roboto_400Regular',
        fontSize: 18,
        color: "#A9A9A9"
    },

    dropdown: {
        fontFamily:'Roboto_400Regular',
        alignSelf: 'center',
        height: 50,
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
        width: "100%",

    },
    input1: {
        fontFamily:'Roboto_400Regular',
        alignSelf: 'center',
        flexDirection: 'row',
        marginVertical: 10,
        width: "100%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 15,
        minHeight: 100,
        textAlign: 'top',
        
    },
});