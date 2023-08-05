
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



export default function ContactScreen() {

  
  return (
    <ScrollView style={styles.background} > 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Contactez nous !</Text>
        <Text style={styles.h3}>Envoyez nous votre demande en remplissant le formulaire ci-dessous</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.texte}>Votre message :</Text>
          <TextInput
            placeholder="Message"
            style={[
              styles.input                          
            ]}   
            
          />
          
        </View>
       
        <View style={styles.pressBottom}>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.register}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Envoyer le formulaire</Text>
          </TouchableOpacity>     
         
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
    height: 200,
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
    width: "100%",
    height: "35%",
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
