
import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
function BackButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={30}  />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
paddingTop:30,
paddingBottom:5
    },
  
});

export default BackButton;