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
          <TouchableOpacity onPress={() => navigation.navigate("Calibrage")}>
            <Text style={{ fontWeight: 'bold', color: '#D95B33' }}>Retour</Text>
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
    paddingHorizontal: 35, 
    borderBottomWidth: 3,
    borderBottomColor: '#d95b33', 
    borderRadius: 50,
  },
  burgerIcon:{
    flexDirection: "row",
    justifyContent: "space-btween",
    width: "100%",
    paddingLeft: 30,
    paddingTop: 15,
  },
  header: {
    justifyContent: "flex-start",
    width: "100%",
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
});