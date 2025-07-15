import * as ImagePicker from "expo-image-picker";
import { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";


const TakePicture = () => {
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted" ){
            Alert.alert("Permission denied", "Camera access is required.");
            return;
        }

        //lauch Camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1
        });

        if(!result.canceled){
            const uri = result.assets[0].uri;
            setPhotoUri(uri);
        }
    };

  return (
    <View style={styles.container}>
        {photoUri ? (
            <>
                <Image source={{ uri: photoUri }} style={styles.image}/>
                {photoUri && <Text style={{ marginTop: 10 }}>{photoUri}</Text>}
                <Button title="Retake Photo" onPress={() => setPhotoUri(null)} />
            </>
        ) : (
            <>
                <Text>Take a Photo</Text>
                <Button title="Open Camera" onPress={takePhoto} />
            </>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 300,
        height: 400,
        resizeMode: "cover",
        borderRadius: 16
    }

})

export default TakePicture