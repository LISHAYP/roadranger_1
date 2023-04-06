import { Dimensions, StyleSheet, Text, View, Image } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";
import Geocoder from 'react-native-geocoding';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EventDetails(props) {
  const event = props.route.params.event;
  console.log(event)
  const [traveler, setTraveler] = useState('');
  const [addressComponents, setAddressComponents] = useState('')

  const fetchTravelerDetails = async () => {
    const travelerobj = {
      traveler_Id: event.TravelerId
    };

    try {
      const response = await fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/traveler/details', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(travelerobj),
      });

      const data = await response.json();
      setTraveler(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      console.log('Error');
    }
  };

  useEffect(() => {
    fetchTravelerDetails();
    Geocoder.init('AIzaSyDN2je5f_VeKV-DCzkaYBg1nRs_N6zn5so');
    Geocoder.from(`${event.Latitude},${event.Longitude}`)
      .then((json) => {
        const location = json.results[0].address_components;
        console.log(location)
        const number = json.results[0].address_components[0].long_name;
        const street = json.results[0].address_components[1].long_name;
        const city = json.results[0].address_components[2].long_name;
        setAddressComponents(`${street} ${number}, ${city}`);
      }
      )
      .catch(error => {
        console.error(error);
        console.warn('Geocoder.from failed');
      });
  }, []);


  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.pictureContainer}>
          <Image source={{ uri: 'https://img.mako.co.il/2021/10/07/photo5978846621133289432_autoOrient_i.jpg' }} style={styles.picture} resizeMode="contain" />
        </View>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
          <Text style={styles.locationText}>{addressComponents}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.idContainer}>
            <View style={styles.circle}>
              <Image source={{ uri: 'http://cgroup90@194.90.158.74/cgroup90/prod/profilePictures/id1.jpg' }} style={styles.icon} resizeMode="contain" />
            </View>
            <Text style={styles.text}>{traveler.first_name} {traveler.last_name}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>{event.Details}</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.textdateTime}>{event.EventTime} {new Date(event.EventDate).toLocaleDateString('en-US')}</Text>
          </View>
        </View>
      </View>
    </GradientBackground>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10
  },
  pictureContainer: {
    height: height * 0.2, // adjust this value as needed
    width: width + 30,
  },
  picture: {
    flex: 1,
    width: width,
    height: height,
    padding: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  detailsText:{
    alignItems: 'center',
    fontSize: 20,
  textAlign: 'center',
  marginTop:10
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   // marginRight: 'auto',
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    height: '150%',
    width: '150%',
    borderRadius: 100,

  },
  text: {
    fontSize: 16,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  textdateTime: {
    fontSize: 16,
    marginVertical: 5,
    marginTop: 30,
    fontSize: 10
  },
  detailsContainer: {
    flex: 1,
    borderRadius: 5,
    margin: 5
  },

});

