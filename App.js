import "react-native-gesture-handler";
import { useCallback } from "react";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Elements
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";

//font
import { useFonts } from "expo-font";
// import * as SplashScreen from 'expo-splash-screen';

//Screens
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
        iconColor = focused ? "#D95B33" : "#000"; // Mettre '#d95b33' pour la couleur souhaitée

        // Retourne l'icône FontAwesome avec le nom calculé
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
    drawerStyle={{
      backgroundColor: "#FCFAF1",
      width: "80%", // Ajoute la largeur de 80% ici
    }}
  >
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
  </Drawer.Navigator>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit: require("./assets/fonts/Outfit-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="AppDrawerNavigation"
          component={AppDrawerNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
