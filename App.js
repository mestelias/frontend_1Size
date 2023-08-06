import "react-native-gesture-handler";

//Sound
import React from "react";
// import { Audio } from "expo-av";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

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

const CustomDrawer = (props) => {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const {image, username} = user

  const handleSignOut = () => {
    console.log('je clique sur signout')
    dispatch(emptyStore())
    props.navigation.navigate('SignIn')
  }

  
  return (
  <DrawerContentScrollView {...props}>
    <View style = {styles.profilView}>
      <Image source={image ? { uri: image } : require('./assets/Nelson.jpg')} style={styles.profilpic}/>
      <Text>@{username ? username : `username`}</Text>
    </View>
    <DrawerItemList {...props}/>
    <TouchableOpacity onPress={()=> handleSignOut()} style={styles.signOutView}>
      <FontAwesome name='sign-out' color={"#d95b33"} />
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  </DrawerContentScrollView>
)}

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="CalibrateScreen" component={CalibrateScreen} />
      {/* Vous pouvez ajouter ici tous les autres écrans du Stack */}
    </Stack.Navigator>
  );
};

const AppDrawerNavigation = () => (
  <Drawer.Navigator
  drawerContent = {(props) => <CustomDrawer {...props} />}
  screenOptions={({ route }) => ({
      headerShown: false,
      drawerActiveTintColor: "#25958A",
      drawerInactiveTintColor: "#d95b33",
      drawerType: "front",
      drawerHeader: 'none',
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
    <Drawer.Screen name="Home" component={StackNavigator} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="SignUp" component={SignUpScreen} />
    <Drawer.Screen name="SignIn" component={SignInScreen} />
    <Drawer.Screen name="CalibrateHome" component={CalibrateHomeScreen} />
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
    flexDirection:'row',
    alignItems: 'center',
  },
  profilpic: {
    width:60, 
    height:60,
    borderRadius:30,
    margin:10},
  signOutView: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    color: '#d95b33',
  },
  signOutText: {
    color: '#d95b33'
  }
});
