import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Timeline from 'react-native-timeline-flatlist'
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import { useNavigation, useFocusEffect } from "@react-navigation/native";


export default function TimeLine(props) {
    const event = props.route.params.event;
    const traveler = props.route.params.traveler;
    const [events, setEvents] = useState([])
    console.log("&&&&&&", event)

    useEffect(() => {
        const eventNumberObj = {
            eventNumber: event.eventNumber,
        }
        fetch('http://cgroup90@194.90.158.74/cgroup90/prod/api/post/relatedevents', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventNumberObj),
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data)
                console.log(data);
            }
            )
            .catch(error => {
                console.error(error);
                console.log('Error');
            });
    }, []);

    console.log("********", events)

    return (
        <GradientBackground>
            <BackButton />
            <View>
                {events.length > 0 ? (
                    <Timeline
                        data={events.map((event) => ({
                            time: event.EventDate, // Set the event date as the time value
                            title: event.Details, // Set the event details as the title
                            // Set other properties of the item as needed
                            // You can add more properties here to customize the timeline item
                        }))}
                        circleSize={20}
                        circleColor="rgb(45,156,219)"
                        lineColor="rgb(45,156,219)"
                        timeContainerStyle={{ minWidth: 52 }}
                        timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
                        titleStyle={{ fontWeight: 'bold' }}
                        descriptionStyle={{ color: 'gray' }}
                        options={{
                            style: { paddingTop: 5 },
                        }}
                        renderDetail={({ item }) => (
                            <View>
                                <Text style={styles.text}>{item.title}</Text>
                                {/* Render other properties of the item as needed */}
                            </View>
                        )}
                    />
                ) : (
                    <Text>NO</Text>
                )}
            </View>
        </GradientBackground>
    )

}
const styles = StyleSheet.create({
    text: {
        fontSize: 50
    }
})