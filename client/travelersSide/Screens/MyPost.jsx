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

export default function MyPost(props) {
    // const [events, setEvents] = useState([]);
    const events = props.route.params.events;
    const traveler = props.route.params.traveler;
    console.log("iiiiiii", traveler)
    console.log("iiiiiii", events)
    const navigation = useNavigation();
    const [eventWithAddresses, setEventWithAddresses] = useState([]);
    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');

    console.log("%%%%%%%%%%%%", events)
    useEffect(() => {
        Promise.all(events.map(event => {
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
            setEventWithAddresses(eventsWithAddress);

        });
     console.log("-----------------", eventWithAddresses)

    }, [events]);
    console.log("-----------------", eventWithAddresses)
    return (
        <GradientBackground>
            <ScrollView>
                <View style={styles.container}>
                    <BackButton />
                    <View>
                        {eventWithAddresses !== undefined ? (
                            eventWithAddresses.filter(event => event.TravelerId === traveler.traveler_id).map((event, index) => (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('Event Details', { event: event, traveler: traveler });
                                }} >
                                    <View style={styles.event} key={event.eventNumber}>
                                        <View style={styles.detailsContainer}>
                                            <Text style={styles.details}>{event.Details}</Text>
                                            <Text>{new Date(event.EventDate).toLocaleDateString('en-GB')}</Text>
                                            <Text>{event.EventTime.slice(0, 5)}</Text>
                                            <Text>{event.address}</Text>

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
        width: '90%',
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        shadowColor: "#000",
            shadowOffset: {
             width: 0,
            height: 5},
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9
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