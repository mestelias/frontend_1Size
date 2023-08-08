import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { recommendSize } from "../modules/recommendSize";

const url = process.env.EXPO_PUBLIC_IP;

export default function RecommendationScreen({ navigation, route }) {
  // L'état qui va stocker la taille idéale recommandée par l'algo
  const [recoTaille, setRecoTaille] = useState(null);
  

  // Récupération du token stocké dans le reducer
  const userToken = useSelector((state) => state.user.value.token);
  const userSexe = useSelector((state) => state.user.value.genre).toLowerCase();


  // // Récupération des props de l'écran type/coupe
  // const { categorie, marque, type, coupe } = route.params;

  // let desiredFit = coupe;

    console.log('sexe', userSexe)
    console.log('token', userToken)
    console.log('recoTailleNull', recoTaille)

    // A SUPPRIMER valeurs test
    const categorie = 'haut'
    const marque = 'Lacoste'
    const type = 'Polo'
    const coupe = 'normale'

  //TO DO : use effect d'initialistation qui va permettre à l'algo de calculer la reco de taille idéale
  useEffect(() => {
    //On récupère les mensurations de l'utilisateur
    fetch(
      `${url}/users/mensurations/?token=${userToken}&categorie=${categorie}`
    )
      .then((response) => response.json())
      .then((userMensurations) => {
        console.log(userMensurations);

        //On récupère toutes les tailles et leurs mensurations du type de vêtement selon la marque, le sexe et le type
        fetch(
          `${url}/marques/tailleswithmensurations/?token=${userToken}&categorie=${categorie}&marque=${marque}&sexe=${userSexe}&type=${type}`
        )
          .then((response) => response.json())
          .then((sizes) => {
            console.log('size',sizes);
            // On appelle la fonction qui calcule la taille idéale
            recommendSize(userMensurations, sizes, coupe);
            console.log('fonction')
            const bestFit = recommendSize(userMensurations, sizes, coupe)
            // On met à jour la valeur retournée dans un état
            setRecoTaille(bestFit[0]);

          });
      });
  }, []);

  const handleSubmit = () => {
    //On ajoute le vêtement en BDD dans les vêtements en attente
    fetch(`${url}/users/vetementsenattente/${categorie}/${userToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marque: marque,
        type: type,
        coupe: coupe,
        taille: recoTaille,
        mensurations: mensurations,
      }),
    })
      .then((response) => response.json())
      .then((vetement) => {
        console.log(vetement);
        navigation.navigate("ClothesScreen");
      });
  };

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
        <Text style={styles.H1}>{categorie}</Text>
        <View style={styles.border}></View>
        <View style={styles.searchedData}>
          <Text style={styles.H3}>{type}</Text>
          <Text style={styles.H3}>{marque}</Text>
          <Text style={styles.H3}>{coupe}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.H3}>Notre reco OneSize</Text>
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>{recoTaille}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Je veux prendre cette taille</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Samy, le CEO de OneSize a approuvé cette taille recommandée.{" "}
        </Text>
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
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fcfaf1",
    marginTop: 30,
  },
  border: {
    paddingHorizontal: 35,
    borderBottomWidth: 3,
    borderBottomColor: "#d95b33",
    borderRadius: 50,
    marginBottom: 20,
  },
  burgerIcon: {
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
  H3: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#25958A",
  },
  circleText: {
    fontFamily: "Outfit",
    fontSize: 20,
    color: "#FFFFFF",
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
  textButton: {
    fontFamily: "Outfit",
    color: "white",
    // padding: "5%",
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: "Outfit",
    textAlign: "center",
  },
  searchedData: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
});
