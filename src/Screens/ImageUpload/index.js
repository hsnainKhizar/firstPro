import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';


const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

 
  const pickImagesFromPhotos = async () => {
    try {
      return await ImagePicker.openPicker({
        cropping: true,
        width: 900,
        height: 600,
      });
    } catch (error) {
      console.log(error);
      // error.message === PERMISSIONS_STATUS.libraryPermissionDenied &&
      //   allowPermissionFromSettings(DEVICE_MODULES.photoLibrary);
    }
  }; 

  const setImage = async () =>{
    try {
      const image = await pickImagesFromPhotos();
      console.log(image.path);
      setSelectedImage({ uri: image.path });
    } catch (error) {
      console.log(error);
    }
  }

   

  return (
    <View style={styles.container}>
      <Button title="Select Image from Gallery" onPress={setImage} />
      {selectedImage && (
        <Image source={selectedImage} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    borderRadius:8,
    
  },
});

export default ImageUpload;
