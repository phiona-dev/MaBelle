import { useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";


const PhotoUploadScreen = () => {
    const [image, setImage] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [permission, requestPermission] = useCameraPermissions()

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission || !permission.granted){
            requestPermission();
        }
        if (galleryStatus.status !== "granted"){
            Alert.alert("Permission Required", "Camera and gallery access are needed to use this feature.")
        }
        })();
    }, [permission]);

    const takePhoto = async () => {
        setExtractedText(null);
        setLoading(true);

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if(!result.canceled){
            const uri = result.assets[0].uri;
            setImage(uri);
            await runOCR(uri);
        }

        setLoading(false);
    }

    const pickFromGallery = async () => {
        setExtractedText(null);
        setLoading(true);

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 1,
        });

        if (!result.canceled){
            const uri = result.assets[0].uri;
            setImage(uri);
            await runOCR(uri);
        }
        setLoading(false);
    }

    const runOCR = async (uri: string) => {
        try {
            setLoading(true);

            //convert image to base64
            const base64Image = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const formData = new FormData();
            formData.append("base64Image", `data:image/jpeg;base64,${base64Image}`);
            formData.append("language", "eng");
            formData.append("isOverlayRequired", "false");

            const response = await fetch("https://api.ocr.space/parse/image", {
                method: "POST",
                headers: {
                    apikey: OCR_API_KEY
                },
                body: formData,
            });

            const result = await response.json();
            const extractedText = result?.ParsedResults?.[0]?.ParsedText;

            if (extractedText) {
                setExtractedText(extractedText);
            } else {
                setExtractedText("No text found.")
            }
        } catch (error) {
            console.error("OCR API Error:", error);
            setExtractedText("Failed to extract text.")
        } finally {
            setLoading(false);
        }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Scan Product Ingredients</Text>

        <View style={styles.buttonRow}>
            <Button title="Take Photo" onPress={takePhoto} color={colors.button}/>
            <Button title="Pick from Gallery" onPress={pickFromGallery} color={colors.button} />
        </View>

        {/*loading spinner*/}
        {loading && <ActivityIndicator size="large" color={colors.primaryText} style={{ marginTop: 20 }} />}

        {image && <Image source={{ uri: image }} style={styles.image}/>}

        {extractedText && (
            <View>
                <Text>Extracted Ingredients:</Text>
                <Text>{extractedText}</Text>
            </View>
        )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: colors.background,
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.primaryText,
        marginBottom: 20,
        textAlign: "center"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12
    },
    image: {
        width: 250,
        height: 250,
        marginVertical: 20,
        borderRadius: 16,
    },
    resultBox: {
        backgroundColor: "#F3EBDD",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        width: "100%",
    },
    resultTitle: {
        fontWeight: "bold",
        marginBottom: 8,
        color: colors.primaryText,
    },
    resultText: {
        color: colors.secondaryText,
        fontSize: 14,
    },

})

export default PhotoUploadScreen;