import { Dimensions, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height ;

const EventDetails = (props) => {
  const event = props.route.params.event;
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.pictureContainer}>
          <Image source={{ uri: 'https://ynet-pic1.yit.co.il/picserver5/wcm_upload/2022/09/17/ByEIVD711j/photo_2022_09_17_18_14_09.jpg' }} style={styles.picture} resizeMode="contain" />
        </View>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={30} color={'red'} style={styles.locationIcon} />
          <Text style={styles.locationText}>{event.Details}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.idContainer}>
            <View style={styles.circle}>
              <Image source={{ uri: 'https://image.flaticon.com/icons/png/512/16/16363.png' }} style={styles.icon} resizeMode="contain" />
            </View>
            <Text style={styles.text}>Traveler ID: {event.TravelerId}</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.textdateTime}>{new Date(event.EventDate).toLocaleDateString('en-US')}</Text>
            <Text style={styles.textdateTime}>{event.EventTime}</Text>
          </View>
        </View>
      </View>
    </GradientBackground>
  )
};

export default EventDetails

const styles = StyleSheet.create({
  container: {
    flex: 1, // take up all available space
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
  },
  text: {
    color: 'black',
    fontSize: 15,
    marginBottom: 25,
  },
  pictureContainer: {
    alignItems: 'center', // center the picture horizontally
    width: width,
    height: height*0.2, // set a fixed height for the container
  },
  picture: {
    width: width,
    height: height, // set the height of the image to fill the container
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    width: '50%',
    height: '50%',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTimeText: {
    color: '#144800',
    fontSize: 10,
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIcon: {
    marginRight: 10,
    marginBottom:20
  },
  locationText: {
    color: 'black',
    fontSize: 20,
    marginTop: 30,
  },
  textdateTime:{
    color: 'black',
    fontSize: 10,
    marginTop: 30,
  }
});
