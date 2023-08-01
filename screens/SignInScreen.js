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

  const handleSubmit = () => {
    
    fetch("http://192.168.10.164:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        motdepasse: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
      })

  }

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleSubmit()} activeOpacity={0.8}>
          <Text style={styles.color}>Retour</Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Text style={styles.title}>Connecte-toi</Text>
        <Text style={styles.h3}>Pour obtenir ta vraie taille</Text>
  
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
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.colormdpBottom} activeOpacity={0.8}>
            <Text style={styles.colormdp}> J'ai oublié mon mot de passe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pressBottom}>
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.register} activeOpacity={0.8}>
            <Text style={styles.textButton}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSubmit()} style={styles.google} activeOpacity={0.8}>
            <Text style={styles.textGoogle}>Se connecter avec Google</Text>
          </TouchableOpacity>
          
          <View style={styles.creation}>
            <Text style={styles.textCompte}>Tu n'as pas de compte ?</Text>
            <TouchableOpacity onPress={() => handleSubmit()} activeOpacity={0.8}>
              <Text style={styles.textCreation}> Crée un compte</Text>
            </TouchableOpacity>
          </View>
  
          {/* {emailError && <Text style={styles.error}>Invalid email address</Text>} */}
  
          {/* <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  header: {
    flex: 0.1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fcfaf1',
  },
  color: {
    // LA POLICE N'EST PAS LA BONNE, PAS COMPATIBLE AVEC LE BOLD
    color: '#d95b33',
    //fontFamily: 'Outfit',
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: '#fcfaf1'
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
    textAlign: "center"
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '90%',
    backgroundColor: '#fcfaf1',
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  texte: {
    fontFamily: 'Outfit',
  },
  input: {
    alignItems: 'flex-start',
    height: 40,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    marginTop: 10,
    marginBottom: 20, 
    width: "100%",
    fontFamily: 'Outfit',
    borderRadius: 5,
  },
  colormdpBottom: {
    width: '100%',
  },
  colormdp: {
    color: '#d95b33',
    fontFamily: 'Outfit',
    fontSize: 15,
    textAlign: 'right',
  },
  pressBottom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '90%',
    backgroundColor: '#fcfaf1',
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  register: {
    alignItems: 'center',
    paddingTop: 3,
    width: '100%',
    height: '20%',
    marginTop: 10,
    backgroundColor: '#d95b33',
    borderRadius: 30,
  },
  google: {
    alignItems: 'center',
    paddingTop: 3,
    width: '100%',
    height: '20%',
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  textButton: {
    fontFamily: 'Outfit',
    color: 'white',
    padding : '5%',
    fontSize: 20,
  },
  textGoogle: {
    fontFamily: 'Outfit',
    padding : '5%',
    fontSize: 20,
  },
  creation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  textCompte: {
    fontFamily: 'Outfit',
    fontSize: 15,
  },
  textCreation: {
    fontFamily: 'Outfit',
    color: '#d95b33',
    fontSize: 15,
    marginStart: 5
  },
})