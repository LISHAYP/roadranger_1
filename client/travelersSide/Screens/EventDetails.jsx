import { Dimensions, StyleSheet, Text, View, Image, ScrollView, TextInput, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EventDetails(props) {
  const event = props.route.params.event;
  //user-the user who use the app
  const user = props.route.params.traveler;
  console.log(event);
  //traveler-the user how post event
  const [traveler, setTraveler] = useState('');
  const [addressComponents, setAddressComponents] = useState('')
  const [comments, setComments] = useState('')
  const [details, setDetails] = useState('');
  const [stackholderId, setStackholderId] = useState('null');


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
      fetchNumberEvent();
    } catch (error) {
      console.error(error);
      console.log('Error');
    }
  };
  const fetchNumberEvent = async () => {
    console.log("in fetchNumberEvent")
    const eventNumberObj = {
      eventNumber: event.eventNumber
    };

    try {
      console.log("in try fretchfetchNumberEvent", { eventNumberObj })
      const response = await fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/events/comments', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventNumberObj),
      });

      const data = await response.json();
      setComments(data);
      console.log(comments);
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

  const newComment = {
    eventNumber: event.eventNumber,
    Details: details,
    comment_date: new Date().toISOString().slice(0, 10),
    comment_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    TravelerId: user.traveler_id,
    StackholderId: stackholderId,

  };
  console.log("---------", (newComment))

  const createComment = async () => {

    if (newComment === '') {
      alert('Please enter details and type');
    }
    else {
      // Send a POST request to your backend API with the comment data
      fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/newcomment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          console.log(data);
          alert('Publish')
          setDetails('');
        })
        .catch(error => {
          console.error(error);
          alert('Error', error);
        });
    }
  }
  return (
    <GradientBackground>
      <View style={styles.container}>
        <KeyboardAwareScrollView >
          <View style={styles.eventContainer}>
            <View >
              <View style={styles.event}>
                <View style={styles.row}>
                  <Image style={styles.img} source={{ uri: traveler.Picture }} resizeMode="contain" />
                  <Text style={styles.text}>{traveler.first_name} {traveler.last_name}</Text>
                </View>
                <View>
                  <Text style={styles.textdateTime}>{event.EventTime.slice(0, 5)} {new Date(event.EventDate).toLocaleDateString('en-GB')}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.detailsText}>{event.Details}</Text>
              </View>
              <View style={styles.locationContainer}>
                <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
                <Text style={styles.locationText}>{addressComponents}</Text>
              </View>
              <View style={styles.pictureContainer}>
                <Image source={{ uri: event.Picture }} style={styles.picture} resizeMode="contain" />
              </View>
            </View>
            <ScrollView>
              <View>
                {comments !== undefined && comments.length > 0 && (
                  comments.map((comment, index) => (
                    <View key={index} style={styles.commentContainer}>
                      <View style={styles.event}>
                        <View style={styles.row}>
                          <Image style={styles.img} source={{ uri: user.Picture }} resizeMode="contain" />
                          <Text style={styles.text}>{comment.TravelerName} </Text>
                        </View>
                        <View>
                          <Text style={styles.textdateTime}>{comment.CommentTime.slice(0, 5)} {new Date(comment.CommentDate).toLocaleDateString('en-GB')}</Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.detailsTextComment}>{comment.Details}</Text>
                      </View>
                    </View>
                  )))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.addComment}>
            <View style={styles.event}>
              <View style={styles.row}>
                <Image style={styles.img} source={{ uri: user.Picture }} resizeMode="contain" />
                <Text style={styles.text}>{user.first_name} {user.last_name}</Text>
              </View>
              <TouchableOpacity onPress={createComment}>
                <Icon name="arrow-forward-circle-outline" size={25} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TextInput style={styles.input}
                placeholder="Add Comment..."
                value={details}
                multiline={true}
                numberOfLines={4}
                editable={true}
                onChangeText={(text) => setDetails(text)}>
              </TextInput>
            </View>
          </View>
        </KeyboardAwareScrollView>

      </View>
    </GradientBackground >
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,


  },


  pictureContainer: {

    height: height * 0.2, // adjust this value as needed
    width: width + 30,
    bottom: 10
  },
  picture: {
    flex: 1,
    width: width,
    height: height,
    padding: 5,
    borderRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  locationIcon: {
    marginRight: 10,

  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eventContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 15,
    padding: 10,
    height: '35%'
  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,

  },

  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
    top: 5
  },
  detailsText: {
    alignItems: 'center',
    fontSize: 20,
    left: 10,
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',


  },
  addComment: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    // height: '10%'

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
  dateTimeContainer: {
    alignItems: 'flex-end',
    marginLeft: 'auto',

  },
  textdateTime: {
    fontSize: 16,
    marginVertical: 5,
    fontSize: 10,
    right: 10,
    textAlign: 'right'
  },
  detailsTextComment: {
    fontSize: 15,
    paddingTop: 5
  },
  input: {
    left: 50,
    paddingBottom: 10,
    width: '75%',

  },

  icon: {
    top: 20

  },
  inputContainer: {
    flexGrow: 1,
  },
  keyboard: {
    flex: 1,
  },

});