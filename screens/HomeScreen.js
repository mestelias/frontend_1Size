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
  const username = useSelector((state) => state.user.value.username);

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

  console.log("token", userToken);
  console.log("item", selectedItem);
  // Fonction qui permet d'accéder à la recherche d'un vêtement selon le type
  const handleSubmit = () => {
    // Vérification de la présence de mensurations en BDD selon le type choisi
    fetch(
      `${url}/users/mensurations?categorie=${selectedItem}&token=${userToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        // Si l'utilisateur n'a pas de mensurations pour le type, la modal lui permet d'accéder au calibrage.
        // Si l'utilisateur a bien des mensurations, il est redirigé vers MarqueScreen
        Object.keys(data).length == 0
          ? setModalVisible(true)
          : navigation.navigate("MarqueScreen", { categorie: selectedItem });
        // Object.keys(data).length != 0 ? setModalVisible(true) : navigation.navigate("CalibrateScreen", { categorie: selectedItem });
      });
  };

  // l'utilisateur souhaite accéder au calibrage
  const goCalibrate = () => {
    setModalVisible(false);
    navigation.navigate("CalibrateScreen", { categorie: selectedItem });
  };

  return (
    <View style={styles.background}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <Image
                    source={dataType[activeIndex].image}
                    style={styles.image}
                  />
                  <View style={styles.textModal}>
                    <Text style={styles.h3}>
                      Vous n'avez pas encore effectué votre calibrage pour le
                      type {selectedItem}.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={() => goCalibrate()}
                  >
                    <Text style={styles.textButton}>Calibrer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    activeOpacity={0.8}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textButton2}>Annuler</Text>
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
          <Text style={styles.H1}>Bienvenue {username} </Text>
          <View style={styles.border}></View>
          <View style={styles.paragraphe}>
            <Text style={styles.h3}>
              Tu recherches un vêtement mais tu ne connais pas ta taille ?
            </Text>
          </View>
          <View style={styles.paragraphe}>
            <Text style={styles.text}>
              Choisis ton type vêtement pour trouver ta taille idéale :
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
              itemWidth={width}
              onSnapToItem={(index) => setActiveIndex(index)}
              loop={true} // Activer le défilement en boucle
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
              onPress={() => handleSubmit()}
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
    width: "90%",
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
    height: 150,
    // borderRadius: 50,
    marginBottom: 15,
    resizeMode: "contains",
  },
  textModal: {
    width: "90%",
    marginBottom: 15,
  },
});

// import * as React from "react";
// import { useState, useRef, useEffect} from "react";

// import {
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Text,
//   Dimensions,
//   Image,
// } from "react-native";

// //font
// import { useFonts } from "expo-font";
// import { useNavigation } from "@react-navigation/native";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import {useSelector} from 'react-redux'

// import Carousel, { Pagination } from 'react-native-snap-carousel';

// const FirstRoute = () => (
//   <View style={styles.firstRoute}>
//     {/* <View>
//       <Text style={styles.h3}>Choisis ton type de vêtement</Text>
//     </View>
//     <View>
//       <TouchableOpacity
//         style={styles.button}
//         activeOpacity={0.8}
//         //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
//         // onPress={()=> }
//       >
//         <Text style={styles.textButton}>Continuer</Text>
//       </TouchableOpacity>
//     </View> */}
//   </View>
// );

// const SecondRoute = () => (
//   <View style={{ flex: 1, backgroundColor: "#FCFAF1" }} />
// );

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
// });

// // const fetchFonts = () => {
// //   return Font.loadAsync({
// //     'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
// //   });
// // };

// const url = process.env.EXPO_PUBLIC_IP

// export default function HomeScreen({ navigation, categorie }) {

//   const userToken = useSelector((state) => state.user.value);
//   //console.log(userToken)

//   const carouselRef = useRef(null);
//   const initialLayout = Dimensions.get("window").width ;
//   const [activeSlide, setActiveSlide] = useState(0);

//   // const [index, setIndex] = useState(0);
//   // const [routes] = useState([
//   //   { key: "first", title: "Pour moi" },
//   //   { key: "second", title: "Pour un ami" },
//   // ]);
//   const dataType = [
//     { image: require("../assets/t-shirt.png"), text: "Haut" },
//     { image: require("../assets/pantalon.png"), text: "Bas" },
//     { image: require("../assets/shoes.png"), text: "Chaussures" },
//   ];

//   // const categorieLC = categorie
//   // const sexe = useSelector((state)=>state.user.value.genre)
//   // const sexeLC = sexe && sexe.toLowerCase()
//   // const [categorieDispo, setCategorieDispo] = useState([]); // récupéré au moment de la sélection de la marque

//   // useEffect(()=>{

//   //   fetch(`${url}/marques/names?sexe=${sexeLC}&categorie=${dataType[activeSlide].name}`)
//   //   .then((response)=> response.json())
//   //   .then((marques) => console.log(marques))

//   // }, [activeSlide])

//   const selectedItem = dataType[activeSlide].text.toLowerCase();

//   return (
//     <View style={styles.background}>
//       <SafeAreaView style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <FontAwesome name={"bars"} size={40} color={"#25958A"} />
//         </TouchableOpacity>
//       </SafeAreaView>
//       <Text style={styles.H1}>Recherche ton vêtement</Text>
//       <View style={styles.container}>
//         {/* <TabView
//           navigationState={{ index, routes }}
//           renderTabBar={(props) => (
//             <TabBar
//               {...props}
//               renderLabel={({ route, color }) => (
//                 <Text style={{ color: "#FFFF", margin: 8 }}>{route.title}</Text>
//               )}
//               style={{ backgroundColor: "#d95b33", fontFamily: "Outfit" }}
//             />
//           )}
//           renderScene={renderScene}
//           onIndexChange={setIndex}
//           initialLayout={initialLayout}
//           style={styles.tabView}
//         /> */}
//         {/* <Text style={styles.h3}>Choisis ton type de vêtement</Text> */}
//         <Text style={styles.h3}>Sélectionnes une catégorie de vêtement</Text>
//         <View style={styles.carou}>
//           {/* la fonction snapToPrev du carousel est appelée, ce qui fait défiler le carousel vers l'image précédente */}
//           <TouchableOpacity onPress={() => carouselRef.current.snapToPrev()}>
//           {/* Flèche gauche */}
//             <FontAwesome name={"chevron-left"} size={40} color={"#d95b33"} marginLeft={25} />
//           </TouchableOpacity>
//           <Carousel
//             ref={carouselRef}
//             data={dataType}
//             renderItem={({ item }) => (
//               <Image source={item.image} style={styles.image}/>
//             )}
//             sliderWidth={initialLayout}
//             itemWidth={initialLayout}
//             containerCustomStyle={styles.carouselContainer}
//             contentContainerStyle={{ height: 200 }}
//             onSnapToItem={(index) => setActiveSlide(index)}
//           />
//           {/* la fonction snapToNext du carousel est appelée, ce qui fait défiler le carousel vers l'image suivante */}
//           <TouchableOpacity onPress={() => carouselRef.current.snapToNext()}>
//             {/* Flèche droite */}
//             <FontAwesome name={"chevron-right"} size={40} color={"#d95b33"} marginRight={20} />
//           </TouchableOpacity>
//         </View>
//         <Pagination
//           dotsLength={dataType.length} // spécifie le nombre total d'indicateurs à afficher
//           activeDotIndex={activeSlide} // définit l'index de l'indicateur actif
//           dotStyle={styles.paginationDot} // spécifie le style des indicateurs individuels
//           inactiveDotOpacity={0.4} // définit l'opacité des indicateurs inactifs
//           inactiveDotScale={0.6} // définit l'échelle des indicateurs inactifs par rapport à l'indicateur actif
//         />
//       </View>
//       <View style={styles.btn}>
//         <TouchableOpacity
//           style={styles.button}
//           activeOpacity={0.8}
//           //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
//           onPress={() => navigation.navigate('MarqueScreen', { categorie: selectedItem })}
//         >
//           <Text style={styles.textButton}>Continuer</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     backgroundColor: "#fcfaf1",
//   },
//   header: {
//     alignItems: "flex-start",
//     paddingTop: 30,
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   // container: {
//   //   flex: 0.2,
//   //   alignItems: "center",
//   //   justifyContent: "space-between",
//   //   backgroundColor: 'red'
//   // },
//   container: {
//     height: "50%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   titleBox: {},
//   H1: {
//     textAlign: "center",
//     fontSize: 24,
//     fontWeight: "600",
//     //marginBottom: 20,
//     fontFamily: "Outfit",
//     color: 'black'
//   },
//   tabView: {
//     marginTop: 20,
//     width: "80%",
//     borderRadius: 10,
//     maxHeight: 100

//   },
//   firstRoute: {
//     flex: 1,
//     backgroundColor: "#FCFAF1",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
//   button: {
//     width: "80%",
//     alignItems: "center",
//     marginTop: 20,
//     paddingTop: 8,
//     backgroundColor: "#d95b33",
//     borderRadius: 30,
//     shadowOpacity: 1,
//     elevation: 4,
//     shadowRadius: 4,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowColor: "rgba(0, 0, 0, 0.25)",
//   },
//   h3: {
//     color: "#707B81",
//     fontSize: 20,
//     fontFamily: "Outfit",
//     marginBottom: 20
//   },
//   textButton: {
//     color: "#ffffff",
//     height: 35,
//     fontWeight: "600",
//     fontSize: 20,
//     fontFamily: "Outfit",
//   },
//   basket : {
//     width: 140,
//     height: 190,
//   },
//   image: {
//     marginLeft: '8%',
//     marginRight: '8%',
//     width: "60%",
//     height: "60%",
//     resizeMode: "contain",

//   },
//   carou: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 30
//   },
//   carouselContainer: {
//     marginBottom: 5, // Espacement entre le carousel et les indicateurs
//   },
//   paginationDot: {
//     width: 15,
//     height: 15,
//     borderRadius: 10,
//     marginHorizontal: 8,
//     backgroundColor: '#d95b33',
//   },
//   btn:{
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginTop: '15%',
//   }
// });
