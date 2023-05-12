import { View, Text, StyleSheet,ScrollView,Alert, TouchableOpacity, TextInput } from 'react-native';
import React from 'react'

import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import GradientBackground from '../Components/GradientBackground';
import { Dropdown } from 'react-native-element-dropdown';
import BackButton from '../Components/BackButton';


export default function ContactUs() {
    const Subject = [
        { label: 'General', value: '1' },
        { label: 'Help', value: '2' },
        { label: 'Question', value: '3' }, 
        { label: 'Create a stakeholder', value: '4' },
        { label: 'Faults', value: '5' },
    ]
    const [value, setValue] = useState(null);
    const [firstName,setFirstName]=useState('');
    const [lastName,setLastName]=useState('');
    const [email,setEmail]=useState('');
    const [phoneNumber,setPhoneNumber]=useState('');
    const [requestType,setRequestType]=useState('');
    const [details,setDetails]=useState('');
    const navigation = useNavigation();
    state = {
        showPassword: false
    };
   
      sendRequest = () => {
        const objNewContactRequest = {
            FirstName: firstName,
            LastName: lastName,
            Email:email,
            Date: new Date().toISOString().slice(0, 10),
            Time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            PhoneNumber: phoneNumber,
            RequestType: requestType,
            Details:details
          };
      console.log("*****", objNewContactRequest);
      fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/newcontactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objNewContactRequest),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          console.log(data);
          Alert.alert('Publish')
          setDetails('');
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', error);
        });
    }
    return (
        < GradientBackground>
            <BackButton />
            <View style={styles.container}>
            <ScrollView>
                <Text>Be sure to leave an accurate message so we can get back to you as soon as possible  </Text>
                {/* <Image source={RoadRanger} style={styles.RoadRanger} /> */}
                <Text style={styles.text}>Email:</Text>
                <TextInput style={styles.input}
             onChangeText={(text) => setEmail(text)}
             placeholder="Email">
             </TextInput>
                <Text style={styles.text}>Name:</Text>
                <TextInput style={styles.input}
            onChangeText={(text) => setFirstName(text)}
            placeholder="First Name">
          </TextInput>
          <TextInput style={styles.input}
            onChangeText={(text) => setLastName(text)}
            placeholder="Last Name">
          </TextInput>
                <Text style={styles.text}>Phone Number:</Text>
                <TextInput style={styles.input}
            placeholder={'05--------' + phoneNumber.toString()}
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
                    value={value}

                    onChange={item => {
                        setRequestType(item.label);
                    }}

                />
                <Text style={styles.text}>Message:</Text>
                <TextInput style={styles.input1}
                    placeholder="Write here..."
                    multiline
                    spellCheck="true"
                    onSubmitEditing={() => {
                        //close the keyboard
                        TextInput.State.blur(TextInput.State.currentlyFocusedInput())
                    }}>
                </TextInput>
                <TouchableOpacity style={styles.btnLogIn} onPress={sendRequest}>
                    <Text style={styles.btnText}>
                        Send
                    </Text>
                    
                </TouchableOpacity>
                </ScrollView>
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
        top:55,
        width: "100%",
        marginTop: 30
    },

    RoadRanger: {
        alignSelf: 'center',
        resizeMode: 'contain',
        height: 100

    },
    text: {
        paddingTop: 10,
        color: '#144800',
        fontSize: 25,
    },
    input: {
        flexDirection: 'row',
        marginVertical: 10,
        width: "90%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
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
    placeholderStyle: {
        fontSize: 18,
        color: "#A9A9A9"
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
    input1: {
        flexDirection: 'row',
        marginVertical: 10,
        width: "90%",
        fontSize: 20,
        paddingVertical: 70,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 25,


    },
});