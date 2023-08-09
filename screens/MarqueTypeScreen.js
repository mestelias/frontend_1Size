import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

const url = process.env.EXPO_PUBLIC_IP

export default function MarqueTypeScreen({ navigation, route }) {
    const { name, categorie } = route.params
    const sexe = useSelector((state)=>state.user.value.genre)
    const sexeLC = sexe && sexe.toLowerCase()
    const [typesDispo, setTypesDispo] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [type, setType] = useState('')
    const [coupe, setCoupe] = useState("normale")

    const handlePressType = (typePressed) => {
      setType(typePressed)
      setIsModalVisible(true)
    }


    useEffect(()=>{
        fetch(`${url}/marques/types?marque=${name}&sexe=${sexeLC}&categorie=${categorie}`)
        .then((response)=> response.json())
        .then((types) => setTypesDispo(types))
    }, [name])

    const types = typesDispo.map((type,i) => {
      return (
        <TouchableOpacity key={i} style={styles.photoContainer} onPress={()=>handlePressType(type)}>
          <Text>{type}</Text>
        </TouchableOpacity>
      )
    })

    const handleValidate = () => {
      setIsModalVisible(false);
      navigation.navigate('RecommendationScreen',{categorie:categorie, marque:name, type:type, coupe:coupe})
    }
  return (
    <View style={styles.background}>
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback
            onPress={() => setIsModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <Image
                    source={require('../assets/vetements/teeshirt.jpeg')}
                    style={styles.image}
                  />
                  <View style={styles.buttonChoiceView}>
                    <TouchableOpacity style={coupe === 'Slim' ? styles.button2Coupe : styles.buttonCoupe} onPress={() => {setCoupe('Slim')}}>
                      <Text style={styles.textButton}>Slim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={coupe === 'Normale' ? styles.button2Coupe : styles.buttonCoupe} onPress={() => {setCoupe('Normale')}}>
                      <Text style={styles.textButton}>Regular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={coupe === 'Ample' ? styles.button2Coupe : styles.buttonCoupe} onPress={() => {setCoupe('Ample')}}>
                      <Text style={styles.textButton}>Ample</Text>
                    </TouchableOpacity>  
                    
                  </View>
                  <TouchableOpacity 
                  style={styles.button} 
                  activeOpacity={0.8}
                  onPress={()=>{handleValidate()}}
                  >
                    <Text style={styles.textButton}>
                      Valider
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    activeOpacity={0.8}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.textButton2}>
                      Annuler
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
            </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.H1}>Types</Text>
        <View style={styles.border}></View>
      <View style={styles.container}>
      {types}
      </View> 

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: "#FCFAF1",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    buttonChoiceView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 30,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%'
    },
    photoContainer: {
      marginTop: 20,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    titleContainer: {
      alignItems: "center",
      backgroundColor: "#fcfaf1",
      marginTop: 30,
    },
    border: {
      paddingHorizontal: 35, 
      borderBottomWidth:3,
      borderBottomColor: '#d95b33', 
      borderRadius: 50,
    },
    burgerIcon:{
      paddingLeft: 30,
      paddingTop: 15,
    },
    header: {
      justifyContent: "flex-start",
      width: "100%",
    },
    H1: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: "white",
      width: "90%",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    h3: {
      fontSize: 20,
      fontWeight: "600",
      fontFamily: "Outfit",
      textAlign: "center",
    },
    button: {
      width: 200,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginBottom: 15,
      backgroundColor: "#d95b33",
      borderRadius: 30,
      shadowOpacity: 1,
      elevation: 4,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    buttonCoupe: {
      width: 100,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginHorizontal: 1.7,
      marginBottom: 15,
      backgroundColor: "#d95b33",
      borderRadius: 30,
      shadowOpacity: 1,
      elevation: 4,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    textButton: {
      color: "#ffffff",
      fontFamily: "Outfit",
      height: 30,
      fontWeight: "600",
      fontSize: 16,
    },
    button2: {
      width: 200,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginBottom: 15,
      backgroundColor: "#d6d1bd",
      borderRadius: 30,
      shadowOpacity: 1,
      elevation: 4,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    button2Coupe: {
      width: 100,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginBottom: 15,
      marginHorizontal: 1.7,
      backgroundColor: "#d6d1bd",
      borderRadius: 30,
      shadowOpacity: 1,
      elevation: 4,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    textButton2: {
      color: "#707b81",
      fontFamily: "Outfit",
      height: 30,
      fontWeight: "600",
      fontSize: 16,
    },
    image: {
      width: 100,
      height: 110,
      borderRadius: 50,
      marginBottom: 15,
    },
});