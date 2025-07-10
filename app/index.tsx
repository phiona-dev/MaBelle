
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

const WelcomeScreen = () => {
    const router = useRouter();
  return (
    <View style={styles.container}>
        <Image source={require("../assets/MaBelle-logo.png")} style={styles.logo}/>
        <Text style={styles.title}>MaBelle</Text>
        <Text style={styles.tagline}>Your skincare guide</Text>

        <Pressable style={styles.button} onPress={() => router.push("/photo-upload")}>
            <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Pressable style={styles.languageButton} onPress={() => {}}>
            <Text style={styles.languageText}>Change Language</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: 160,
        height: 150,
        marginBottom: 10,
        resizeMode: "contain",
    },
    title: {
        fontSize: 54,
        color: colors.primaryText,
        fontWeight: "bold",
        marginBottom: 10,
    },
    tagline: {
        fontSize: 16,
        color: colors.secondaryText,
        marginBottom: 30,
        textAlign: "center"
    },
    button: {
        backgroundColor: colors.button,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 16,
        marginBottom: 12,
        marginTop: 30,
    },
    buttonText: {
        fontSize: 16,
        color: colors.white
    },
    languageButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    languageText: {
        color: colors.secondaryText,
        fontSize: 14,
        textDecorationLine: "underline"
    }
})
export default WelcomeScreen