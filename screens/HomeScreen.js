import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap } from 'react-native-tab-view';


const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#FCFAF1' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#FCFAF1' }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function HomeScreen({navigation}) {

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Pour moi' },
    { key: 'second', title: 'Pour un ami' },
  ]);

  return (
    <View style={styles.background}>
        <View style={styles.container}>
          <SafeAreaView style={styles.header}>
              <TouchableOpacity                     
              onPress={() => navigation.openDrawer()}>
                  <FontAwesome 
                  name={'bars'} 
                  size={40} 
                  color={'#25958A'}
                  />
              </TouchableOpacity>
              <Text>HomeScreen</Text>
          </SafeAreaView>
          <View style={styles.titleBox}>
            <Text style={styles.H1}>Recherche ton vêtement</Text>
          </View>
        </View>
        <TabView
          style={styles.tabView}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FCFAF1',
  },
  container: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  titleBox: {

  },
  H1: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  tabView: {
    marginTop: 10,
  },
});
