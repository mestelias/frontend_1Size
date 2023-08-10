import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { recommendSize } from "../modules/recommendSize";
import LottieView from "lottie-react-native";
import { Animated, Easing } from "react-native";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const url = process.env.EXPO_PUBLIC_IP;

export default function RecommendationScreen({ navigation, route }) {
  const { categorie, marque, type, coupe } = route.params;
  // L'état qui va stocker la taille idéale recommandée par l'algo
  const [recoTaille, setRecoTaille] = useState(null);

  const [showAnimation, setShowAnimation] = useState(true);
  const animationDuration = 5000; // Adaptez cette valeur à la durée réelle de votre animation (en ms).
  const animationProgress = useRef(new Animated.Value(0));

  console.log("show animation", showAnimation);

  // Récupération du token stocké dans le reducer
  const userToken = useSelector((state) => state.user.value.token);
  const userSexe = useSelector((state) => state.user.value.genre).toLowerCase();

  // A AFFICHER QUAND PAGE MARQUE OK Récupération des props de l'écran type/coupe
  // const { categorie, marque, type, coupe } = route.params;

  // let desiredFit = coupe;

  console.log("sexe", userSexe);
  console.log("token", userToken);
  console.log("recoTailleNull", recoTaille);

  // A SUPPRIMER valeurs test
  // const categorie = "haut";
  // const marque = "Lacoste";
  // const type = "Polo";
  // const coupe = "normale";

  //TO DO : use effect d'initialistation qui va permettre à l'algo de calculer la reco de taille idéale
  useEffect(() => {
    const fetchData = async () => {
      // Démarrage de l'animation
      await new Promise((resolve) => setTimeout(resolve, animationDuration));

      // Cacher l'animation
      setShowAnimation(false);

      // Récupération des mensurations de l'utilisateur
      const responseForUserMensurations = await fetch(
        `${url}/users/mensurations/?token=${userToken}&categorie=${categorie}`
      );
      const userMensurations = await responseForUserMensurations.json();
      console.log("Mensurations: ", userMensurations);

      // Récupération de toutes les tailles et leurs mensurations du type de vêtement selon la catégorie, la marque, le sexe et le type
      const responseForSizes = await fetch(
        `${url}/marques/tailleswithmensurations/?token=${userToken}&categorie=${categorie}&marque=${marque}&sexe=${userSexe}&type=${type}`
      );
      const sizes = await responseForSizes.json();
      console.log("Tailles: ", sizes);

      // Appel de la fonction qui calcule la taille idéale
      const bestFit = recommendSize(userMensurations, sizes, coupe);
      console.log("Taille recommandée: ", bestFit[0]);

      // Sauvegarde de la valeur retournée dans un état
      setRecoTaille(bestFit[0]);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    // Récupération de toutes les tailles et leurs mensurations du type de vêtement selon la catégorie, la marque, le sexe et le type
    const responseForRecoSizes = await fetch(
      `${url}/marques/tailleswithmensurations/?token=${userToken}&categorie=${categorie}&marque=${marque}&sexe=${userSexe}&type=${type}&${recoTaille}`
    );
    const recoSizes = await responseForRecoSizes.json();
    //On ajoute le vêtement en BDD dans les vêtements en attente
    fetch(`${url}/users/vetementsenattente/${categorie}/${userToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marque: marque,
        type: type,
        coupe: coupe,
        taille: recoTaille,
        mensurations: recoSizes,
      }),
    })
      .then((response) => response.json())
      .then((vetement) => {
        console.log("vêtement: ", vetement);
        // Navigation vers la page de ses vêtements
        navigation.navigate("Clothes");
      });
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        {/* <View style={styles.burgerIcon}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View> */}
        <Text style={styles.retour}>Retour</Text>
      </SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.H1}>One Size</Text>
        <View style={styles.border}></View>
        <View style={styles.searchedData}>
          <Text style={styles.H3}>{type}</Text>
          <Text style={styles.H3}>{marque}</Text>
          <Text style={styles.H3}>{coupe}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.H3}>Notre recommandation :</Text>
        <View style={styles.circleContainer}>
          {/* {showAnimation && (
            <AnimatedLottieView
              source={require("../assets/animations/shoes-colorOneSize.json")}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          )}  */}

          {recoTaille && (
            <View style={styles.circle}>
              <Text style={styles.circleText}>{recoTaille}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Voir mes vêtements</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Image
            source={require("../assets/pic-c.jpg")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 20,
            }}
          />
          <Text style={styles.text}>
            Samy, le CEO de OneSize a approuvé cette recommandation.
          </Text>
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
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fcfaf1",
    // marginTop: 3,
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
  // header: {
  //   justifyContent: "flex-start",
  //   width: "100%",
  // },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    padding: 20,
    // marginTop: 40
  },
  retour: {
    fontWeight: "bold",
    color: "#D95B33",
    fontSize: 20,
    paddingTop: 10,
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
    justifyContent: "center",
    width: "100%",
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
  lottie: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 300,
    // height: 100,
  },
  footer: {
    flexDirection: "row",
    padding:10,
    margin: 10,
  },
});
