import React, { useEffect, useState, useRef } from 'react';
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
import MapView, { Marker } from 'react-native-maps';


export default function FollowTraveler(props) {
  const navigation = useNavigation();
  const traveler = props.route.params.traveler;
  const [travelerLocation, setTravelerLocation] = useState([])
  const [lastLocation, setLastLocation] = useState()
  Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');
  const mapViewRef = useRef(null);

  useEffect(() => {
    getLocationTraveler()
  }, []);

  const getLocationTraveler = () => {
    const objTravelerId = {
      TravelerId: traveler.traveler_id
    }
    fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/locations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objTravelerId),
    })
      .then(response => response.json())
      .then(data => {
        // Map over the data and get the address for each traveler
        Promise.all(data.reverse().map(traveler => {
          const lat = traveler.Latitude;
          const lng = traveler.Longitude;
          return Geocoder.from(lat, lng).then(json => {
            const location = json.results[0].address_components;
            const number = location[0].long_name;
            const street = location[1].long_name;
            const city = location[2].long_name;
            const address = `${street} ${number}, ${city}`;
            return { ...traveler, address };
          });
        })).then(travelersWithAddress => {
          const latestLocation = travelersWithAddress[0];
          setLastLocation(latestLocation);
          setTravelerLocation(travelersWithAddress);
        });

      });
  }
 

  function formatDateTime(isoDateTime) {
    const date = new Date(isoDateTime);
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = isoDateTime.slice(11, 16);
    return `${formattedTime} ${formattedDate}`;
  }


  return (
    <GradientBackground>
      <BackButton />
      <View style={styles.container}>
        <View >
          <View style={styles.row}>
            <Image style={styles.img} source={{ uri: traveler.Picture }} />
            <Text style={styles.text}> {traveler.first_name} {traveler.last_name} </Text>
          </View>
        </View>

        {lastLocation && (
          <View>
            <Text style={styles.text}>Last seen at {formatDateTime(lastLocation.DateAndTime)} </Text>
            <Text style={styles.text}>{lastLocation.address}</Text>
          </View>
        )}
        <MapView style={styles.map} region={lastLocation && {
          latitude: lastLocation.Latitude,
          longitude: lastLocation.Longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          {lastLocation && (
            <Marker
              coordinate={{
                latitude: lastLocation.Latitude,
                longitude: lastLocation.Longitude,
              }}
              title={lastLocation.address}
              onPress={() => {
                setLastLocation(lastLocation);
                mapViewRef.current.animateToRegion({
                  latitude: lastLocation.Latitude,
                  longitude: lastLocation.Longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }}
            />
          )}
        </MapView>
    
        <ScrollView>
        {travelerLocation.length > 0 && (
          travelerLocation.map((traveler, index) => (
            <View key={index} style={styles.commentContainer}>
             <TouchableOpacity onPress={() => setLastLocation(traveler)}>
                <Text>{formatDateTime(traveler.DateAndTime)}</Text>
                <Text>{traveler.address}</Text>
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
    marginTop: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",

  },
  map: {
    marginTop: 10,
    width: '100%',
    height: '40%',
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