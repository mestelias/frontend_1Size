import * as React from "react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const url = process.env.EXPO_PUBLIC_IP;

const carouselItemHeight = 240;

export default function CalibrateHomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const userToken = useSelector((state) => state.user.value.token);

  const width = Dimensions.get("window").width;

  const dataType = [
    { image: require("../assets/t-shirt.png"), text: "Haut" },
    { image: require("../assets/pantalon.png"), text: "Bas" },
    { image: require("../assets/shoes.png"), text: "Chaussures" },
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
          source={item.image}
          style={{
            width: "60%",
            height: "60%",
            resizeMode: "contain",
          }}
        />
        <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
          {item.text}
        </Text>
      </View>
    );
  };
  
  const selectedItem = dataType[activeIndex].text.toLowerCase();
  
  // Fonction qui permet d'accéder au calibrage d'un type (Haut, bas ou chaussures)
  const submitCalibrage = () => {
    fetch(`${url}/users/mensurations?categorie=${selectedItem}&token=${userToken}`)
      .then((response) => response.json())
      .then((data) => {
        Object.keys(data).length != 0 ? setModalVisible(true) : navigation.navigate("CalibrateScreen", { categorie: selectedItem });
      });
  };

// l'utilisateur souhaite modifier son calibrage malgré l'affichage de la modal indiquant que des mensurations existent
const forceCalibrate = () => {
  setModalVisible(false)
  navigation.navigate("CalibrateScreen", { categorie: selectedItem })
}

  return (
    <View style={styles.background}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <Image
                    source={dataType[activeIndex].image}
                    style={styles.image}
                  />
                  <Text style={styles.h3}>
                    Attention ! Vous avez déjà effectué votre calibrage. Souhaitez-vous quand même continuer?
                  </Text>
                  <TouchableOpacity 
                  style={styles.button} 
                  activeOpacity={0.8}
                  onPress={() => forceCalibrate()}
                  >
                    <Text style={styles.textButton}>
                      Modifier mon calibrage
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    activeOpacity={0.8}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textButton2}>
                      Annuler
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
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
        <View style={styles.containerInput}>
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
            dotStyle={styles.paginationDot} // spécifie le style des indicateurs individuels
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
              onPress={() => submitCalibrage()}
            >
              <Text style={styles.textButton}>Valider</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 50,
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
    width: 200,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    marginBottom: 15,
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
  btn: {
    alignItems: "center",
    // justifyContent: 'flex-end',
    // marginTop: '15%',
  },
  textButton: {
    color: "#ffffff",
    fontFamily: "Outfit",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  button2: {
    width: 200,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    marginBottom: 15,
    backgroundColor: "#d6d1bd",
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
  textButton2: {
    color: "#707b81",
    fontFamily: "Outfit",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  containerInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fcfaf1",
    borderRadius: 10,
    marginTop: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    width: 100,
    height: 110,
    borderRadius: 50,
    marginBottom: 15,
  },
});