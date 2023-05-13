import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';



export default function AroundYou(props) {
    const [location, setLocation] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null); // Add a new state variable for user location
    const navigation = useNavigation();

    const traveler = props.route.params.data;

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

        fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/newevent', {

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
        // 9: 'black',    // Animal-related incidents
        10: 'gray',    // Financial issues
        1003: 'black'  //Missing traveler
    };
    AroundYou.navigationOptions = {
        headerShown: false,
    };
    return (
        <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
                    {/* <AntDesign name="menu" size={24} color="black" /> */}
                    <Icon name="menu" size={40} color={'white'} alignSelf={'center'} />
                    <Text style={styles.titlename}>  Hello, {traveler.first_name} {traveler.last_name} !                  </Text>

                </TouchableOpacity>

                {/* <TouchableOpacity onPress={toggleMenu} style={styles.sos}>
                <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity> */}

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
                        {Events.filter(event => event.event_status !== false).map(event => (
                            <Marker
                                key={event.EventNumber}
                                coordinate={{
                                    latitude: event.Latitude,
                                    longitude: event.Longitude,
                                }}
                                title={event.Details}
                                description={event.EventTime}
                                pinColor={typePinColors[event.SerialTypeNumber]}
                                onPress={() => {
                                    navigation.navigate('Event Details', { event, traveler });
                                }}
                            />

                        ))}

                        <Circle
                            center={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            radius={500}
                            strokeColor="#F00"
                            fillColor="#F007"
                        />

                    </MapView>
                )}
                {isMenuOpen && (
                    <View style={styles.menu}>
                        <ScrollView>
                            <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>

                            <View style={styles.picAndText} >
                                <Image source={{ uri: traveler.Picture }} style={styles.user} />
                                <Text style={styles.name}>
                                    Hello, {traveler.first_name} {traveler.last_name} !
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.optionSOS}
                                onPress={() => {
                                    navigation.navigate("SOS", {
                                        traveler: traveler,
                                        userLocation: userLocation
                                    });
                                }}
                            >
                                <Icon name="help-buoy" size={35} style={styles.icon} />
                                <Text style={styles.text}>SOS</Text>

                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option}
                                onPress={() => {
                                    navigation.navigate("New event", {
                                        traveler: traveler,
                                        userLocation: userLocation
                                    });
                                }}
                            >
                                <Icon name="add-circle-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>New Post</Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate("Home chat", traveler) }}>
                                <Icon name="chatbubble-ellipses-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate("Search", { traveler }) }}>
                                <Icon name="search-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>Search </Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={() => {
                                navigation.navigate("My Post", {
                                    traveler: traveler,
                                    events: Events
                                })
                            }}>
                                <Icon name="documents-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>My Posts </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option}
                                onPress={() => { navigation.navigate("Warning", { traveler: traveler }) }}
                            >
                                <Icon name="warning-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>Warnings </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option}
                                onPress={() => { navigation.navigate("Setting", { traveler }) }}
                            >
                                <Icon name="settings-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>Setting</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnLogOut} onPress={() => {
                                navigation.navigate("Sign In");
                            }}>
                                <Text style={styles.textLO} > Log out  </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 40

    },
    btnLogOut: {
        top: 100,
        flexDirection: 'row',
        position: 'absolute',
        // bottom: 30,
        // alignSelf: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',

    },

    name: {
        position: "absolute",
        fontSize: 20,
        top: 240,
        left: 60,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    sosText: {
        color: 'white',
        fontSize: 20, fontWeight: 'bold',
        alignSelf: 'center',
        top: 15
    },
    sos: {
        position: 'absolute',
        // bottom: 90,
        top: 0,
        right: 30,
        zIndex: 1,
        width: '15%',
        height: '6%',
        right: 0,
        // borderRadius: 30,
        // paddingVertical: 15,
        // paddingHorizontal: 20,
        backgroundColor: '#FF0000'

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
        paddingTop: 55


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
        top: 40,
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
        top: 150,
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
        top: 150,
        marginBottom: 21
    },
    text: {
        fontSize: 30,
        left: 40
    },
    textLO: {
        color: '#144800',
        fontSize: 20,
        textDecorationLine: 'underline',

    },
    icon: {
        left: 30,
        size: 30,

    },
    user: {
        alignSelf: 'center',
        resizeMode: 'cover',
        height: 150,
        borderRadius: 75,
        width: 150,
        top: 50

    },
    picAndText: {
        top: 20,
    }
});