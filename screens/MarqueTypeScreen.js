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
    const [coupe, setCoupe] = useState("Regular")

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
          <Text style={{fontSize : 30, fontFamily : 'Outfit'}}>{type}</Text>
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
                  <Text style={styles.textType}>Quelle coupe ?</Text>
                  <View style={styles.buttonChoiceView}>
                    <TouchableOpacity style={coupe === 'Slim' ? styles.buttonCoupe : styles.button2Coupe} onPress={() => {setCoupe('Slim')}}>
                      <Text style={coupe === 'Slim' ? styles.textButton : styles.text2Button}>Slim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={coupe === 'Regular' ? styles.buttonCoupe : styles.button2Coupe} onPress={() => {setCoupe('Regular')}}>
                      <Text style={coupe === 'Regular' ? styles.textButton : styles.text2Button}>Regular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={coupe === 'Ample' ? styles.buttonCoupe : styles.button2Coupe} onPress={() => {setCoupe('Ample')}}>
                      <Text style={coupe === 'Ample' ? styles.textButton : styles.text2Button}>Ample</Text>
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
      <TouchableOpacity style={{marginRight:8, paddingBottom:10}} onPress={() => navigation.goBack()}>
        <Text style={styles.retour}>Retour</Text>
      </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.H1}>Choisis ton {categorie}</Text>
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
      backgroundColor: "#fcfaf1",
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
      marginTop: 30,
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontFamily : 'Outfit'
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
      marginBottom: 20
    },
    burgerIcon:{
      paddingLeft: 30,
      paddingTop: 15,
    },
    // header: {
    //   justifyContent: "flex-start",
    //   width: "100%",
    // },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "100%",
      padding: 20,
      paddingTop:13,

      // marginTop: 40
    },
    retour: {
      fontWeight: 'bold', 
      color: '#D95B33',
      fontSize: 20,
      paddingTop: 10,
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
      backgroundColor: "#fcfaf1",
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
      shadowColor: "#d95b33",
    },
    buttonCoupe: {
      width: 100,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginHorizontal: 1.7,
      marginBottom: 15,
      backgroundColor: "#d95b33",
      borderRadius: 10,
      shadowOpacity: 1,
      elevation: 4,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowColor: "#d95b33",
    },
    textButton: {
      color: "#ffffff",
      fontFamily: "Outfit",
      height: 30,
      fontWeight: "600",
      fontSize: 16,
    },
    text2Button: {
      color: "#707b81",
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
      shadowColor: "#d6d1bd",
    },
    button2Coupe: {
      width: 100,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginBottom: 15,
      marginHorizontal: 5.9,
      backgroundColor: "#fcfaf1",
      borderRadius: 10,
      shadowOpacity: 0.5,
      //elevation: 70,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      //  borderBottomColor: 'red',
      borderColor: '#d95b33',
      borderWidth: 1,
      shadowColor: "rgba(0, 0, 0, 0.15)",
    },
    textButton2: {
      color: "#707b81",
      fontFamily: "Outfit",
      height: 30,
      fontWeight: "600",
      fontSize: 16,
    },
    textType: {
      fontFamily: 'Outfit',
      color: "#707B81",
      fontSize: 20,
      fontFamily: "Outfit",
    },
    image: {
      width: 100,
      height: 110,
      marginBottom: 15,
    },
});