import * as React from "react";
import { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Animated, Easing } from "react-native";

export default function HelpScreen({ navigation }) {

  console.log(restartAnim)
  console.log('show', showAnimation)

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
        <Text style={styles.H1}>Besoin d'aide ?</Text>
        <View style={styles.border}></View>
      <View style={styles.container}>

          {/* <View style={styles.animationContainer}> */}
          {showAnimation && (
            <AnimatedLottieView
              source={require("../assets/animations/shoes-colorOneSize.json")}
              progress={animationProgress.current}
              style={styles.lottieView}
            />
          )}


        <TouchableOpacity style={styles.button}
          title="Restart Animation"
          onPress={() => {
            animationProgress.current.setValue(0);  // Réinitialisez la progression de l'animation.
            setShowAnimation(true);                 // Affichez l'animation.
            setRestartAnim(prev => !prev); // Changez l'état pour déclencher le useEffect.
        }}
          >
          <Text>Clique-ici</Text>

        </TouchableOpacity>
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
      justifyContent: 'flex-start',
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
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 3,
      width: 250,
      height: 50,
      marginTop: 10,
      backgroundColor: "#d95b33",
      borderRadius: 30,
    },
    animationContainer: {
      // backgroundColor: '#fff',
      // alignItems: 'center',
      // justifyContent: 'center',
      // flex: 1,
    },
    buttonContainer: {
      paddingTop: 20,
    },
    lottie: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      width: 300,
      height: 300,
  }  
  });