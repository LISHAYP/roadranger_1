import { useState, Dimensions, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EventDetails(props) {
  const event = props.route.params.event;
  const travelerobj = {
    traveler_Id: event.TravelerId
  };
const [Traveler, setTraveler] = useState('');

  fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/traveler/details', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(travelerobj),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setTraveler(data);
    }
    )
    .catch(error => {
      console.error(error);
      console.log('Error');
    });



  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.pictureContainer}>
          <Image source={{ uri: 'https://img.mako.co.il/2021/10/07/photo5978846621133289432_autoOrient_i.jpg' }} style={styles.picture} resizeMode="contain" />
        </View>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
          <Text style={styles.locationText}>{event.Details}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.idContainer}>
            <View style={styles.circle}>
              <Image source={{ uri: 'https://image.flaticon.com/icons/png/512/16/16363.png' }} style={styles.icon} resizeMode="contain" />
            </View>
            {Traveler ? <Text style={styles.text}>{Traveler.first_name}</Text> : null}
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
    padding: 10
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
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
    height: '70%',
    width: '70%',
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
});

