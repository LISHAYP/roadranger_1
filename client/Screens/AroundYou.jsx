import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation  } from "@react-navigation/native";

export default function AroundYou(props) {
    const [location, setLocation] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigation = useNavigation();

    const email = props.route.params.email
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

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
                <Icon name="menu" size={30}  />

            </TouchableOpacity>
            {location && location.coords && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="My Location"
                        description="This is my current location"
                    />
                </MapView>
            )}
            {isMenuOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <View>
                        <Text>
                            {email}
                        </Text>
                    </View>
                   
                    <TouchableOpacity style={styles.option} 
                    // onPress={() => {navigation.navigate("Setting");   }}
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
                                onPress={() => {navigation.navigate("Setting");   }}
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
    map: {
        width: '100%',
        height: '100%',
    },
    hamburger: {
        position: 'absolute',
        bottom: 90,
        left: 40,
        zIndex: 1,
        borderRadius: 30, 
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#778899'

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
    option:{
        flexDirection: 'row',
        // justifyContent: 'space-between',
        backgroundColor: '#8FBC8F',
        width:'100%',
        borderRadius: 12, 
        paddingVertical: 12,
        paddingHorizontal: 10,
        right:20,       
        top:200,
        marginBottom:21
    },
    text:{
        fontSize:30,
        left:40
    },
    icon:{
        left:30,
        size:30,
        top:5
    }
});
