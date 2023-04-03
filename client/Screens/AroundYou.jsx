import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

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

                    console.log("fetch  ", result);
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

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
                {/* <AntDesign name="menu" size={24} color="black" /> */}
                <Icon name="menu" size={30} color={'white'} top={10} />
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
                    {Events.map(event => (
                        <Marker
                            key={event.EventNumber}
                            coordinate={{
                                latitude: event.Latitude,
                                longitude: event.Longitude,
                            }}
                            title={event.Details}
                            description={event.EventTime}
                            pinColor={event.SerialTypeNumber === 1 ? 'yellow' : 'blue'} // add if statement for pin color
                            onPress={() => {
                                navigation.navigate('Event Details', { event });
                            }}
                        />
                       
                    ))}

                </MapView>

            )}
            {isMenuOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <View >
                        <Text style={styles.name}>
                            Hello, {traveler.first_name} {traveler.last_name} !                  </Text>

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
                    <TouchableOpacity style={styles.option}>
                        <Icon name="chatbubble-ellipses-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Icon name="search-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}
                        onPress={() => { navigation.navigate("Setting", traveler, location); }}
                    >
                        <Icon name="settings-outline" size={35} style={styles.icon} />
                        <Text style={styles.text}>Setting</Text>
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
    name: {
        position: "absolute",
        fontSize: 20,
        top: 140,
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
         top:12,
         left:70,
         fontSize:20
    },
    hamburger: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        height: '6%',
        top: 0,
        left: 0,
        zIndex: 1,
        // borderRadius: 30,
        // paddingVertical: 10,
        // paddingHorizontal: 25,
        backgroundColor: '#8FBC8F'

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
        top: 80,
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
        top: 200,
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
