import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import ConfettiCannon from 'react-native-confetti-cannon';

const url = process.env.EXPO_PUBLIC_IP 

export default function CalibrateMensurations ({navigation, categorie}){

    const categorieLC = categorie.toLowerCase()
    // On stocke les inputs en ref (L'utilisation d'état re-render le composant et empêche la persistance du keyboard)
    const firstRef = useRef(null);
    const secondRef = useRef(null);
    const thirdRef = useRef(null)

  // On déclare un état pour afficher un message d'erreur
    const [errorMsg, setErrorMsg] = useState("");
  // On déclare un état pour afficher la modal de validation des mensurations
    const [modalVisible, setModalVisible] = useState(false);
  // Changer le système de mesure (EU, CM, US)
    const [convertLong, setConvertLong] = useState('CM');

    
  // Fonction pour vérifier si le formulaire est valide
    const isFormValid = () => {
      //à chaque fois que thirdRef est appelé, on vérifie si on est en categorie chaussures
      //si c'est le cas on l'enlève car il est "null"
        if (categorieLC !== "chaussures") {
          return (
              firstRef.current.value &&
              secondRef.current.value &&
              thirdRef.current.value
          );
      } else {
          return (
              firstRef.current.value &&
              secondRef.current.value
          );
    }
    };

    const token = useSelector((state) => state.user.value.token);
    console.log(token)
    
    const mensurationsSubmit = () => {
        if (!isFormValid()){
        setErrorMsg("Merci de remplir le(s) champ(s) manquant(s)");
        return;
        }

        setErrorMsg('')

        // Fonction pour convertir une valeur de inch en cm
        function inchToCm(valueInInch) {
        return valueInInch * 2.54;
        }

        if (isFormValid()){
            // On stocke les valeurs d'origine avant la conversion
        const originalFirstValue = firstRef.current.value;
        const originalSecondValue = secondRef.current.value;
        let originalThirdValue;
          if (categorieLC !== "chaussures") {
              originalThirdValue = thirdRef.current.value;
          }
    
        // On vérifie le système métrique utilisé et fais la conversion si nécessaire
        if (convertLong == 'Inch'){
            firstRef.current.value = inchToCm(firstRef.current.value);
            secondRef.current.value = inchToCm(secondRef.current.value);
              if (categorieLC !== "chaussures") {
                  thirdRef.current.value = inchToCm(thirdRef.current.value);
              }
        }

        const requestBody = {
          firstValue: firstRef.current.value,
          secondValue: secondRef.current.value,
        };
      
        if (categorieLC !== "chaussures") {
            requestBody.thirdValue = thirdRef.current.value;
        }

        //J'appelle la route pour mettre à jour les mensurations
        fetch(`${url}/users/mensurations/${categorieLC}/${token}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })
        .then((response) => response.json())
        .then((data) => {
            if(!data){
                setErrorMsg(data.message);
            } else {
                setModalVisible(true);

                // On réinitialise les valeurs après validation
                firstRef.current.value = originalFirstValue;
                secondRef.current.value = originalSecondValue;
                if (categorieLC !== "chaussures") {
                    thirdRef.current.value = originalThirdValue;
                }
            }
        });
    }
  }
    
    // La fonction permet de fermer la modal et rediriger l'utilisateur vers la Home
    navigateToHome = () => {
      navigation.navigate('Home'),
      setModalVisible(false)
    }

    navigateToCalibrage = () => {
      navigation.navigate('Calibrage'),
      setModalVisible(false)
  }

    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        >
        <Modal visible={modalVisible} animationType="fade" transparent={true}  onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.gradient}>
                  <Image source={require('../assets/gradient.png')} style={styles.gradientImage} />
                  <Image source={require('../assets/confetti.png')} style={styles.confettiImage} />
                </View>
                <Text style={styles.modalText}>Calibrage {categorieLC} réussi !</Text>
                <TouchableOpacity
                  style={{ ...styles.button, width: 250, marginTop : 10, marginBottom : 20}}
                  activeOpacity={0.8}
                  onPress={() => navigateToCalibrage()} 
                >
                  <Text style={styles.textButton}>
                    Calibrer le reste
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.button, width: 250, marginTop : 10, marginBottom : 20}}
                  activeOpacity={0.8}
                  onPress={() => navigateToHome()} 
                >
                  <Text style={styles.textButton}>
                    Chercher un vêtement
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <ConfettiCannon count={200} origin={{x: -10, y: 0}} colors={['#25958A','#D95B33', '#D6D1BD']} autoStart={true} />
        </Modal>
        <ScrollView 
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='never'
            style={styles.scrollView}
            >
            <View style={styles.mensurationHeader}>
                <Text style={styles.h3}>Renseigner vos mensurations</Text>
            <View style={styles.tailleSwitch}>
                <TouchableOpacity onPress={() => setConvertLong('cm')} activeOpacity={0.5}>
                { convertLong == 'cm' ? <Text style={styles.tailleBold}>CM</Text>  : <Text style={styles.taille}>CM</Text> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setConvertLong('inch')}>
                { convertLong == 'inch' ? <Text style={styles.tailleBold}>INCH</Text>  : <Text style={styles.taille}>INCH</Text> }
                </TouchableOpacity>
            </View>
            </View>

            <View style={styles.secondRoute}>
            {/* ... */}
            <View style={styles.containerInput}>
                <View style={styles.inputBox}>
                <Text style={styles.texte}>
                {categorie === "haut" ? "Tour de poitrine" : 
                 categorie === "bas" ? "Tour de bassin" : 
                 "Longueur de pied"}
                </Text>
                <View style={styles.inputBoxRow}>
                    <MensurationsInput ref={firstRef}
                    placeholder={categorieLC === "chaussures" ? "exemple : 27" : "exemple : 90"} />
                    <Text style={styles.inputTexte}>{convertLong}</Text>
                </View>

                </View>
                <View style={styles.inputBox}>
                <Text style={styles.texte}>
                {categorie === "haut" || categorie === "bas" ? "Tour de taille" : "Pointure"}
                </Text>
                <View style={styles.inputBoxRow}>
                    <MensurationsInput ref={secondRef} 
                    placeholder={categorieLC === "chaussures" ? "exemple : 42" : "exemple : 90"} />  
                    <Text style={styles.inputTexte}>{categorieLC === "chaussures" ? null : convertLong}</Text>                   
                </View>
                </View>
                { categorie != "chaussures" &&
                <View style={styles.inputBox}>
                <Text style={styles.texte}>
                {categorie === "haut" ? "Tour de hanches" : "Longueur de jambe"}
                </Text>
                <View style={styles.inputBoxRow}>
                    <MensurationsInput ref={thirdRef} placeholder="exemple : 80" />    
                    <Text style={styles.inputTexte}>{convertLong}</Text>  
                </View>
                </View>
                }                                 
            </View>
            { errorMsg !== '' && (<Text style={styles.error}>{errorMsg}</Text>)}
            <View>
                <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() =>  {mensurationsSubmit()}
                }
                >
                <Text style={styles.textButton}>Valider</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const MensurationsInput = React.forwardRef((props, ref) => (
    <TextInput
    {...props}
    ref={ref}
    style={styles.input}
    keyboardType="number-pad"
    maxLength={3}
    onChangeText={(text) => {
        ref.current.value = text;
    }}
    />
));


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: "80%",
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 30,
      width: "100%",
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    secondRoute: {
      flex: 1,
      width: "90%",
      backgroundColor: "#FCFAF1",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 40,
      paddingTop: 20,
    },
    containerInput: {
      alignItems: 'flex-start',
      width: '100%',
      backgroundColor: '#fcfaf1',
      borderRadius: 10,
      marginTop: 15,
    },
    inputBox : {
      width : '100%'
    },
    inputBoxRow : {
      flexDirection : "row",
      alignItems : "center"
    },
    inputTexte: {
      marginLeft : -40,
    },
    input: {
      alignItems: 'flex-start',
      height: 40,
      borderWidth: 1,
      borderColor: "#D6D1BD",
      padding: 5,
      marginTop: 10,
      marginBottom: 10, 
      width: "100%",
      borderRadius: 5,
      backgroundColor: '#ffffff'
    },
    button: {
      width: 150,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 8,
      marginBottom: 30,
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
      fontFamily: 'Outfit',
      height: 30,
      fontWeight: "600",
      fontSize: 16,
    },
    tailleSwitch: {
      flexDirection: "row",
      justifyContent: "center",
    },
    taille: {
      color: "#707B81",
      padding: 15,
    },
    tailleBold:{
      color: "#1a2530",
      padding: 15,
      fontWeight: "bold",
    },
    h3: {
      color: "#000000",
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: "Outfit",
    },
    texte: {
      fontFamily: "Outfit",
    },
    error: {
      color: "#DF1C28",
      fontFamily: "Outfit",
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: "#fcfaf1",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      marginHorizontal: 20,
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
    },
    scrollView:{
      flex: 1,
    },
    mensurationHeader : {
      marginTop: 20,
      alignItems: "center",
    },
    roundedImage: {
      width: 150, 
      height: 150,
      borderRadius: 75, 
    },
    confettiImage: {
      width: 100,
      height: 100,
    },
    gradient: {
      width: 150,
      height: 150,
      borderRadius: 75,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      overflow: 'hidden', 
    },
    gradientImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
});
