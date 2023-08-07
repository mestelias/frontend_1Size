import * as React from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FriendsScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
            </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.H1}>Mes amis</Text>
        <View style={styles.border}></View>
      <View style={styles.container}>
      </View>
        
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
      borderBottomWidth:3,
      borderBottomColor: '#d95b33', 
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
    H1: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 20,
    },
  });
