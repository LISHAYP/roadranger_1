import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import BackButton from '../Components/BackButton';
export default function Events(props) {
  // const [events, setEvents] = useState([]);
  const events = props.route.params.data;
  console.log("eeeee1", events);

  const [eventAddresses, setEventAddresses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');
    Promise.all(
      events.map((event) =>
        Geocoder.from(event.Latitude, event.Longitude)
          .then((json) => json.results[0].formatted_address)
          .catch(() => 'Address not found')
      )
    ).then((addresses) => setEventAddresses(addresses));
  }, [events]);

  return (
    <GradientBackground>
      <ScrollView>
        <View style={styles.container}>
          <BackButton />
          <View>
            {events !== undefined && events.length > 0 ? (
              events.map((event, index) => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Event Details', { event });
                }} >
                  <View style={styles.event} key={event.eventNumber}>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.details}>{event.Details}</Text>
                      <Text >{new Date(event.EventDate).toLocaleDateString('en-GB')}</Text>
                      <Text >{event.EventTime.slice(0, 5)}</Text>
                    </View>
                    <Image source={{ uri: event.Picture }} style={styles.img} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No events found.</Text>
            )}
          </View>
        </View>

      </ScrollView>
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginVertical: 10,
    marginHorizontal: 10,
    width: "100%",
    height: "100%"
  },
  event: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%'
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,

  },
  details: {
    width: '90%',
    marginBottom: 5,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginLeft: 10,
    resizeMode: 'cover'
  }




});