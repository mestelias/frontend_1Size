import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LoadingScreen({ navigation }) {

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('HomeStack');
        }, 5000); // gérer le temps ici
        }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logoAnimation.gif')} style={styles.gif} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25958a',
  },
  gif: {
    width: 400,
    height: 400,
  },
});