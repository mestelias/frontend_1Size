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
import RecommendationScreen from "./screens/RecommendationScreen";

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
  "Aide": "question"
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
      <View style={styles.drawerHeader}>
        <View style={styles.profilView}>
          <Image source={image ? { uri: image } : require('./assets/Nelson.jpg')} style={styles.profilpic} />
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <FontAwesome name='times' size={30} color='#25958A' />
          </TouchableOpacity>
        </View>
        <Text>@{username ? username : `username`}</Text>
      </View>
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
                 labelStyle={{ color: color }} // ici, nous utilisons le style pour la couleur du label
                 focused={isFocused}
                 onPress={() => props.navigation.navigate(route.name)}
                 icon={({ size }) => <FontAwesome name={iconName} size={size} color={color} />}
             />
         );
      })}
      <TouchableOpacity onPress={() => handleSignOut()} style={styles.signOutView}>
        <FontAwesome name='sign-out' color={"#d95b33"} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="CalibrateScreen" component={CalibrateScreen} />
      {/* Vous pouvez ajouter ici tous les autres écrans du Stack */}
      <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} />

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
    <Drawer.Screen name="Mes amis" component={FriendsScreen} />
    <Drawer.Screen name="Nous contacter" component={ContactsScreen} />
    <Drawer.Screen name="Aide" component={HelpScreen} />
    <Drawer.Screen name="Recommandation" component={RecommendationScreen}/>
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
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    
  },
  profilpic: {
    width:70, 
    height:70,
    borderRadius:50,
  },
  signOutView: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    color: '#d95b33',
  },
  signOutText: {
    color: '#d95b33'
  },
  drawerHeader: {
    justifyContent: 'space-between',
    paddingLeft: 20,
  }
});
