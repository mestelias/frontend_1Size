import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Alert,
  TouchableWithoutFeedback, 
  Image
} from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Ionicons from '@expo/vector-icons/Ionicons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { calculerMoyenne } from "../modules/calculerMoyenne";


const url = process.env.EXPO_PUBLIC_IP

export default function CalibrateTailles({ navigation, categorie }) {
    //cagtegorie vient des props de HomeCalibrateScreen => CalibrateScreen => CalibrateTailles
    const categorieLC = categorie.toLowerCase()
    const userToken = useSelector((state) => state.user.value.token);

    const sexe = useSelector((state)=>state.user.value.genre)
    const sexeLC = sexe && sexe.toLowerCase()

    
    //Etats pour stocker les valeurs choisies par l'utilisateur
    const [marque, setMarque] = useState();
    const [coupe, setCoupe] = useState(); // en local uniquement (pas de coupes en bdd)
    const [taille, setTaille] = useState();
    const [type, setType] = useState();
    
    const [vetements, setVetements] = useState([]);
    const [counterChanged, setCounterChanged] = useState(false);
    
    // pour ne pas lancer l'algo de moyenne si l'utilisateur a déjà renseigné ses mensurations lui même
    const [alreadyCalculated, setAlreadyCalculated] = useState(false)
    
    // mensurations créées via l'algo de moyenne
    const [mensurationsCreees, setMensurationsCreees] = useState(null)
    //Etats pour stocker l'ensemble des éléments récupérés en BDD 
    const [marquesDispo, setMarquesDispo] = useState([]); // récupéré au moment du fetch
    const [typesDispo, setTypesDispo] = useState([]); // récupéré au moment de la sélection de la marque
    const [taillesDispo, setTaillesDispo] = useState([]); // récupéré au moment de la sélection du type
    
    //Marques qui ne sont pas désactivées après utilisation
    const[marquesActives, setMarquesActives] = useState([])
    
    //Etat pour gérer la marque enregistré précédemment afin d'éviter la sélection de la même marque deux fois de suite (la marque est toujours affichée même quand elle est désactivée)
    const [oldMarque, setOldMarque] = useState('neutral')
    
    //Etats pour gérer la suppression des vêtements calibrés
    const [vetementToDelete, setVetementToDelete] = useState(null);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

    const convertObject = (obj) => {
      const secondValue = obj.tourDeTaille || obj.pointure || null;
      const firstValue = obj.tourDePoitrine || obj.tourDeBassin || obj.longueur || null;
      const thirdValue = obj.tourDeHanches || obj.longueurJambe || null;
    
      // Pour les chaussures, renvoyer seulement les deux premières valeurs
      if (obj.pointure) {
        return { firstValue, secondValue };
      }
    
      return { firstValue, secondValue, thirdValue };
    };
    
    //Etat pour gérer l'apparition de la modal de féclitations
    const [modalCongratsVisible, setModalCongratsVisible] = useState(false);

    //Va chercher tous les marques de la categorie en BDD
    useEffect(()=>{
    
      fetch(`${url}/marques/names?sexe=${sexeLC}&categorie=${categorieLC}`)
      .then((response)=> response.json())
      .then((marques) => setMarquesDispo(marques))
    
    }, [])
    
    //Va chercher l'ensemble des vêtements de la categorie dans la BDD
    useEffect(()=>{
    
      fetch(`${url}/users/userclothes?token=${userToken}&categorie=${categorieLC}`)
          .then((response)=>response.json())
          .then((vetements) => {
            setVetements(vetements);
            setAlreadyCalculated(false)
          }); 
    
    }, [counterChanged]) // se réinitialise à chaque fois que le compteur change pour que le compteur soit toujours d'actualité

    // Lancer l'algo qu'à partir de 3 marques et si il n'a pas rentré lui même ses tailles
    if (vetements.length > 2 && !alreadyCalculated){
      setAlreadyCalculated(true)
      setMensurationsCreees(calculerMoyenne(vetements))
    }
    // Si l'algo est passé par là : on met en bdd
    if (mensurationsCreees) {
      console.log("mensurations creees : ", mensurationsCreees)
      const mensurationsConverties = convertObject(mensurationsCreees)
      console.log("mensurations converties : ",mensurationsConverties)
      fetch(`${url}/users/mensurations/${categorieLC}/${userToken}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mensurationsConverties),
        })
          .then((response) => response.json())
          .then((data) => { console.log("data mise en base de données",data)})
    }
    
    newDataMarques = marquesDispo.map((name, i) => {
      if(!marquesActives.includes(name)){
      return {key:i, value:name, disabled:false}}
      else {
      return {key:i, value:name, disabled:true}  
      }
    })
    
    function displayType(marque) {
      fetch(`${url}/marques/types?marque=${marque}&sexe=${sexeLC}&categorie=${categorieLC}`)
      .then((response)=>response.json())
      .then((types) => setTypesDispo(types));
      setMarque(marque);
    }
    
    const newDataTypes = typesDispo.map((types, i) => {
      return {key:i, value:types, disabled:false}
    })
    
    const coupes = (categorieLC === 'haut') ? [
      {key:'1', value : 'Regular', disabled:false},
      {key:'2', value : 'Slim', disabled:false},
      {key:'3', value : 'Ample', disabled:false},
    ] : [
      {key:'1', value : 'Regular', disabled:false},
      {key:'2', value : 'Slim', disabled:false},
    ]  
    
    function displayTailles(type) {
      fetch(`${url}/marques/tailles?marque=${marque}&type=${type}&sexe=${sexeLC}&categorie=${categorieLC}`)
      .then((response)=>response.json())
      .then((tailles) => setTaillesDispo(tailles));
      setType(type);
    }
    
    //
    const newDataTailles = taillesDispo.map((types, i) => {
      return {key:i, value:types, disabled:false}
    })
    
    //TO DO l'impossibilité pour le user de faire suivant si le type qui reste affiché n'est pas disponible pour une marque + afficher un message d'erreur sur l'écran
    const handleSubmit = () => { 
    //Condition d'envoi du tableau de mensuration
      if (marque === oldMarque){
        return Alert.alert("Marque déjà utilisée") }

      if (taille) {
        fetch(`${url}/marques/types?marque=${marque}&sexe=${sexeLC}&categorie=${categorieLC}`)
        .then((response)=>response.json())
        .then((types) => {
          if(types.includes(type)){
            fetch(`${url}/marques/tableau?marque=${marque}&type=${type}&sexe=${sexeLC}&categorie=${categorieLC}&taille=${taille}`)
            .then((response)=>response.json())
            .then((mensurations) => {
              if (mensurations) {
                fetch(`${url}/users/vetements/${categorieLC}/${userToken}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    marque: marque,
                    type: type,
                    coupe: coupe,
                    taille: taille,
                    mensurations: mensurations,
                    fit: true
                  }),
                })
                .then((response) => response.json())
                .then((vetement) => {
                  (() => {
                  setMarquesActives((prevMarquesActives) => [...prevMarquesActives, marque]); // fetch les marques en bdd
                  })();
                  setOldMarque(marque);
                  setCounterChanged(!counterChanged);
                });
              };    
            })
          } 
          else {
            Alert.alert("Ce type n'est pas disponible pour cette marque")
          }  
        })
      }
      
    }
    
    const handleFinish = () => {
      setModalCongratsVisible(true);
    }

      const handleDeleteConfirmation = (vetementId) => {
        setVetementToDelete(vetementId);
        setModalDeleteVisible(true);
      };
    
      const handleDelete = () => {
        if (vetementToDelete){
        fetch(`${url}/users/vetements/${categorieLC}/${userToken}/${vetementToDelete}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
            } else {
              Alert.alert('Erreur', data.error);
            }
          })
          .catch((error) => {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
          });
          setModalDeleteVisible(false);
          setCounterChanged(!counterChanged);
        };
      } 
    
      navigateToHome = () => {
        setModalCongratsVisible(false),
        navigation.navigate('Home')
      }
  
      navigateToCalibrage = () => {
        setModalCongratsVisible(false),
        navigation.navigate('Calibrage')
      }

      return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.premierRoute}>
            <View style={styles.overContainer}>
              <View style={{marginTop: 20}}>
              {vetements.length >= 3 ? (<Text st>Merci de confirmer tes vêtements</Text>) : (
              <Text>Vêtements {vetements.length}/3</Text>
              )}
              </View>
                {vetements.length >= 3 ? null : (
                <View style={styles.containerInput}>
                <SelectList 
                    boxStyles={styles.box}
                    inputStyles={styles.input}
                    dropdownStyles={styles.dropdown}
                    dropdownItemStyles={styles.dropdownItem}
                    dropdownTextStyles={styles.dropdownText}
                    setSelected={(val) => displayType(val)} 
                    data={newDataMarques} 
                    save="value"
                    placeholder="Marque"
                /> 
                <SelectList 
                    boxStyles={styles.box}
                    inputStyles={styles.input}
                    dropdownStyles={styles.dropdown}
                    dropdownItemStyles={styles.dropdownItem}
                    dropdownTextStyles={styles.dropdownText}
                    setSelected={(val) => displayTailles(val)} 
                    data={newDataTypes} 
                    save="value"
                    placeholder="Type"
                />
                { !(categorie === "chaussures") && 
                <SelectList 
                    boxStyles={styles.box}
                    inputStyles={styles.input}
                    dropdownStyles={styles.dropdown}
                    dropdownItemStyles={styles.dropdownItem}
                    dropdownTextStyles={styles.dropdownText}
                    setSelected={(val) => setCoupe(val)} 
                    data={coupes} 
                    save="value"
                    placeholder="Coupe"
                />
                }
                <SelectList 
                    boxStyles={styles.box}
                    inputStyles={styles.input}
                    dropdownStyles={styles.dropdown}
                    dropdownItemStyles={styles.dropdownItem}
                    dropdownTextStyles={styles.dropdownText}
                    setSelected={(val) => setTaille(val)} 
                    data={newDataTailles} 
                    save="value"
                    placeholder="Taille"
                />
                </View>)}
                <View>
                  {/* Bouton Suivant */}
                  <TouchableOpacity
                    style={
                      vetements.length >= 3
                        ? { ...styles.button, backgroundColor: '#D95B33'}
                        : styles.button
                    }
                    activeOpacity={0.8}
                    onPress={ vetements.length >= 3 ? handleFinish : handleSubmit}
                  >
                    <Text style={
                      vetements.length >= 3
                        ? { ...styles.textButton, color: '#FFFF'}
                        : styles.textButton
                    }>
                      {vetements.length >= 3 ? 'Confirmer' : 'Suivant'}
                    </Text>
                  </TouchableOpacity>
                  <Modal visible={modalCongratsVisible} animationType="fade" transparent={true}  onRequestClose={() => setModalDeleteVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => setModalCongratsVisible(false)}>
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
                </View>
              </View>
              {vetements.map((vetement) => (
                <View style={styles.centeredContainer} key={vetement._id}>
                  <View style={styles.clothingItem}>
                    {/* Affichage des informations du vêtement */}
                    <View style={styles.textContainer}>
                      <Text style={{ ...styles.textButton, color: 'black' }}>
                        {vetement.type} {vetement.marque} {vetement.coupe} {vetement.taille}
                      </Text>
                    </View>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => handleDeleteConfirmation(vetement._id)}
                      >
                        <Ionicons size={32} name="close-circle-outline" color="#D95B33" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              <Modal visible={modalDeleteVisible} animationType="fade" transparent={true} onRequestClose={() => setModalDeleteVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setModalDeleteVisible(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalText}>Souhaites-tu vraiment supprimer ce vêtement ?</Text>
                      <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={handleDelete}>
                        <Text style={{ ...styles.textButton, color: '#FFFF'}}>Oui, supprimer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={() => setModalDeleteVisible(false)}>
                        <Text style={{ ...styles.textButton, color: '#FFFF'}}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      );
};

const styles = StyleSheet.create({
    premierRoute: {
        flex: 1,
        backgroundColor: "#FCFAF1",
        justifyContent: "space-around",
        alignItems: "center",
      },
    containerInput: {
    alignItems: 'center',
    width: '100%',
    
    backgroundColor: '#fcfaf1',
    borderRadius: 10,
    marginTop: 15,
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
      shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "#d95b33",
    },
    textButton: {
      color: "#ffffff",
      fontFamily: 'Outfit',
      height: 30,
      fontWeight: "600",
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%', 
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
    },
    box: {
      borderColor: '#D6D1BD',
      backgroundColor: 'white',
      margin: 5,
      width: 350,
      alignSelf: 'center',
    },
    input: {
        fontSize: 16,
        color: 'black'
    },
    dropdown: {
        backgroundColor: 'white',
        width:350,
        alignSelf: 'center',
        marginBottom: 10, 
        borderColor: '#D6D1BD' // Cela permet au menu déroulant de s'adapter à son contenu
    },
    dropdownItem: {
        padding: 10,
        borderColor: '#eee',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    dropdownText: {
        fontSize: 16,
        color: 'black'
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
    textButton: {
      color: "#ffffff",
      fontFamily: "Outfit",
      height: 25,
      fontWeight: "600",
      fontSize: 14,
    },
    centeredContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10, // Increase spacing between items
    },
    clothingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Align text and icon with space in between
      paddingHorizontal: 20, // Add horizontal padding for spacing
    },
    textContainer: {
      flex: 1
    },
    iconContainer: {
      marginRight : 30,
    },
    overContainer: {
      alignItems: 'center',
      marginRight: 25
    }
})