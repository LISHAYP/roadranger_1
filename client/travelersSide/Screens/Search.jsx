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


 
  const gender = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },]

  const insurance = [
    { label: 'PassportCard', value: 'PassportCard' },
    { label: 'Harel', value: 'Harel' },
    { label: 'Other', value: 'Other' },
  ]
 
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('DD/MM/YY');
    setSelectedDate(formattedDate);
    setIsCalendarOpen(false);
  }

  
  return (
      < GradientBackground>
        <View style={styles.container}>
    
          <Text style={styles.text}>Country:</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={gender}
            maxHeight={300}
            labelField="label"
            // valueField="value"
            placeholder={"Select"}
            value={selectedGender}
            onChange={item => {
              setSelectedGender(item.value)
            }} />

          <Text style={styles.text}>City:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={insurance}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={"Select"}
            onChange={item => {
              setSelectedInsurance(item.value)
            }}

          />
           <Text style={styles.text}>Type:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={insurance}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={"Select"}
            onChange={item => {
              setSelectedInsurance(item.value)
            }}

          />
          <Text style={styles.text}>Date:</Text>
          <View>
            <TouchableOpacity onPress={() => setIsCalendarOpen(!isCalendarOpen)} style={styles.calendar}>
              <Text style={styles.text1}>{selectedDate ? selectedDate.toString() : "Select you'r Date of Birth"}</Text>
              <Icon style={styles.icon} name="calendar-outline" />
            </TouchableOpacity>
            {isCalendarOpen && (
              <View>
                <CalendarPicker onDateChange={handleDateSelect} />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.btnSave}>
            <Text style={styles.btnText}>
             Search
            </Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
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
  text: {
    color: '#144800',
    fontSize: 20,

  },
  icon: {
    fontSize: 25
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