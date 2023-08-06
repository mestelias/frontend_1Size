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
import { useDispatch } from 'react-redux';
import { addUserToStore } from '../reducers/user';

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
export default function SignInScreen({ navigation }) {

  const dispatch = useDispatch();

  const backendIp = process.env.EXPO_PUBLIC_IP
  // les états correspondants aux inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Etats pour message d'erreur
  const [errorMsg, setErrorMsg] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  //l'état pour afficher le messsage d'erreur
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = () => {
    // Reset error message and error inputs
    let errors = {};

    errors.email = email === "";
    errors.password = password === "";

    setErrors(errors);

    // Vérifie si email valide
    const emailValid = EMAIL_REGEX.test(email);
    setEmailValid(emailValid);

    // Vérifie si un état est en erreur
    let inputMissing = false;
    for (let e in errors) {
      if (errors[e]) {
        inputMissing = true;
        break;
      }
    }

    if (inputMissing) {
      
      setErrorMsg("Merci de remplir le(s) champ(s) manquant(s)");
      return;
    }

    if (!emailValid) {
      
      setErrorMsg("L'email n'est pas valide");
      return;
    }

    setErrorMsg('')


    fetch(`${backendIp}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        motdepasse: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // On vérifie si l'utilisateur a bien été trouvé en BDD
        if (data.result) {
          // On stocke le token utilisateur dans le reducer user
          dispatch(addUserToStore({username : data.data.username, token:data.data.token, image:data.data.image}));
          //on redirige l'utilisateur vers la Home
          navigation.navigate("HomeStack");
        } else {
          // User already exists in database
          setErrorMsg(data.error);
        }
        // dispatch(login(signInUsername));
        setEmail("");
        setPassword("");
      });
  };

    // Fonction pour empêcher l'utilisateur de faire la saisie en majuscule
    const updateEmail = (value) => {
      setEmail(value.toLowerCase()); 
    };

  return (
    <ScrollView style={styles.background} > 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Connecte-toi</Text>
        <Text style={styles.h3}>Pour obtenir ta vraie taille</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.texte}>Adresse mail</Text>
          <TextInput
            placeholder="Adresse mail"
            style={[
              styles.input,
              (errors.email || !emailValid) ? styles.inputError : null
              
            ]}
            onChangeText={(value) => updateEmail(value)}
            value={email}
          />
          <Text style={styles.texte}>Mot de passe</Text>
          <TextInput
            placeholder="Mot de passe"
            style={[styles.input, errors.password ? styles.inputError : null]}
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.colormdpBottom}
            activeOpacity={0.8}
          >
            <Text style={styles.colormdp}> J'ai oublié mon mot de passe</Text>
          </TouchableOpacity>
        </View>
        { errorMsg !== '' ? <Text style={styles.error}>{errorMsg}</Text>  : null }
        <View style={styles.pressBottom}>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.register}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // TO DO : INSCRIPTION AVEC GOOGLE
            onPress={() => navigation.navigate('Home')}
            style={styles.google}
            activeOpacity={0.8}
          >
            <Text style={styles.textGoogle}>Se connecter avec Google</Text>
          </TouchableOpacity>

          <View style={styles.creation}>
            <Text style={styles.textCompte}>Tu n'as pas de compte ?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.textCreation}>Créer un compte</Text>
            </TouchableOpacity>
          </View>

          {/* {emailError && <Text style={styles.error}>Invalid email address</Text>} */}

          {/* <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fcfaf1",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fcfaf1",
    marginTop: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    fontFamily: "Outfit",
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
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "90%",
    backgroundColor: "#fcfaf1",
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  texte: {
    fontFamily: "Outfit",
  },
  input: {
    alignItems: "flex-start",
    height: 40,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    fontFamily: "Outfit",
    borderRadius: 5,
    backgroundColor: '#ffffff'
  },
  colormdpBottom: {
    width: "100%",
  },
  colormdp: {
    color: "#707b81",
    fontFamily: "Outfit",
    fontSize: 15,
    textAlign: "right",
    textDecorationLine: "underline",
  },
  pressBottom: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "90%",
    backgroundColor: "#fcfaf1",
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  register: {
    alignItems: "center",
    paddingTop: 3,
    width: "100%",
    height: "20%",
    marginTop: 10,
    backgroundColor: "#d95b33",
    borderRadius: 30,
  },
  google: {
    alignItems: "center",
    paddingTop: 3,
    width: "100%",
    height: "20%",
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 30,
  },
  textButton: {
    fontFamily: "Outfit",
    color: "white",
    padding: "5%",
    fontSize: 20,
  },
  textGoogle: {
    fontFamily: "Outfit",
    padding: "5%",
    fontSize: 20,
  },
  creation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  textCompte: {
    fontFamily: "Outfit",
    fontSize: 15,
  },
  textCreation: {
    fontFamily: "Outfit",
    color: "#d95b33",
    fontSize: 15,
    marginStart: 5,
  },
  inputError: {
    borderColor: "#DF1C28",
    borderWidth: 1,
  },
  error: {
    color: "#DF1C28",
    fontFamily: "Outfit",
    fontSize: 17,
  },
});
