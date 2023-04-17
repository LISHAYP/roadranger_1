import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';

export default function Search(props) {
  const navigation = useNavigation();
 //user-the user who use the app
 const traveler =  props.route.params.traveler;
console.log("trrrrrrrr",traveler)
  useEffect(() => {
    loadData();
  }, []);


  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);

  const serialType = [
    //creating type of different eventtypes
    { label: 'Weather', value: '1' },
    { label: 'Car Accidents', value: '2' },
    { label: 'Road closures', value: '3' },
    { label: 'Natural disasters', value: '4' },
    { label: 'Health emergencies', value: '5' },
    { label: 'Accommodation issues', value: '6' },
    { label: 'Protests', value: '7' },
    { label: 'Strikes', value: '8' },
    { label: 'Security threats', value: '9' },
    { label: 'Animal-related incidents', value: '10' },
    { label: 'Financial issues', value: '11' }
  ]

  const [events,setEvents]=useState('')
  const [selectedSerialType, setSelectedSerialType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('DD/MM/YY');
    setSelectedDate(formattedDate);
    setIsCalendarOpen(false);
  }
  
  const searchObj = [
    {Name:'countrynumber', Value: selectedCountry},
    {Name: 'AreaNumber', Value: selectedCity},
    {Name:'eventdate', Value: selectedDate},
    {Name:'SerialTypeNumber', Value: selectedSerialType},
  ]
  console.log(searchObj)

  const searchEvents = async () => {
    console.log(selectedCity, selectedCountry, selectedDate, selectedSerialType)
    if (selectedCountry === '' && selectedDate === '' && selectedSerialType == '') {
      alert('Please enter for search');
    }
    else {

      // Send a POST request to backend API with the search data
      fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/searchByParameters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchObj),

      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          setEvents(data)
        console.log(data);
          navigation.navigate("Events",{data: data, traveler: traveler} );
        })
        .catch(error => {
          console.error(error);
          alert('No events in this coutry ', error);
        });
    }
  
  }
  



  //GET the countries and cities from data
 const loadData = () => {
    //GET the countries into array
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/getcountries', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const countryData = data.map(country => ({ label: country.country_name, value: country.country_number }))
        setCountry(countryData)
      }
      )
      .catch(error => {
        console.error(error);
        console.log('Error');
      });


    //GET the cities into array
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/getareaswithcountry', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const cityData = data.map(city => ({ label: city.area_name, value: city.area_number, countryNumber: city.country_number }))
        setCity(cityData)
      }
      )
      .catch(error => {
        console.error(error);
        console.log('Error');
      });
  }

  //filter the cities based on the selected country
  const filteredCities = city.filter(city => city.countryNumber === selectedCountry);
  return (
    < GradientBackground>
      <View style={styles.container}>
      <BackButton />

        <Text style={styles.text}>Country:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={country}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Select country"}
          value={selectedCountry}
          onChange={item => {
            setSelectedCountry(item.value)
          }} />

        <Text style={styles.text}>City:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={filteredCities}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Select country before"}
          value={selectedCity}
          onChange={item => {
            setSelectedCity(item.value)
          }}

        />
        <Text style={styles.text}>Type:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={serialType}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Select type of event"}
          value={selectedSerialType}
          onChange={item => {
            setSelectedSerialType(item.value)
          }} />
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

        <TouchableOpacity style={styles.btnSave} onPress={searchEvents}>
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
    marginTop:20,
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