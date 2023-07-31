import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Text style={styles.title}>Connecte-toi</Text>
        <Text style={styles.h3}>Pour obtenir ta vraie taille</Text>
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity> */}
          <Text style={styles.color}>Retour</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.texte}>Adresse mail</Text>
          <TextInput
            placeholder="Adresse mail" 
            style={styles.input}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <Text style={styles.texte}>Mot de passe</Text>
          <TextInput
            placeholder="Mot de passe" 
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
          <Text style={styles.color}>J'ai oublié mon mot de passe</Text>
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.register} activeOpacity={0.8}>
            <Text style={styles.textButton}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSubmit()} style={styles.google} activeOpacity={0.8}>
            <Text style={styles.textButton}>Se connecter avec Google</Text>
          </TouchableOpacity>
          <Text style={styles.textButton}>Tu n'as pas de compte ?</Text>
          <Text style={styles.textCreation}>Crée un compte</Text>
  
          {/* {emailError && <Text style={styles.error}>Invalid email address</Text>} */}
  
          {/* <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    // backgroundColor: "#FCFAF1",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    backgroundColor: '#fcfaf1'
  },
  texte: {
    fontFamily: 'Outfit',

  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    fontFamily: 'Outfit',
    marginBottom: 20,
    alignItems: "center",
    justifyContent: 'center'
  },
  h3: {
    width: "80%",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    marginBottom: 10,
  },
  input: {
    alignItems: "center",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    width: "80%",
    fontFamily: 'Outfit',
    borderRadius: 5,
  },
  color: {
    color: '#d95b33',
    fontFamily: 'Outfit',
  },
  header: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  register: {
    alignItems: 'center',
    paddingTop: 8,
    width: '100%',
    marginTop: 30,
    backgroundColor: '#d95b33',
    borderRadius: 15,
  },
  google: {
    alignItems: 'center',
    paddingTop: 8,
    width: '100%',
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  textButton: {
    fontFamily: 'Outfit'
  },
  textCreation: {
    fontFamily: 'Outfit',
    color: '#d95b33',
  }
})