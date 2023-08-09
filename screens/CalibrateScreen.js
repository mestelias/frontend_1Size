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

export default function CalibrateScreen({ navigation, route }) {
  const { categorie } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Tailles" },
    { key: "second", title: "Mensurations" },
  ]);

  const renderScene = SceneMap({
    first: () => <CalibrateTailles navigation={navigation} categorie={categorie} />,
    second: () => <CalibrateMensurations navigation={navigation} categorie={categorie} />,
  });

  const initialLayout = { width: Dimensions.get("window").width };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.header}>
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
      </View>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ route, color }) => (
                <Text style={{ color: "#FFFF", margin: 8, fontFamily: 'Outfit', fontSize: 15 }}>{route.title}</Text>
              )}
              style={{ backgroundColor: "#d6d1bd", width: '100%', margin: 5, borderRadius: 20 }} // Rounded edges for the TabBar
              indicatorStyle={{
                backgroundColor: '#d95b33',
                height: '80%',
                marginBottom: 5,
                marginHorizontal: 5,
                width: '47%',
                opacity: 0.8,
                borderRadius: 10, // Rounded edges for the tab indicator
              }}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FCFAF1"', 
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