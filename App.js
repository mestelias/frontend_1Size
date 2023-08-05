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
import CalibrateHomeScreen from "./screens/CalibrateHomeScreen";

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
        } else if (route.name === "Profile") {
          iconName = focused ? "user" : "user"; // Nom de l'icône FontAwesome pour "Profile"
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
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="SignUp" component={SignUpScreen} />
    <Drawer.Screen name="SignIn" component={SignInScreen} />
    <Drawer.Screen name="Calibrate" component={CalibrateScreen} />
    <Drawer.Screen name="CalibrateHome" component={CalibrateHomeScreen}/>
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
