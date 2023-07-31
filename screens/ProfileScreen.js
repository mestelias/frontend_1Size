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
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@rneui/themed";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
          <Text>Retour</Text>
        </View>
        <View style={styles.profilAvatar}>
          <Text style={styles.h1}>Profil</Text>
          <Text>@Samy</Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            // A REDIRIGER VERS LE CALIBRAGE
            // onPress={()=> }
          >
            <Text style={styles.textButton}>Me re-calibrer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataProfil}>
          <View>
            <Text style={styles.h3}>Mes coordonnées</Text>
          </View>
          <View style={styles.inputProfil}>
            <TextInput
              style={styles.input}
              onChangeText={setFirstname}
              value={firstname}
              placeholder="Prénom"
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Nom"
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Nom utilisateur"
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          //todo : AJOUTER LA FONCTIONNALITE POUR SAUVEGARDER LES INPUTS DE PROFIL
          // onPress={()=> }
        >
          <Text style={styles.textButton}>Sauvegarder</Text>
        </TouchableOpacity>
      </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    // backgroundColor: "#FCFAF1",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  profilAvatar: {
    width: "100%",
    margin: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  h3: {
    width: "80%",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    marginBottom: 10,
  },
  dataProfil: {
    alignItems: "center",
    width: "100%",
  },
  inputProfil: {
    alignItems: "center",
    width: "100%",
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
  h1: {
    fontFamily: "Outfit",
    fontSize: 24,
    marginBottom: 5,
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 30,
    backgroundColor: "#D6D1BD",
    borderRadius: 30,
    marginBottom: 80,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
  },
  textButton: {
    color: "#707B81",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Outfit",
  },
  imageAvatar: {
    width: 90,
    height: 124,
    marginTop: 15,
  },
});
