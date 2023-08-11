import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function PageOne() {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.H1}>Economise du temps, de l'argent et préserve l'environnement !</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: "#FCFAF1",
    width: '100%',
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'absolute',
    top: -250,
    right: -250, 
    overflow: 'hidden',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'cover',
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fcfaf1",
    marginTop: 30,
  },
  H1: {
    fontSize: 33,
    fontWeight: "600",
    marginBottom: 80,
    marginRight: 13,
    fontFamily: "Outfit",
    textAlign: "left", 
    lineHeight: 55, 
  },
  logo: {
    textAlign: 'left',
    fontSize: 45,
    fontFamily: 'Outfit'
  },
  logoView: {
    textAlign: 'left',
    marginLeft: 30,
    marginTop: 30,
  }
});