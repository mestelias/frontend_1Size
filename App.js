import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import profileScreen from './screens/ProfileScreen';

const Drawer = createDrawerNavigator();

const AppDrawerNavigation = () => (
  <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={profileScreen} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <AppDrawerNavigation />
    </NavigationContainer>
  );
}
