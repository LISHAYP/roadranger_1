import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getCenter } from 'geolib';

export default function AroundYou(props) {
    const [location, setLocation] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null); // Add a new state variable for user location
    const navigation = useNavigation();

    const stakeholder = props.route.params.data;
    console.log("%%%%", stakeholder);

    useFocusEffect(
        React.useCallback(() => {
            handleGet();
            return () => {
            };
        }, [])
    );

    const [Events, setEvents] = useState([])
    const getUserLocation = async () => {
        const userlocation = await Location.getCurrentPositionAsync();
        setUserLocation(userlocation); // Save user location in state
        console.log("************", userLocation.coords.latitude)
    };
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            handleGet();
            getUserLocation();

        })();
    }, []);


    const handleGet = () => {

        fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/NewEvent', {

            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
            .then(response => {
                return response.json()
            })
            .then(
                (result) => {

                    setEvents(result)
                },
                (error) => {
                    console.log("err post=", error);
                }, []);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const typePinColors = {
        1: 'yellow',   // Weather
        2: 'blue',     // Road closures
        3: 'green',    // Natural disasters
        4: 'red',      // Health emergencies
        5: 'purple',   // Accommodation issues
        6: 'orange',   // Protests
        7: 'pink',     // Strikes
        8: 'brown',    // Security threats
        9: 'black',    // Animal-related incidents
        10: 'gray',    // Financial issues
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
                {/* <AntDesign name="menu" size={24} color="black" /> */}
                <Icon name="menu" size={40} color={'white'} alignSelf={'center'} />
                <Text style={styles.titlename}>  Hello, {stakeholder.FullName} ! </Text>

            </TouchableOpacity>



            {location && location.coords && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="My Location"
                        description="This is my current location"
                    />
                    {Events.filter(event => event.event_status !== false && event.SerialTypeNumber
                        !== 1004 && event.SerialTypeNumber !== 1003).map(event => (<Marker
                            key={event.EventNumber}
                            coordinate={{
                                latitude: event.Latitude,
                                longitude: event.Longitude,
                            }}
                            title={event.Details}
                            description={event.EventTime}
                            pinColor={typePinColors[event.SerialTypeNumber]}
                            onPress={() => {
                                navigation.navigate('Event Details', { event, stakeholder });
                            }}
                        />

                        ))}

                </MapView>

            )}
            {isMenuOpen && (
                <View style={styles.menu}>
                    <View >
                        <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>

                        <Image source={{ uri: stakeholder.picture }} style={styles.user} />

                    </View>


                    <TouchableOpacity style={styles.option} >

                        <Icon name="chatbubble-ellipses-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}
                        onPress={() => {
                            navigation.navigate("New event", {
                                stakeholder: stakeholder,
                                userLocation: userLocation
                            });
                        }}
                    >
                        <Icon name="add-circle-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>New Post</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}
                        onPress={() => { navigation.navigate("Your Travelers", { stakeholder }) }}>

                        <Icon name="people-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Your Travelers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate("Search", { stakeholder }) }}>
                        <Icon name="search-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Search </Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}
                        onPress={() => { navigation.navigate("Setting", { stakeholder }) }}
                    >
                        <Icon name="settings-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}
                        onPress={() => { navigation.navigate("Warning",{ stakeholder }) }}
                    >
                        <Icon name="warning-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Warnings </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    user: {
        alignSelf: 'center',
        resizeMode: 'cover',
        height: 150,
        borderRadius: 75,
        width: 150,
        top: 50

    },
    name: {
        position: "absolute",
        fontSize: 20,
        top: 250,
        left: 80,

    },
    map: {
        width: '100%',
        height: '100%',
    },
    titlename: {
        color: 'white',
        width: '100%',
        left: 70,
        fontSize: 22,
        alignSelf: "center"
    },
    hamburger: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        height: '12%',
        top: 0,
        left: 0,
        zIndex: 1,
        // borderRadius: 30,
        // paddingVertical: 10,
        // paddingHorizontal: 25,
        backgroundColor: '#8FBC8F',
        paddingTop:55

    },
    menu: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80%',
        height: '100%',
        backgroundColor: '#F0F8FF',



        // alignItems: 'center',
        // justifyContent: 'center',
        zIndex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 55,
        right: 20,
    },
    optionSOS: {
        flexDirection: 'row',
        backgroundColor: '#8FBC8F',
        width: '100%',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        right: 20,
        top: 200,
        marginBottom: 21,
        backgroundColor: '#FF0000'
    },
    option: {
        flexDirection: 'row',
        backgroundColor: '#8FBC8F',
        width: '100%',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        right: 20,
        top: 160,
        marginBottom: 21
    },
    text: {
        fontSize: 30,
        left: 40


    },
    icon: {
        left: 30,
        size: 30,

    }
});