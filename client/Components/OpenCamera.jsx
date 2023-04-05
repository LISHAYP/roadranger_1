import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function OpenCamera() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const takePicture = async () => {
    
    if (camera) {
      camera.takePictureAsync().then(photo => {
        setImage(photo);
      }).catch(error => {
        console.log(error);
      });
    }
  };

  const openGallery = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }
    setImage(pickerResult);
    console.log({ pickerResult })
  }

  const savePhoto = () => {
    navigation.goBack({ image: image.uri });
    console.log({image})
  }
  const closeCamera = () => {
    navigation.goBack(); // navigate to the previous screen
  }

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.preview}>
          <Image style={styles.previewImage} source={{ uri: image.uri }} />
          <TouchableOpacity style={styles.previewButton} onPress={() => setImage(null)}>
            <Icon name="close-outline" size={35} color='white' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={savePhoto} >
            <Icon name="download-outline" size={35}  />
            <Text style={styles.textSave}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Camera style={styles.camera} type={type} ref={(ref) => { setCamera(ref) }}>
          <TouchableOpacity style={styles.buttonClose} onPress={closeCamera}>
            <Icon name="close-outline" size={35} color='white' />
          </TouchableOpacity>
          <View style={styles.buttonContainer} >
            <TouchableOpacity style={styles.button} onPress={openGallery}>
              <Icon name="images-outline" size={45} color='white' style={styles.iconLeft} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Icon name="radio-button-on-outline" size={100} color='white' style={styles.iconCenter} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Icon name="sync-circle-outline" size={45} color='white' style={styles.iconRight} />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonClose: {
    position: 'absolute',
    top: 32,
    right: 16
  },
  iconRight: {
    left: 40
  },
  iconLeft: {
    right: 40
  },
  iconCenter: {
    bottom: 30
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewButton: {
    position: 'absolute',
    top: 32,
    right: 16
  },
  save:{
    flexDirection: 'row',
    marginBottom:50,
  },
  textSave:{
    fontSize:25,
    marginTop:10

  }
});