import React from 'react';
import { StyleSheet, View } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const GradientBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        // colors={['#006400','#ADD8E6', '#3b5998', '#192f6a']}
        colors={['#F0FFF0','#ffffff']}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%'
  },
  gradient: {
    flex: 1,
    height:'100%'
  },
});

export default GradientBackground;