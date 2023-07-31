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

export default function SignUpScreen() {
  const [firstname, setFirstname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Text style={styles.title}>Crée ton compte</Text>
        <Text style={styles.h3}>Pour commencer l'aventure 1Size</Text>
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity> */}
          <Text style={styles.color} >Retour</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Prenom" 
            style={styles.input}
            onChangeText={setFirstname}
            value={firstname}
          />
          <TextInput
            placeholder="Nom" 
            style={styles.input}
            onChangeText={setName}
            value={name}
          />
          <TextInput
            placeholder="Username" 
            style={styles.input}
            onChangeText={setUsername}
            value={username}
          />
          <TextInput
            placeholder="Adresse mail" 
            style={styles.input}
            onChangeText={(value) => setEmail(value)}
            value={email}
          /> 
          <TextInput
            placeholder="Sexe" 
            style={styles.input}
            onChangeText={(value) => setGender(value)}
            value={gender}
          /> 
          <TextInput
            placeholder="Mot de passe" style={styles.input}
          />
          <TextInput
            placeholder="Confirmation mot de passe" style={styles.input}
          />

          <TouchableOpacity onPress={() => handleSubmit()} style={styles.register} activeOpacity={0.8}>
            <Text style={styles.textButton}>S'enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSubmit()} style={styles.google} activeOpacity={0.8}>
            <Text style={styles.textButton}>S'enregistrer avec Google</Text>
          </TouchableOpacity>
  
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
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    fontFamily: 'Futura',
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
  },
  color: {
    color: '#d95b33',
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
    borderRadius: 1,
  },
  google: {
    alignItems: 'center',
    paddingTop: 8,
    width: '100%',
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 1,
  },
})