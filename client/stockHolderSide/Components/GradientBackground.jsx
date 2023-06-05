// import React from 'react';
// import { StyleSheet, View, ImageBackground } from 'react-native';


// const GradientBackground = ({ children }) => {
//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         opacity={0.5}

//         source={require('../assets/map.jpg')}
//         style={styles.background}
//       >
//         {children}
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
// });

// export default GradientBackground;





import React from 'react';
import { StyleSheet, View } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const GradientBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        // colors={['#006400','#ADD8E6', '#3b5998', '#192f6a']}
        colors={['#ffffff','#ffffff','#ccffcc']}
        

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