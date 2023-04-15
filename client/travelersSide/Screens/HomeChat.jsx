import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import { useFocusEffect, useNavigation } from "@react-navigation/native";


const HomeChat = (props) => {
  const navigation = useNavigation();
  const traveler =  props.route.params;

  return (

    <View style={styles.container}>
            < GradientBackground>
      <Text>HomeChat</Text>
      <TouchableOpacity style={styles.btnSave}  onPress={() => {navigation.navigate("Chat",traveler)}}>
            <Text style={styles.btnText}>
              Save Changes
            </Text>
          </TouchableOpacity>
      </GradientBackground>
    </View>

  )
}

export default HomeChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop:50
    }
})