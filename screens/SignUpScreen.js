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
import { checkbody } from "../modules/checkBody";
import { useDispatch } from 'react-redux';
import { addUserToStore } from '../reducers/user';

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export default function SignUpScreen() {
  const [firstname, setFirstname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState([{ id: 1, value: true, name: "Homme", selected: false },
  { id: 2, value: false, name: "Femme", selected: false }]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const dispatch = useDispatch();

  //l'état pour afficher le messsage d'erreur 
  const [errors, setErrors] = useState({
    firstname: false,
    name: false,
    username: false,
    email: false,
    gender: false,
    password: false,
    confirmPassword: false,
  })

  // Message d'erreur
  const [errorMsg, setErrorMsg] = useState("")
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [emailValid, setEmailValid] = useState(true)

  //Enregistrement d'un nouvel utilisateur
  const handleRegister = () => {
    // Reset error message and error inputs
  
  let errors = {};
  
  errors.firstname = (firstname === "")
  errors.name = (name === "")
  errors.username = (username === "")
  errors.email = (email === "")
  errors.gender = (gender === "")
  errors.password = (password === "")
  errors.confirmPassword = (confirmPassword === "")
  
  setErrors(errors)

  // Vérifie si email valide
  const emailValid = (EMAIL_REGEX.test(email))
  setEmailValid(emailValid)

  // Vérifie si un état est en erreur
  let inputMissing = false
  for (let e in errors){
    if (errors[e]) {
      inputMissing = true
      break
    }
  }
  // Vérifie si les mots de passe sont identiques
    let passwordMatch = password === confirmPassword
    setPasswordMatch(passwordMatch)
    
  if (inputMissing){
    console.log('1')
    setErrorMsg('Merci de remplir le(s) champ(s) manquant(s)')
    return
  }
  
  if (!passwordMatch){
    console.log('2')

    setErrorMsg('Les mots de passe ne sont pas identiques')
    return
  }

  if (!emailValid){
    console.log('3')

    setErrorMsg("L'email n'est pas valide")
    return
  }

  console.log('4')
  setErrorMsg('')

  
    // On requête la route sign up
    fetch("http://192.168.10.188:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: name,
        prenom: firstname,
        genre: gender,
        email: email,
        username: username,
        motdepasse: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addUserToStore({data}));
          setUsername("");
          setPassword("");
          navigation.navigate("HomeScreen");
        } else {
          // User already exists in database
          //TO DO : gérer l'affichage
          console.log("User already exists");
        }
      });
  };

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
        <TouchableOpacity onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AppDrawerNavigation' }],
          });
          navigation.navigate('HomeScreen');}} 
          activeOpacity={0.8}>
            
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
            style={[
              styles.input,
              (errors.firstname) ? styles.inputError : null
            ]}
            onChangeText={(value) => setFirstname(value)}
            value={firstname}
          />
          <TextInput
            placeholder="Nom" 
            style={[
              styles.input,
              (errors.name) ? styles.inputError : null
            ]}
            onChangeText={(value) => setName(value)}
            value={name}
          />
          <TextInput
            placeholder="Username" 
            style={[
              styles.input,
              (errors.username) ? styles.inputError : null
            ]}
            onChangeText={(value) => setUsername(value)}
            value={username}
          />
          <TextInput
            placeholder="Adresse mail" 
            style={[
              styles.input,
              (errors.email || !emailValid) ? styles.inputError : null
            ]}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <TextInput
            placeholder="Mot de passe" 
            style={[
              styles.input,
              (errors.password || !passwordMatch ) ? styles.inputError : null
            ]}
            onChangeText={(value) => setPassword(value)}
            value={password}
            secureTextEntry={true}
          />
          <TextInput
            placeholder="Confirmation mot de passe" 
            style={[
              styles.input,
              (errors.confirmPassword || !passwordMatch ) ? styles.inputError : null
            ]}
            onChangeText={(value) => setConfirmPassword(value)}
            value={confirmPassword}
            secureTextEntry={true}
          />
          { errorMsg !== '' ? <Text style={styles.error}>{errorMsg}</Text>  : null }
        </View>

        <View style={styles.pressBottom}>
          <TouchableOpacity onPress={() => handleRegister()} style={styles.register} activeOpacity={0.8}>
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
    width: '100%',
    height: '18%',
    marginTop: 10,
    backgroundColor: '#d95b33',
    borderRadius: 30,
  },
  google: {
    alignItems: 'center',
    width: '100%',
    height: '18%',
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
  },
  inputError: {
    borderColor: "#DF1C28",
    borderWidth: 1,
  },
  error: {
    color: "#DF1C28",
    fontFamily: "Outfit",
  },
})