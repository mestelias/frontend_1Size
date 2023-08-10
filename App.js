import "react-native-gesture-handler";

//Sound
import React from "react";
// import { Audio } from "expo-av";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";

//fonts
import { useFonts } from "expo-font";

//Screens
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import LoadingScreen from "./screens/LoadingScreen";
import CalibrateHomeScreen from "./screens/CalibrateHomeScreen";
import CalibrateScreen from "./screens/CalibrateScreen"
import FriendsScreen from "./screens/FriendsScreen";
import ContactsScreen from "./screens/ContactsScreen";
import HelpScreen from "./screens/HelpScreen";
import ClothesScreen from "./screens/ClothesScreen";
import RecommendationScreen from "./screens/RecommendationScreen";
import MarqueScreen from "./screens/MarqueScreen";
import MarqueTypeScreen from "./screens/MarqueTypeScreen";
import TutorialScreen from "./screens/TutorialScreen";

//Store
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import user from './reducers/user';

//Persistance du Store
import { persistStore, persistReducer } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Icons
import FontAwesome from "react-native-vector-icons/FontAwesome";

//React
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { emptyStore } from './reducers/user'

const reducers=combineReducers({user});

const persistConfig = {
  key: "1size",
  storage: AsyncStorage
};

const store = configureStore({
  reducer : persistReducer(persistConfig, reducers),
  middleware : (getDefaultMiddleware) =>
  getDefaultMiddleware({serializableCheck : false}),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//création d'un obj de correspondance nom de route/icon
const routeIconMapping = {
  "Home": "home",
  "Profil": "user",
  "Calibrage": "bullseye",
  "Mes amis": "users",
  "Nous contacter": "envelope",
  "Aide": "question",
  "Mes vêtements" : "shopping-bag"
};

const CustomDrawer = (props) => {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const {image, username} = user

  const handleSignOut = () => {
    dispatch(emptyStore())
    props.navigation.navigate('SignIn')
  }
  //On filtre la route "main" du drawer, simplement à l'affichage, pour qu'elle reste en premier pour accéder à la stack
  //navigation, mais sans apparaître dans le drawer

  
  
  return (
    <DrawerContentScrollView {...props}>
      {/* <View style={styles.drawerHeader}> */}
        <View style={styles.profilView}>
          <Image source={image ? { uri: image } : require('./assets/Profildefault.jpg')} style={styles.profilpic} />
          <Text paddingTop={10}>@{username ? username : `username`}</Text>
          <View style={styles.line}></View>
        </View>
      {/* </View> */}
      {props.state.routes.map((route, index) => {
        //map pour créer tous les drawerItems avec les styles associés et icones associés
         if (route.name === 'Main') return null; 

         const isFocused = props.state.index === index;
         const color = isFocused ? "#25958A" : "#d95b33";
         const iconName = routeIconMapping[route.name];
        
         return (
             <DrawerItem 
                 key={route.key} 
                 label={route.name}
                 labelStyle={{color: isFocused ? "#25958A" :  "black", fontFamily: 'Outfit'} }
                 // ici, nous utilisons le style pour la couleur du label
                 focused={isFocused}
                 onPress={() => props.navigation.navigate(route.name)}
                 icon={({ size }) => <View style={styles.icon}>
                  <FontAwesome name={iconName} size={size} color={color} />
                 </View> }
                  
             />
         );
      })}
      <TouchableOpacity onPress={() => handleSignOut()} style={styles.signOutView}>
        <FontAwesome name='sign-out' color={"#d95b33"} size={30}/>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tutorial"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Clothes" component={ClothesScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="CalibrateScreen" component={CalibrateScreen} />
      <Stack.Screen name="MarqueScreen" component={MarqueScreen} />
      <Stack.Screen name="MarqueTypeScreen" component={MarqueTypeScreen} />
      <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} />
      <Stack.Screen name="Tutorial" component={TutorialScreen} />
      

    </Stack.Navigator>
  );
};

const AppDrawerNavigation = () => (
  <Drawer.Navigator
  drawerContent = {(props) => <CustomDrawer {...props} />}
  screenOptions={({ route }) => ({
      headerShown: false,
      drawerType: "front",
    })}
    drawerStyle={{
      backgroundColor: "#FCFAF1",
      width: "80%",
    }}
  >
    <Drawer.Screen name="Main" component={StackNavigator} />
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profil" component={ProfileScreen} />
    <Drawer.Screen name="Calibrage" component={CalibrateHomeScreen} />
    <Drawer.Screen name="Mes vêtements" component={ClothesScreen} />
    <Drawer.Screen name="Mes amis" component={FriendsScreen} />
    <Drawer.Screen name="Nous contacter" component={ContactsScreen} />
    <Drawer.Screen name="Aide" component={HelpScreen} />
  </Drawer.Navigator>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit: require("./assets/fonts/Outfit-Regular.ttf"),
  });

 /*const playSplashAudio = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require("./assets/OneLove.mp3"));
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing splash audio: ", error);
    }
  };

 useEffect(() => {
    if (fontsLoaded) {
      playSplashAudio(); // Play the splash audio when fonts are loaded
    }
  }, [fontsLoaded]);*/

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <AppDrawerNavigation/>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  profilView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  icon:{
    minWidth: 25
  },
  profilpic: {
    width:90, 
    height:90,
    borderRadius:50,
    borderColor: '#25958a',
    borderWidth: 2
  },
  signOutView: {
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    color: '#d95b33',
    paddingTop: 15,
  },
  signOutText: {
    color: 'black',
    fontSize: 15,
    paddingHorizontal: 28,
    fontFamily: 'Outfit',
  },
  line: {
    paddingHorizontal: 40, 
    borderBottomWidth: 3,
    borderBottomColor: '#25958a', 
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20
  }
});
