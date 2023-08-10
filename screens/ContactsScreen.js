import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ContactScreen({ navigation }) {
  return (
    <ScrollView style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Contacte-nous !</Text>
        <Text style={styles.h3}>
          Envoie-nous ta demande en remplissant le formulaire ci-dessous
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.texte}>Ton message :</Text>
          <TextInput placeholder="Message" style={[styles.input]} />
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
    marginTop: 70,
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
    backgroundColor: "#ffffff",
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
    shadowOpacity: 1,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "#d95b33",
  },
  textButton: {
    fontFamily: "Outfit",
    color: "#ffffff",
    padding: 25,
    fontSize: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 30,
    paddingTop: 10,
    width: "100%"
  },

});
