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
import Geocoder from 'react-native-geocoding';


export default function YourTravelers(props) {
  const navigation = useNavigation();
  Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');

  const stakeholder = props.route.params.stakeholder;
  const [myTravelers, setMyTravelers] = useState([])
  console.log(stakeholder)
  console.log("mmmmmmmmm", myTravelers)
  useEffect(() => {
    stackholderType()
  }, []);

  const stackholderType = () => {
    if (stakeholder.StakeholderType == 'Insurance Company') {
      const objInsuranceCompany = {
        insurence_company: stakeholder.StakeholderName
      }
      fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/GetTravelersByInsuranceCompany', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objInsuranceCompany),
      })
        .then(response => response.json())
        .then(data => {
          console.log('********', { data })
          setMyTravelers(data)
        }
        )
        .catch(error => {
          console.error(error);
          console.log('Error');
        });
    }

  }


  return (
    < GradientBackground>
      <BackButton />
      <View style={styles.container}>
        <Text>My ravelers</Text>
        <ScrollView>
          {myTravelers.length > 0 && (
            myTravelers.map((traveler, index) => (
              <View key={index} style={styles.commentContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate("Follow", { traveler }) }}>
                  <View style={styles.event}>
                    <View style={styles.row}>
                      <Image style={styles.img} source={{ uri: traveler.Picture }} />
                      <Text style={styles.text}> {traveler.first_name} {traveler.last_name} </Text>
                      {traveler.last_location.Latitude && traveler.last_location.Longitude && (
                        <Geocoder
                          position={{ lat: traveler.last_location.Latitude, lng: traveler.last_location.Longitude }}
                          onError={console.warn}
                        >
                          {({ results }) => (
                            <Text style={styles.address}>{results[0].formatted_address}</Text>
                          )}
                        </Geocoder>
                      )}
                    </View>
                  </View>


                  {/* <Text>{traveler.last_location.Latitude}</Text>
                  <Text>{traveler.last_location.Longitude}</Text>
                  <Text>{traveler.last_location.DateAndTime}</Text> */}
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

      </View>
    </GradientBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",

  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    resizeMode: "contain"
  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    top: 0
  },
});