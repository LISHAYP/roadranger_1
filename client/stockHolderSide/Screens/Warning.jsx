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

export default function Warning(props) {
    const navigation = useNavigation();

    const [events, setEvents] = useState([]);
    const stakeholder = props.route.params.stakeholder;
    Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');

    useEffect(() => {
        getEvents()
    }, []);

    const getEvents = () => {
        fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/NewEvent', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          
          })
          .then(response => response.json())
          .then ( data => {
            // Map over the data and get the address for each traveler
            Promise.all(data.map(event => {
              const lat = event.Latitude;
              const lng = event.Longitude;
              return Geocoder.from(lat, lng).then(json => {
                const location = json.results[0].address_components;
                const number = location[0].long_name;
                const street = location[1].long_name;
                const city = location[2].long_name;
                const address = `${street} ${number}, ${city}`;
                return { ...event, address };
              });
            })).then(eventsWithAddress => {
              setEvents(eventsWithAddress);
              console.log(eventsWithAddress);
            });
          });
      }
     console.log("Eeeeeeeee",events)

return (
    <GradientBackground>
        <BackButton />
        <ScrollView>
            <View style={styles.container}>
                <View>
                    {events !== undefined && events.length > 0 ? (
                        events.filter(event => event.SerialTypeNumber == 1004 || event.SerialTypeNumber == 1003).map((event, index) => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Event Details', { event: event, stakeholder: stakeholder });
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