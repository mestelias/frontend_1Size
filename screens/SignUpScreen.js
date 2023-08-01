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
  const [gender, setGender] = useState([{ id: 1, value: true, name: "Homme", selected: false },
  { id: 2, value: false, name: "Femme", selected: false }]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Création des différents éléments pour chaque radiobouton qui sera map dans le return
  const RadioButton = ({ onPress, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Fonction onclick du Radiobouton pour passer d'un sexe à un autre
  const onRadioBtnClick = (item) => {
    let updatedState = gender.map((isGender) =>
      isGender.id === item.id
        ? { ...isGender, selected: true }
        : { ...isGender, selected: false }
    );
    setGender(updatedState);
  };

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleSubmit()} activeOpacity={0.8}>
          <Text style={styles.color}>Retour</Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Text style={styles.title}>Crée ton compte</Text>
        <View style={styles.onesize}>
          <Text style={styles.h3}>Pour commencer l'aventure</Text>
          <Text style={styles.one}> 1</Text>
          <Text style={styles.size}>Size</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <View style = {styles.gender}>
            {/* Radio boutons */}
            {gender.map((item) => (
            <RadioButton
              onPress={() => onRadioBtnClick(item)}
              selected={item.selected}
              key={item.id}
            >
            {item.name}
            </RadioButton>
            ))} 
            {/* Radio boutons */}
          </View>
          <TextInput
            placeholder="Prenom" 
            style={styles.input}
            onChangeText={(value) => setFirstname(value)}
            value={firstname}
          />
          <TextInput
            placeholder="Nom" 
            style={styles.input}
            onChangeText={(value) => setName(value)}
            value={name}
          />
          <TextInput
            placeholder="Username" 
            style={styles.input}
            onChangeText={(value) => setUsername(value)}
            value={username}
          />
          <TextInput
            placeholder="Adresse mail" 
            style={styles.input}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <TextInput
            placeholder="Mot de passe" 
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
          <TextInput
            placeholder="Confirmation mot de passe" 
            style={styles.input}
            onChangeText={(value) => setConfirmPassword(value)}
            value={confirmPassword}
          />
        </View>

        <View style={styles.pressBottom}>
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.register} activeOpacity={0.8}>
            <Text style={styles.textButton}>S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSubmit()} style={styles.google} activeOpacity={0.8}>
            <Text style={styles.textGoogle}>S'inscrire avec Google</Text>
          </TouchableOpacity>
          
          <View style={styles.connect}>
            <Text style={styles.textCompte}>Tu as déjà un compte ?</Text>
            <TouchableOpacity onPress={() => handleSubmit()} activeOpacity={0.8}>
              <Text style={styles.textConnexion}> Connecte-toi</Text>
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
  onesize: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  one: {
    fontSize: 20,
    fontFamily: "Outfit",
    textAlign: "center",
    color: '#d95b33'
  },
  size: {
    color: '#707B81',
    textAlign: "center",
    fontFamily: "Outfit",
    fontSize: 20,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    textAlign: "center"
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '80%',
    backgroundColor: '#fcfaf1',
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
    marginBottom: 10, 
    width: "100%",
    fontFamily: 'Outfit',
    borderRadius: 5,
    backgroundColor: '#ffffff'
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
    padding: 10,
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
  connect: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  textCompte: {
    fontFamily: 'Outfit',
    fontSize: 15,
  },
  textConnexion: {
    fontFamily: 'Outfit',
    color: '#d95b33',
    fontSize: 15,
    marginStart: 5
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginRight: 30,
    marginLeft: 30,
    padding: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    alignItems: "center",
    justifyContent: "center"
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#25958A"
  },
  radioButtonText: {
    fontFamily: "Outfit",
    fontSize: 12,
    marginLeft: 16,
  },
  gender: {
    marginTop: 20,
    flexDirection: "row",
  }
})