import * as React from "react";
import { useState, useRef } from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";

//font
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";


import Carousel, { Pagination } from 'react-native-snap-carousel';



const FirstRoute = () => (
  <View style={styles.firstRoute}>
    {/* <View>
      <Text style={styles.h3}>Choisis ton type de vêtement</Text>
    </View>
    <View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
        // onPress={()=> }
      >
        <Text style={styles.textButton}>Continuer</Text>
      </TouchableOpacity>
    </View> */}
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#FCFAF1" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

// const fetchFonts = () => {
//   return Font.loadAsync({
//     'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
//   });
// };

export default function HomeScreen({ navigation }) {
  const carouselRef = React.useRef(null);
  const initialLayout = Dimensions.get("window").width ;
  const [activeSlide, setActiveSlide] = React.useState(0);
  
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Pour moi" },
    { key: "second", title: "Pour un ami" },
  ]);

  const images = [
    require("../assets/vetements/basket.png"),
    require("../assets/vetements/pantalon.jpeg"),
    require("../assets/vetements/teeshirt.jpeg"),
    require("../assets/vetements/cr7.jpeg")
  ];

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name={"bars"} size={40} color={"#25958A"} />
        </TouchableOpacity>
      </SafeAreaView>
      <Text style={styles.H1}>Recherche ton vêtement</Text>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }} 
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ route, color }) => (
                <Text style={{ color: "#FFFF", margin: 8 }}>{route.title}</Text>
              )}
              style={{ backgroundColor: "#d95b33", fontFamily: "Outfit" }}
            />
          )}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={styles.tabView}
        />
        <Text style={styles.h3}>Choisis ton type de vêtement</Text>
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
          //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
          // onPress={()=> }
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
