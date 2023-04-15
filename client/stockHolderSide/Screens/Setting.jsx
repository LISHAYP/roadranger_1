import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';


export default function Setting({ route }) {
  const stakeholder = route.params.stakeholderParams.stakeholder;
  console.log(stakeholder);

  const navigation = useNavigation();
  const [full_name, setFullName] = useState(stakeholder.FullName);
  const [satkeholder_name, setStakeholderName] = useState(stakeholder.StakeholderName);
  const [stakeholder_email, setEmail] = useState(stakeholder.StakeholderEmail);
  const [password, setPassword] = useState(stakeholder.Password);
  const [phone, setPhone] = useState(stakeholder.Phone);
  const stakeholderType = [
    { label: 'Insurance Company', value: 'Insurance Company' },
    { label: 'Embassy', value: 'Embassy' },
    { label: 'Rescue company', value: 'Rescue company' },
    { label: 'Other', value: 'Other' },
  ]
  const [value, setValue] = useState(null);
 
  const [isEnabledChatMode, setIsEnabledChatMode] = useState(stakeholder.Chat);
  const [isEnabledNotification, setIsEnabledNotification] = useState(stakeholder.Notifications);
  const [selectedStakeholderType, setSelectedStakeholderType] = useState(stakeholder.stakeholderType);
  //const [userPic, setUserPic] = useState(stakeholder.picture);
  const toggleSwitchLocation = () => setIsEnabledLocation(previousState => !previousState);
  const toggleSwitchChatMode = () => setIsEnabledChatMode(previousState => !previousState);
  const toggleNotification = () => setIsEnabledNotification(previousState => !previousState);

 
  const changeStakeholder = {
    FullName: full_name,
    StakeholderName: satkeholder_name,
    StakeholderEmail: stakeholder_email,
    Phone: phone,
    Notifications: isEnabledNotification,
    stakeholderType: selectedStakeholderType,
    password: password,
    chat: isEnabledChatMode,
    //picture: stakeholder.Picture
  };
  
  console.log("*****",changeStakeholder);
  console.log('*******', changeStakeholder)
  const saveChanges = async () => {
    console.log("IM IN saveChanges", changeStakeholder);
    fetch(`http://cgroup90@194.90.158.74/cgroup90/prod/api/put/stakeholder/update?email=${stakeholder.StakeholderEmail}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changeStakeholder),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // stakeholder updated successfully.
        alert('Stakeholder updated successfully')
        navigation.goBack(); // Navigate back to the "Around You" screen
        //console.log({ newEvent })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const id = stakeholder.stakeholder_id;
  // const openCamera = () => {
  //   navigation.navigate('Camera',{id});
  // }
  // const handleSavePhoto = (photo) => {
  //   setUserPic(photo);
  // }
 
  return (
    <ScrollView>
      < GradientBackground>
        <View style={styles.container}>
        <Image source={{ uri:  "http://cgroup90@194.90.158.74/cgroup90/prod/profilePictures/id1.png" }} style={styles.user} />
          {/* <TouchableOpacity onPress={openCamera}>
          {userPic ? (
            <Image source={{ uri: stakeholder.Picture }} style={styles.user} />
          ) : (
            <Image source={{ uri: stakeholder.Picture }} style={styles.user} />
          )} */}
            {/* </TouchableOpacity > */}
          <Text style={styles.text}>Stakeholder Type:</Text>
          <Dropdown
           style={styles.dropdown}
           placeholderStyle={styles.placeholderStyle}
           selectedTextStyle={styles.selectedTextStyle}
           data={stakeholderType}       
           maxHeight={300}
           labelField="label"
           valueField="value"
           placeholder={stakeholder.selectedStakeholderType}
           value={selectedStakeholderType}
           onChange={item => {
             setSelectedStakeholderType(item.label)
            }} />
           <Text style={styles.text}>stakeholder Name:</Text>
          <TextInput style={styles.input}
            //value={StakeholderName}
            onChangeText={(text) => setStakeholderName(text)}
            placeholder={stakeholder.StakeholderName}>
          </TextInput>

          <Text style={styles.text}>Company Full Name:</Text>
          <TextInput style={styles.input}
            // value={FullName}
            onChangeText={(text) => setFullName(text)}
            placeholder={stakeholder.FullName}>
          </TextInput>
         
         
             <Text style={styles.text}>Email:</Text>
          <TextInput style={styles.input}
            // value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder={stakeholder.StakeholderEmail}>
          </TextInput>
          <Text style={styles.text}>Phone:</Text>
          <TextInput style={styles.input}
            placeholder={'0' + stakeholder.Phone.toString()}
            value={phone}
            keyboardType='numeric'
            onChangeText={(text) => setPhone(text)}
          >
          </TextInput>
         
          <Text style={styles.text}>Password:</Text>
          <TextInput style={styles.input}
            placeholder={stakeholder.Password}
            // value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}>
          </TextInput>
         
          <View style={styles.row}>
            <Text style={styles.text2}>Notification</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#8FBC8F" }}
              thumbColor={stakeholder.notifications ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotification}
              value={isEnabledNotification}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.text2}>Chat Mode</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#8FBC8F" }}
              thumbColor={stakeholder.chat ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchChatMode}
              value={isEnabledChatMode}
            />
          </View>
          
          <TouchableOpacity style={styles.btnSave} onPress={saveChanges}>
            <Text style={styles.btnText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    </ScrollView >
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
    fontSize: 20,

  },
  icon: {
    fontSize: 25
  },
  btnSignUp: {
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
  user: {
    alignSelf: 'center',
    resizeMode: 'cover',
    height: 150,
    borderRadius: 75,
    width: 150,
    marginBottom: 25,
  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,

  },

  calendar: {
    flexDirection: 'row',
    marginVertical: 10,
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 25,
    width: '90%',
    height: 50,
    justifyContent: 'space-between'

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
  text1: {
    fontSize: 18,
    alignSelf: 'center',
    color: "#A9A9A9"
  },
  text2: {
    fontSize: 18,
    alignSelf: 'center',

  },
  input: {
    flexDirection: 'row',
    marginVertical: 5,
    width: "90%",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 25,

  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,


  },
  placeholderStyle: {
    fontSize: 18,
    color: "#A9A9A9"
  },
  selectedTextStyle: {
    fontSize: 18,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 },
  btnSave: {
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
});