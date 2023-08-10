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
import CalibrateMensurations from "./CalibrateMensurations";

// Lors de la navigation de CalibrateHomeScreen à ici, on envoie en props la categorie haut/bas/chaussure
// qu'on récupère ici avec "route" en plus de navigation
export default function CalibrateScreen({ navigation, route }) {

  // destructuraction des props, pour récupérer la valeur de la categorie envoyée depuis CalibrateHomeScreen
  const { categorie } = route.params;
  console.log(navigation);

  // État pour gérer l'onglet actif
  const [index, setIndex] = useState(0);

  // Définir les routes pour les onglets
  const [routes] = useState([
    { key: "first", title: "Tailles" },
    { key: "second", title: "Mensurations" },
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
    <SafeAreaView style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.burgerIcon}>
          <FontAwesome name={"bars"} size={40} color={"#25958A"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Calibrage")} style={styles.retourButton}>
          <Text style={{ fontWeight: 'bold', color: '#D95B33' }}>Retour</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.H1}>Calibrage {categorie}</Text>
        <View style={styles.border}></View>
      </View>
      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ route, color }) => (
                <Text style={{ color: "#FFFF", margin: 8, fontFamily: 'Outfit', fontSize: 15}}>{route.title}</Text>
              )}
              style={styles.tabBar}
              indicatorStyle={styles.indicator}
            />
          )}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={styles.tabView}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FCFAF1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingLeft: 15,
    paddingTop: 8,
  },
  burgerIcon: {},
  retourButton: {
    marginRight: 10,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "#fcfaf1",
    // marginTop: 0,
  },
  border: {
    paddingHorizontal: 35, 
    borderBottomWidth: 3,
    borderBottomColor: '#d95b33', 
    borderRadius: 50,
    marginBottom: 20,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabBar: {
    backgroundColor: "#d6d1bd",
    width: '100%',
    marginRight: 10, // Adjusted marginRight
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 20,
  },
  indicator: {
    backgroundColor: '#d95b33',
    height: '80%',
    marginBottom: 5,
    marginHorizontal: 5,
    width: '47%',
    opacity: 0.8,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  H1: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  tabView: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    borderRadius: 20,
  },
});