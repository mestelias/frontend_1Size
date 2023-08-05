import * as React from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react"


import Carousel, { Pagination } from 'react-native-snap-carousel';

export default function CalibrateHomeScreen({ navigation }) {

  const carouselRef = useRef(null);
  const initialLayout = Dimensions.get("window").width ;
  // paramètre clée qui défini sur quel image on s'est arrêté
  const [activeSlide, setActiveSlide] = useState(0);
  // tableau qui sert à envoyer la bonne props au CalibrateScreen par rapport à activeSlide
  const categorie = ["Chaussures","Bas","Haut"]

  const handleContinueButton = () => {
    navigation.navigate('CalibrateScreen', { categorie: categorie[activeSlide] })
  }
  
  console.log(activeSlide)
  const images = [
    require("../assets/vetements/basket.png"),
    require("../assets/vetements/pantalon.jpeg"),
    require("../assets/vetements/teeshirt.jpeg"),
  ];

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name={"bars"} size={40} color={"#25958A"} />
        </TouchableOpacity>
      </SafeAreaView>
      <Text style={styles.H1}>Calibrage</Text>
      <View style={styles.container}>
        <Text style={styles.h3}>Choisis ton type de vêtement à calibrer</Text>
        <View style={styles.carou}>
          {/* la fonction snapToPrev du carousel est appelée, ce qui fait défiler le carousel vers l'image précédente */}
          <TouchableOpacity onPress={() => carouselRef.current.snapToPrev()}>
          {/* Flèche gauche */}
            <FontAwesome name={"chevron-left"} size={40} color={"#d95b33"} marginLeft={25} />
          </TouchableOpacity>
          <Carousel
            ref={carouselRef}
            data={images}
            renderItem={({ item }) => (
              <Image source={item} style={styles.image} />
            )}
            sliderWidth={initialLayout}
            itemWidth={initialLayout}
            containerCustomStyle={styles.carouselContainer}
            contentContainerStyle={{ height: 200 }}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          {/* la fonction snapToNext du carousel est appelée, ce qui fait défiler le carousel vers l'image suivante */}
          <TouchableOpacity onPress={() => carouselRef.current.snapToNext()}>
            {/* Flèche droite */}
            <FontAwesome name={"chevron-right"} size={40} color={"#d95b33"} marginRight={20} />
          </TouchableOpacity>
        </View>
        <Pagination
          dotsLength={images.length} // spécifie le nombre total d'indicateurs à afficher
          activeDotIndex={activeSlide} // définit l'index de l'indicateur actif
          dotStyle={styles.paginationDot} // spécifie le style des indicateurs individuels
          inactiveDotOpacity={0.4} // définit l'opacité des indicateurs inactifs 
          inactiveDotScale={0.6} // définit l'échelle des indicateurs inactifs par rapport à l'indicateur actif
        />
      </View>
      <View style={styles.btn}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleContinueButton}
        >
          <Text style={styles.textButton}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fcfaf1",
  },
  header: {
    alignItems: "flex-start",
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  // container: {
  //   flex: 0.2,
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   backgroundColor: 'red'
  // },
  container: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleBox: {},
  H1: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    //marginBottom: 20,
    fontFamily: "Outfit",
    color: 'black'
  },
  tabView: {
    marginTop: 20,
    width: "80%",
    borderRadius: 10,
    maxHeight: 100

  },
  firstRoute: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#d95b33",
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
    marginBottom: 20
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Outfit",
  },
  basket : {
    width: 140,
    height: 190,
  },
  image: {
    marginLeft: '8%',
    marginRight: '8%',
    width: "60%",
    height: 200,
  },
  carou: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  carouselContainer: {
    marginBottom: 5, // Espacement entre le carousel et les indicateurs
  },
  paginationDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginHorizontal: 8,
    backgroundColor: '#d95b33',
  },
  btn:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: '15%',
  }
});