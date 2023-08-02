import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SelectList } from 'react-native-dropdown-select-list'
import { useState } from "react";


// Composant Tailles
const PremierRoute = ({ onSubmit }) => {

  const data = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
  ]

  const [marque, setMarque] = useState();
  const [type, setType] = useState();
  const [categorie, setCoupe] = useState();
  const [taille, setTaille] = useState();

// TODO Fonction pour vérifier si le formulaire est valide
  /*const isFormValid = () => {
    return ();
  };*/

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.premierRoute}>
          <View style={styles.containerInput}>
          <SelectList 
              setSelected={(val) => setMarque(val)} 
              data={data} 
              save="value"
              placeholder="marque"
          />
          <SelectList 
              setSelected={(val) => setType(val)} 
              data={data} 
              save="value"
              placeholder="type"
          />
          <SelectList 
              setSelected={(val) => setCoupe(val)} 
              data={data} 
              save="value"
              placeholder="coupe"
          />
          <SelectList 
              setSelected={(val) => setTaille(val)} 
              data={data} 
              save="value"
              placeholder="taille"
          />
          </View>
          <View>
            {/* Bouton Suivant */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              //
              //  TODO vérification et envoi du formulaire
              //
              //   onPress={() => {
              //   if (isFormValid()) {
              //     onSubmit(
              //     );
              //   } else {
              //     console.log("Veuillez remplir tous les champs.");
              //   }
              // }}
            >
              <Text style={styles.textButton}>
                Suivant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#FCFAF1" }} />
);

// Composant principal CalibrateScreen
export default function CalibrateScreen({ navigation }) {

  // État pour gérer l'onglet actif
  const [index, setIndex] = React.useState(0);

  // Définir les routes pour les onglets
  const [routes] = React.useState([
    { key: "first", title: "Tailles" },
    { key: "second", title: "Mensuration" },
  ]);

  // Fonction de soumission du formulaire
  const onSubmit = (marque, type, coupe, taille) => {
    console.log(marque, type, coupe, taille);
  };
  
  // Fonction pour rendre les scènes des onglets
  const renderScene = SceneMap({
    first: () => <PremierRoute onSubmit={onSubmit} />,
    second: SecondRoute,
  });

  // Obtenir la largeur initiale de l'écran
  const initialLayout = { width: Dimensions.get("window").width };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          {/* Icône de menu pour ouvrir le menu latéral */}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
          <Text>CalibrateScreen</Text>
        </SafeAreaView>
        <View style={styles.titleBox}>
          <Text style={styles.H1}>Calibrage Haut</Text>
        </View>
      </View>
      {/* Onglets */}
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "#FFFF", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#d95b33" }}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    alignItems: "center",
  },
  container: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  titleBox: {},
  H1: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  tabView: {
    marginTop: 10,
    width: "80%",
    borderRadius: 10,
  },
  premierRoute: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    justifyContent: "space-around",
    alignItems: "center",
  },
  containerInput: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "80%",
    backgroundColor: "#fcfaf1",
    borderRadius: 10,
  },
  input: {
    alignItems: "flex-start",
    height: 40,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#D6D1BD",
    borderRadius: 30,
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
  },
  picker: {
    height: 50,
    width: "100%",
  },
});