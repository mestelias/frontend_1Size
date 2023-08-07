import * as React from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactsScreen({ navigation }) {
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
        <Text style={styles.H1}>Contactez nous</Text>
        <View style={styles.border}></View>
      <View style={styles.container}>
      </View>
      <Text style={styles.h3}>Envoyez nous votre demande en remplissant le formulaire ci-dessous</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.texte}>Votre message :</Text>
          <TextInput
            placeholder="Message"
            style={[
              styles.input                          
            ]}   
            
          />
          
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