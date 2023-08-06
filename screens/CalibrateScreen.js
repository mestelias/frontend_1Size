import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

import CalibrateTailles from "./CalibrateTailles";
import CalibrateMensurations from "./CalibrateMensurations"

// Lors de la navigation de CalibrateHomeScreen à ici, on envoie en props la categorie haut/bas/chaussure
// qu'on récupère ici avec "route" en plus de navigation
export default function CalibrateScreen({ navigation, route }) {

  // destructuraction des props, pour récupérer la valeur de la categorie envoyée depuis CalibrateHomeScreen
  const { categorie } = route.params
  console.log(navigation)

  // État pour gérer l'onglet actif
  const [index, setIndex] = useState(0);


  // Définir les routes pour les onglets
  const [routes] = useState([
    { key: "first", title: "Tailles" },
    { key: "second", title: "Mensuration" },
  ]);

    // Fonction pour rendre les scènes des onglets
  const renderScene = SceneMap({
    // Envoie ici aussi des props navigation & categorie, qu'on récupère dans premier & secondroute
    first: () => <CalibrateTailles navigation={navigation} categorie={categorie} />,
    second: () => <CalibrateMensurations navigation={navigation} categorie={categorie} />, 
  });

  // Obtenir la largeur initiale de l'écran
  const initialLayout = { width: Dimensions.get("window").width };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.H1}>Calibrage {categorie}</Text>
          <View style={styles.border}></View>
        </View>
      </SafeAreaView>
      {/* Onglets */}
      <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "#FFFF", margin: 8, fontFamily: 'Outfit', fontSize: 15}}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#d6d1bd", width:'100%', margin:5 }}
            indicatorStyle={{
            backgroundColor: '#d95b33',
            height: '80%',
            marginBottom : 5,
            marginHorizontal : 5,
            width: '47%',
            opacity: 0.8,
            borderRadius: 10,
            // marginLeft : -8,
            }}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: 'center', 
    width: '100%'
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "#fcfaf1",
    marginTop: 30,
  },
  border: {
    // paddingVertical: 10, // Ajoute un padding vertical de 10 pixels autour du texte
    paddingHorizontal: 35, // Ajoute un padding horizontal de 20 pixels autour du texte
    borderBottomWidth: 3, // Ajoute une bordure sous le texte
    borderBottomColor: '#d95b33', // Couleur de la bordure sous le texte
    borderRadius: 50,
  },
  burgerIcon:{
    paddingLeft: 30,
    paddingTop: 15,
  },
  header: {
    justifyContent: "flex-start",
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  H1: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,

  },
  tabView: {
    flex: 1,
    width: "100%",
    paddingHorizontal : 15,
    borderRadius: 20,
  },
  premierRoute: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    justifyContent: "space-around",
    alignItems: "center",
  },
  secondRoute: {
    flex: 1,
    width: "90%",
    backgroundColor: "#FCFAF1",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
  },
  containerInput: {
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: '#fcfaf1',
    borderRadius: 10,
    marginTop: 15,
  },
  inputBox : {
    width : '100%'
  },
  inputBoxRow : {
    flexDirection : "row",
    alignItems : "center"
  },
  inputTexte: {
    marginLeft : -40,
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
    borderRadius: 5,
    backgroundColor: '#ffffff'
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    marginBottom: 30,
    backgroundColor: "#d95b33",
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
    color: "#ffffff",
    fontFamily: 'Outfit',
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  tailleSwitch: {
    flexDirection: "row",
    justifyContent: "center",
  },
  taille: {
    color: "#707B81",
    padding: 15,
  },
  tailleBold:{
    color: "#1a2530",
    padding: 15,
    fontWeight: "bold",
  },
  h3: {
    color: "#000000",
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: "Outfit",
  },
  texte: {
    fontFamily: "Outfit",
  },
  error: {
    color: "#DF1C28",
    fontFamily: "Outfit",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  scrollView:{
    flex: 1,
  },
  mensurationHeader : {
    marginTop: 20,
    alignItems: "center",
  },
  roundedImage: {
    width: 150, 
    height: 150,
    borderRadius: 75, 
  },
});