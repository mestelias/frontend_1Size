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

const url = process.env.EXPO_PUBLIC_IP 

export default function CalibrateMensurations ({navigation, categorie}){

    const categorieLC = categorie.toLowerCase()
    // On stocke les inputs en ref (L'utilisation d'état re-render le composant et empêche la persistance du keyboard)
    const poitrineRef = useRef(null);
    const tourTailleRef = useRef(null);
    const hancheRef = useRef(null)

  // On déclare un état pour afficher un message d'erreur
    const [errorMsg, setErrorMsg] = useState("");
  // On déclare un état pour afficher la modal de validation des mensurations
    const [modalVisible, setModalVisible] = useState(false);
  // Changer le système de mesure (EU, CM, US)
    const [convertLong, setConvertLong] = useState('CM');

    
  // Fonction pour vérifier si le formulaire est valide
    const isFormValid = () => {
        return (
        poitrineRef.current.value &&
        tourTailleRef.current.value &&
        hancheRef.current.value
        );
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
        const originalPoitrineValue = poitrineRef.current.value;
        const originalTourTailleValue = tourTailleRef.current.value;
        const originalHancheValue = hancheRef.current.value;

        // On vérifie le système métrique utilisé et fais la conversion si nécessaire
        if (convertLong == 'Inch'){
            poitrineRef.current.value = inchToCm(poitrineRef.current.value);
            tourTailleRef.current.value = inchToCm(tourTailleRef.current.value);
            hancheRef.current.value = inchToCm(hancheRef.current.value);
        }

        //J'appelle la route pour mettre à jour les mensurations Haut
        fetch(`${url}/users/mensurations/${categorieLC}/${token}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            tourDePoitrine: poitrineRef.current.value,
            tourDeTaille: tourTailleRef.current.value,
            tourDeHanches: hancheRef.current.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
            if(!data){
                setErrorMsg(data.message)
            } else {
                setModalVisible(true);

                // On réinitialise les valeurs après validation
                poitrineRef.current.value = originalPoitrineValue;
                tourTailleRef.current.value = originalTourTailleValue;
                hancheRef.current.value = originalHancheValue;

            }
            }) 
        }
    }
    
    // La fonction permet de fermer la modal et rediriger l'utilisateur vers la Home
    navigateToHome = () => {
        setModalVisible(false)
        navigation.navigate('Home')
    }

    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        >
        <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
        <TouchableWithoutFeedback style={styles.modalContainer} onPress={() => setModalVisible(false)}> 
        <View style={styles.centeredView}>
        <TouchableWithoutFeedback>  
            <View style={styles.modalView}>
            <Image
            source={require('../assets/messi.jpg')}
            style={styles.roundedImage}
            />
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Calibrer le reste</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.button} 
            activeOpacity={0.8}
            onPress={navigateToHome}
            >
                <Text style={styles.textButton}>Rechercher un vêtement</Text>
            </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>  
        </View>
        </TouchableWithoutFeedback>
        </View>
        </Modal>
        <ScrollView 
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='never'
            style={styles.scrollView}
            >
            <View style={styles.mensurationHeader}>
                <Text style={styles.h3}>Renseigner vos mensurations</Text>
            <View style={styles.tailleSwitch}>
                <TouchableOpacity onPress={() => setConvertLong('CM')} activeOpacity={0.5}>
                { convertLong == 'CM' ? <Text style={styles.tailleBold}>CM</Text>  : <Text style={styles.taille}>CM</Text> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setConvertLong('Inch')}>
                { convertLong == 'Inch' ? <Text style={styles.tailleBold}>INCH</Text>  : <Text style={styles.taille}>INCH</Text> }
                </TouchableOpacity>
            </View>
            </View>

            <View style={styles.secondRoute}>
            {/* ... */}
            <View style={styles.containerInput}>
                <View style={styles.inputBox}>
                <Text style={styles.texte}>Tour de poitrine</Text>
                <View style={styles.inputBoxRow}>
                    <MensurationsInput ref={poitrineRef} placeholder="exemple : 90" />
                    <Text style={styles.inputTexte}>{convertLong}</Text>
                </View>

                </View>
                <View style={styles.inputBox}>
                <Text style={styles.texte}>Tour de taille</Text>
                <View style={styles.inputBoxRow}>
                    <MensurationsInput ref={tourTailleRef} placeholder="exemple : 60" />  
                    <Text style={styles.inputTexte}>{convertLong}</Text>                   
                </View>
                </View>
                <View style={styles.inputBox}>
                <Text style={styles.texte}>Tour de hanches</Text>
                <View style={styles.inputBoxRow}>
                    <MensurationsInput ref={hancheRef} placeholder="exemple : 90" />    
                    <Text style={styles.inputTexte}>{convertLong}</Text>  
                </View>                                 
                </View>
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
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 30,
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
});
