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

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignUpScreen({ navigation }) {
  // les états correspondants aux inputs
  const [firstname, setFirstname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


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
    fetch("http://192.168.10.164:3000/users/signup", {
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
          // dispatch(login({ username: signUpUsername, token: data.token }));
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

  console.log('password', passwordMatch)
  console.log('email', emailValid)

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Crée ton compte</Text>
        <Text style={styles.h3}>Pour commencer l'aventure OneSize</Text>
        {/* FIXME error lors de la navigation (même si ça fonctionne) */}
        <TouchableOpacity onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AppDrawerNavigation' }],
          });
          navigation.navigate('HomeScreen');}} 
          style={styles.header}>
            
          <Text style={styles.color}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Prenom"
            style={[
              styles.input,
              (errors.firstname) ? styles.inputError : null
            ]}
            onChangeText={setFirstname}
            value={firstname}
          />
          {/* Add error styles to other input fields */}
          <TextInput
            placeholder="Nom"
            style={[
              styles.input,
              (errors.name) ? styles.inputError : null

            ]}
            onChangeText={setName}
            value={name}
          />
          <TextInput
            placeholder="Username"
            style={[
              styles.input,
              (errors.username) ? styles.inputError : null

            ]}
            onChangeText={setUsername}
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
            placeholder="Sexe"
            style={[
              styles.input,
              (errors.gender) ? styles.inputError : null

            ]}
            onChangeText={(value) => setGender(value)}
            value={gender}
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
          {/* {errorEmail ? <Text style={styles.error}>{errorEmail}</Text> : null}
          {errorPassword ? (
            <Text style={styles.error}>{errorPassword}</Text>
          ) : null}
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null} */}

          <TouchableOpacity
            onPress={() => handleRegister()}
            style={styles.register}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>S'enregistrer</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.google}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>S'enregistrer avec Google</Text>
          </TouchableOpacity> */}

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
    flexDirection: "column",
    // backgroundColor: "#FCFAF1",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    fontFamily: "Futura",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  h3: {
    width: "80%",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  input: {
    // alignItems: "center",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    width: 300,
    fontFamily: "Outfit",
  },
  color: {
    color: "#d95b33",
  },
  header: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  register: {
    alignItems: "center",
    paddingTop: 8,
    width: "100%",
    marginTop: 30,
    backgroundColor: "#d95b33",
    borderRadius: 1,
  },
  google: {
    alignItems: "center",
    paddingTop: 8,
    width: "100%",
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 1,
  },
  inputError: {
    borderColor: "#DF1C28",
    borderWidth: 1,
  },
  error: {
    color: "#DF1C28",
    fontFamily: "Outfit",
  },
});
