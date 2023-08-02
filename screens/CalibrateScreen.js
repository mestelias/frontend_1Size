import * as React from "react";
import { useState } from "react";

//font
import { useFonts } from "expo-font";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const FirstRoute = () => (
  <View style={styles.firstRoute}>
    <View>
      <Text style={styles.h3}>Ajouter une taille</Text>
    </View>
    <View>
      Counter
    </View>
    <View style={styles.inputContainer}>
      <TextInput
            placeholder="Marque" 
            style={[
              styles.input,
              (errors.firstname) ? styles.inputError : null
            ]}
            onChangeText={(value) => setFirstname(value)}
            value={firstname}
          />  
    </View>
    <View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
        // onPress={()=> }
      >
        <Text style={styles.textButton}>Suivant</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#FCFAF1" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function CalibrateScreen({ navigation }) {
  
  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Tailles" },
    { key: "second", title: "Mensuration" },
  ]);

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
          <Text>CalibrateScreen</Text>
        </SafeAreaView>
        <View style={styles.titleBox}>
          <Text style={styles.H1}>Calibrage Haut</Text>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }} 
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "#FFFF", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#d95b33", fontFamily: "Outfit" }}
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
    alignItems: 'center'
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
    fontFamily: "Outfit",
  },
  tabView: {
    marginTop: 10,
    width: "80%",
    borderRadius: 10,
  },
  firstRoute: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    justifyContent: "space-around",
    alignItems: "center",
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
  h3: {
    color: "#707B81",
    fontSize: 20,
    fontFamily: "Outfit",
  },
  textButton: {
    color: "#707B81",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Outfit",
  },
  inputError: {
    borderColor: "#DF1C28",
    borderWidth: 1,
  },
  error: {
    color: "#DF1C28",
    fontFamily: "Outfit",
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
});
