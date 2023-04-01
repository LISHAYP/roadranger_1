import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GradientBackground from '../Components/GradientBackground';


const EventDetails = (props) => {
    const event = props.route.params.event;
console.log(event)
  return (
    <GradientBackground>
    <View style={styles.container}>
      <Text style={styles.text}>Event Details</Text>
      <Text style={styles.text}>Area Number: {event.AreaNumber}</Text>
      <Text style={styles.text}>Country Number: {event.CountryNumber}</Text>
      <Text style={styles.text}>Details: {event.Details}</Text>
      <Text style={styles.text}>Event Date: {event.EventDate}</Text>
      <Text style={styles.text}>Event Status: {event.EventStatus ? 'Active' : 'Inactive'}</Text>
      <Text style={styles.text}>Event Time: {event.EventTime}</Text>
      <Text style={styles.text}>Picture: {event.Picture}</Text>
      <Text style={styles.text}>Serial Type Number: {event.SerialTypeNumber}</Text>
      <Text style={styles.text}>Traveler ID: {event.TravelerId}</Text>
    </View>
  </GradientBackground>
  )
}

export default EventDetails

const styles = StyleSheet.create({


    container: {
        marginTop: 40,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        width: "100%",
    
      },
      text: {
        color: '#144800',
        fontSize: 20,
    
      },
})