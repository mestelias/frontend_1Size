import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//font
import { useFonts } from "expo-font";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const url = process.env.EXPO_PUBLIC_IP

export default function MarqueScreen({ navigation, route }) {
  const categorie = route.params.categorie
  const [marquesDispo, setMarquesDispo] = useState([]); // récupéré au moment du fetch
  const sexe = useSelector((state)=>state.user.value.genre)
  const sexeLC = sexe && sexe.toLowerCase()

  //const [search, setSearch] = useState('');

  const images = marquesDispo.map((data, i) => {
    return (
      <TouchableOpacity key={i} style={styles.photoContainer} onPress={()=>{navigation.navigate('MarqueTypeScreen', {name:data.name, categorie:categorie})}}>
        <Image source={ {uri:data.url} } style={styles.photo} resizeMode='contain'/>
      </TouchableOpacity>
    );
  });

  useEffect(()=>{
    fetch(`${url}/marques/logos?sexe=${sexeLC}&categorie=${categorie}`)
    .then((response)=> response.json())
    .then((marques) => setMarquesDispo(marques))
  
  }, [categorie])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name={"bars"} size={40} color={"#25958A"} />
        </TouchableOpacity> */}
        <Text style={styles.retour}>Retour</Text> 
      </View>
      <Text style={styles.H1}>{categorie}</Text>
      {/* <View style={styles.inputContainer}>
        <TextInput
          placeholder="Barre de recherche"
          onChangeText={(value) => setSearch(value)}
          value={search}
          style={styles.input}
        />
      </View> */}
      <ScrollView contentContainerStyle={styles.imageContainer}>
        {images}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photo: {
    margin: 10,
    marginBottom: 20,
    width: 110,
    height: 110
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fcfaf1'
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    padding: 20,
    marginTop: 40
  },
  retour: {
    fontWeight: 'bold', 
    color: '#D95B33',
    fontSize: 20,
    paddingTop: 15
  },
  H1: {
    textAlign: 'center',
    fontFamily: 'Outfit',
    fontSize: 50,
  },
  inputContainer: {
    width: '80%',
    backgroundColor: '#fcfaf1',
    borderRadius: 10,
    marginTop: 30,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    marginTop: 20,
    marginLeft: 40,
    width: "100%",
    fontFamily: 'Outfit',
    borderRadius: 5,
    backgroundColor: '#ffffff'
  },
  imageContainer: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});