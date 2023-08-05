import * as React from "react";
import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const carouselItemHeight = 300; // Vous pouvez ajuster cette valeur selon vos besoins

export default function CalibrateHomeScreen({ navigation }) {
  const width = Dimensions.get("window").width;

  const dataType = [
    require("../assets/pantalon.png"),
    require("../assets/t-shirt.png"),
    require("../assets/shoes.png"),
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselRef = useRef(null);

  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          height: carouselItemHeight,
        }}
      >
        <Image
          source={item}
          style={{
            width: "60%",
            height: "60%",
            resizeMode: "contain",
          }}
        />
      </View>
    );
  };
  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.H1}>Calibrage</Text>
          <View style={styles.border}></View>
          <View style={styles.paragraphe}>
            <Text style={styles.h3}>Pour commencer l'aventure</Text>
            <Text style={styles.one}> 1</Text>
            <Text style={styles.size}>Size</Text>
          </View>
          <View style={styles.paragraphe}>
            <Text style={styles.text}>
              Vous devez calibrer au minimum un vêtement parmi la liste suivante
              :
            </Text>
          </View>
        </View>
        <View style={styles.carouselContainer}>
          <TouchableOpacity onPress={() => carouselRef.current.snapToPrev()}>
            <FontAwesome
              name={"chevron-left"}
              size={40}
              color={"#d95b33"}
              marginLeft={20}
              marginRight={10}
            />
          </TouchableOpacity>

          <Carousel
            ref={carouselRef}
            data={dataType}
            renderItem={_renderItem}
            sliderWidth={width}
            itemWidth={width} // Adjust according to your needs
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <TouchableOpacity onPress={() => carouselRef.current.snapToNext()}>
            <FontAwesome
              name={"chevron-right"}
              size={40}
              color={"#d95b33"}
              marginRight={20}
              marginLeft={10}
            />
          </TouchableOpacity>
          </View>



          <Pagination
            dotsLength={dataType.length}
            activeDotIndex={activeIndex}
            containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
            dotStyle={styles.paginationDot} // spécifie le style des indicateurs individuels
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <View style={styles.btn}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
              // onPress={()=> }
            >
              <Text style={styles.textButton}>Continuer</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FCFAF1",
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  H1: {
    fontSize: 24,
    fontFamily: "Outfit",
    fontWeight: "800",
    marginBottom: 20,
  },
  burgerIcon: {
    flexDirection: "row",
    paddingLeft: 30,
    paddingTop: 15,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "#fcfaf1",
    marginTop: 30,
  },
  border: {
    // paddingVertical: 10, // Ajoute un padding vertical de 10 pixels autour du texte
    paddingHorizontal: 35, // Ajoute un padding horizontal de 20 pixels autour du texte
    borderBottomWidth: 3, // Ajoute une bordure sous le texte
    borderBottomColor: "#d95b33", // Couleur de la bordure sous le texte
    borderRadius: 50,
  },
  paragraphe: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  one: {
    fontSize: 20,
    fontFamily: "Outfit",
    textAlign: "center",
    color: "#d95b33",
  },
  size: {
    color: "#707B81",
    textAlign: "center",
    fontFamily: "Outfit",
    fontSize: 20,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    fontFamily: "Outfit",
    textAlign: "center",
  },
  carouselContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: carouselItemHeight, // Ajoutez cette ligne
  },
  carouselImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginHorizontal: 8,
    backgroundColor: "#d95b33",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 10,
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
  btn:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: '15%',
  }
});
