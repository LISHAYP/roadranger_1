import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function AroundYou(props) {
    const email = props.route.params.email;

  return (
    <View style={styles.container}>
      <Text>email: {email}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        width: "100%",

    },
})