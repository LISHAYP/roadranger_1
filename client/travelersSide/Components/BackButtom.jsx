import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
function BackButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={25}  />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {

    },
  
});

export default BackButton;
