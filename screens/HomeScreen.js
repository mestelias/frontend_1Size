import * as React from "react";
import { useState } from "react";

//font
import { useFonts } from "expo-font";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";


import { AppLoading, Constants } from 'expo';
import * as Font from 'expo-font';
import Carousel, { Pagination } from 'react-native-snap-carousel';

// --------------------------------------------------- CAROUSEL QUI FONCTIONNE ISOLE --------------------------------------------------------------
//const initialLayout = Dimensions.get("window").width ;
// const { width } = Dimensions.get("window");

// const images = [
//   require("../assets/vetements/basket.png"),
//   require("../assets/vetements/pantalon.jpeg"),
//   require("../assets/vetements/teeshirt.jpeg"),
//   require("../assets/vetements/cr7.jpeg")
// ];

// export default function HomeScreen() {
//   const [activeSlide, setActiveSlide] = React.useState(0);
  
//   return (
//     <View style={styles.container}>
      // <View style={styles.carou}>
      //   <Carousel
      //     data={images}
      //     renderItem={({ item }) => (
      //     <Image source={item} style={styles.image} />
      //     )}
      //     sliderWidth={width}
      //     itemWidth={width}
      //     containerCustomStyle={styles.carouselContainer} // ajout du style au conteneur
      //     contentContainerStyle={{height : 200}} // ajout du style du conteneur du contenu du carousel
      //     onSnapToItem={(index) => setActiveSlide(index)} // se déclenche lorsque l'utilisateur fait glisser le carousel
      //   />
      // </View>
      // <Pagination
      //   dotsLength={images.length} // spécifie le nombre total d'indicateurs à afficher
      //   activeDotIndex={activeSlide} // définit l'index de l'indicateur actif
      //   dotStyle={styles.paginationDot} // spécifie le style des indicateurs individuels
      //   inactiveDotOpacity={0.4} // définit l'opacité des indicateurs inactifs 
      //   inactiveDotScale={0.6} // définit l'échelle des indicateurs inactifs par rapport à l'indicateur actif
      //   />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // image: {
  //   marginLeft: '20%',
  //   marginRight: '20%',
  //   width: "60%",
  //   height: 200,
  // },
  // carou: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  // carouselContainer: {
  //   marginBottom: 5, // Espacement entre le carousel et les indicateurs
  // },
  // paginationDot: {
  //   width: 15,
  //   height: 15,
  //   borderRadius: 10,
  //   marginHorizontal: 8,
  //   backgroundColor: '#d95b33',
  // },
// });

// ----------------------------------------------------------- FIN DU CAROUSEL QUI FONCTIONNE SEUL ------------------------------------------------





// ----------------------------------------------------------- LEUR CODE A EUX --------------------------------------------------------------------

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
          <Carousel
            data={images}
            renderItem={({ item }) => (
            <Image source={item} style={styles.image} />
            )}
            sliderWidth={initialLayout}
            itemWidth={initialLayout}
            containerCustomStyle={styles.carouselContainer} // ajout du style au conteneur
            contentContainerStyle={{height : 200}} // ajout du style du conteneur du contenu du carousel
            onSnapToItem={(index) => setActiveSlide(index)} // se déclenche lorsque l'utilisateur fait glisser le carousel
          />
        </View>
        <Pagination
          dotsLength={images.length} // spécifie le nombre total d'indicateurs à afficher
          activeDotIndex={activeSlide} // définit l'index de l'indicateur actif
          dotStyle={styles.paginationDot} // spécifie le style des indicateurs individuels
          inactiveDotOpacity={0.4} // définit l'opacité des indicateurs inactifs 
          inactiveDotScale={0.6} // définit l'échelle des indicateurs inactifs par rapport à l'indicateur actif
        />
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
    marginLeft: '20%',
    marginRight: '20%',
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
});


// ---------------------------------------------- MON CODE A MOI -------------------------------------------------------------------------------

// export default function HomeScreen({ navigation }) {
//   const initialLayout = { width: Dimensions.get("window").width };

//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     { key: "first", title: "Pour moi" },
//     { key: "second", title: "Pour un ami" },
//   ]);

//   const FirstRoute = () => (
//     <View style={styles.firstRoute}>
//       <View></View>
//       <View>
//         <TouchableOpacity
//           style={styles.button}
//           activeOpacity={0.8}
//           //AJOUTER LA FONCTIONNALITE POUR PASSER A L'ETAPE SUIVANTE
//           // onPress={()=> }
//         >
//         <Text style={styles.textButton}>Continuer</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
  
//   const SecondRoute = () => (
//     <View style={{ flex: 1, backgroundColor: "#FCFAF1" }} />
//   );

//   const renderScene = SceneMap({
//     first: FirstRoute,
//     second: SecondRoute,
//   });

//   return (
//     <View style={styles.background}>
//       <SafeAreaView style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <FontAwesome name={"bars"} size={40} color={"#25958A"} />
//         </TouchableOpacity>
//       </SafeAreaView>
//       <View style={styles.container}>
//         <Text style={styles.H1}>Recherche ton vêtement</Text>
//         <TabView
//           navigationState={{ index, routes }} 
//           renderTabBar={(props) => (
//             <TabBar
//               {...props}
//               renderLabel={({ route, color }) => (
//                 <Text style={{ color: "#FFFF", margin: 8 }}>{route.title}</Text>
//               )}
//               style={styles.selection}
//             />
//           )}
//           renderScene={renderScene}
//           onIndexChange={setIndex}
//           initialLayout={initialLayout}
//           style={styles.tabView}
//         />
//         <Text style={styles.h3}>Choisis ton type de vêtement</Text>
//         <Image
//           style={styles.basket}
//           source={require('../assets/basket.png')}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     backgroundColor: "#fcfaf1"
//   },
//   header: {
//     alignItems: "flex-start",
//     paddingTop: 30,
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   container: {
//     flex: 0.27,
//     alignItems: 'center',
//     justifyContent: 'center', 
//   },
//   H1: {
//     flex: 1,
//     fontSize: 24,
//     fontWeight: "600",
//     // fontFamily: 'Outfit'
//   },
//   selection: {
//     width: '90%',
//     backgroundColor: "#d95b33",
//     fontFamily: "Outfit",
//     borderRadius: 10,
//   },
//   tabView: {
//     flex: 1,
//     width: "100%",
//     alignItems: 'center',
//     marginBottom : 48
//   },
//   h3: {
//     color: "#707B81",
//     fontSize: 20,
//     fontFamily: "Outfit",
//   },
//   basket: {
//     alignSelf: 'center', // Centrer horizontalement
//     width: 30,
//     height: "60%",
//   }
// })
