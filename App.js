import "react-native-gesture-handler";

//Sound
import React, { useEffect } from "react";
// import { Audio } from "expo-av";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

//fonts
import { useFonts } from "expo-font";

//Screens
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import CalibrateScreen from "./screens/CalibrateScreen"

//Store
import { Provider } from 'react-redux';
import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import user from './reducers/user';

//Persistance du Store
import {persistStore, persistReducer} from "redux-persist"
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Icons
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ContactScreen from "./screens/ContactScreen";


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


const AppDrawerNavigation = () => (
  <Drawer.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      drawerActiveTintColor: "#25958A",
      drawerInactiveTintColor: "#d95b33",
      drawerType: "front",
      drawerIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = focused ? "home" : "home"; // Nom de l'icône FontAwesome pour "Home"
        } else if (route.name === "Profil") {
          iconName = focused ? "user" : "user"; // Nom de l'icône FontAwesome pour "Profile"
        } else if (route.name === "Inscription") {
          iconName = focused ? "user-plus" : "user-plus"; // Nom de l'icône FontAwesome pour "SignUp"
        } else if (route.name === "Connexion") {
          iconName = focused ? "sign-in" : "sign-in"; // Nom de l'icône FontAwesome pour "SignIn"
        } else if (route.name === "Calibrage") {
          iconName = focused ? "bullseye" : "bullseye"; // Nom de l'icône FontAwesome pour "Calibrate"
        } else if (route.name === "Mes vêtements") {
          iconName = focused ? "suitcase" : "suitcase"; // Nom de l'icône FontAwesome pour "Mes vêtements" 
        } else if (route.name === "Mes amis") {
          iconName = focused ? "users" : "users"; // Nom de l'icône FontAwesome pour "Mes amis" 
        } else if (route.name === "Nous contacter") {
          iconName = focused ? "envelope" : "envelope"; // Nom de l'icône FontAwesome pour "Nous contacter"
        } else if (route.name === "Aide") {
          iconName = focused ? "question" : "question"; // Nom de l'icône FontAwesome pour "Aide"
        } else if (route.name === "Deconnexion") {
          iconName = focused ? "signout" : "sign-out"; // Nom de l'icône FontAwesome pour "Deconnexion"
        }
        
        // Définis la couleur en fonction de la variable 'iconColor'
        iconColor = focused ? "#D95B33" : "#000"; 

        // Retourne l'icône FontAwesome avec le nom calculé
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
    drawerStyle={{
      backgroundColor: "#FCFAF1",
      width: "80%",
    }}
  >
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profil" component={ProfileScreen} />
    <Drawer.Screen name="Inscription" component={SignUpScreen} />
    <Drawer.Screen name="Connexion" component={SignInScreen} />
    <Drawer.Screen name="Calibrage" component={CalibrateScreen} />
    <Drawer.Screen name="Mes vêtements" component={CalibrateScreen} />
    <Drawer.Screen name="Mes amis" component={CalibrateScreen} />
    <Drawer.Screen name="Nous contacter" component={ContactScreen} />
    <Drawer.Screen name="Aide" component={CalibrateScreen} />
    <Drawer.Screen name="Deconnexion" component={CalibrateScreen} />
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
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
            name="AppDrawerNavigation"
            component={AppDrawerNavigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
