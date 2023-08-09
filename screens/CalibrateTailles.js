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
} from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Ionicons from '@expo/vector-icons/Ionicons';


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

    console.log(mensurationsCreees)
    
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
    
    // Fonction pour générer le tableau de mensurations
    const calculerMoyenne = (tableau) => {
    
      const array = tableau.map(e => e.mensurations)
      // Initialisation de l'objet contenant la somme de chaque propriété
      const somme = {};
      // Initialisation du compteur du nombre de propriété similaire à objet
      const compteur = {};
    
      array.forEach(obj => {
        // Création d'un tableau de propriété sur lequel boucler
        Object.keys(obj).forEach(key => {
          // on incrémente la valeur des clées (si la clée n'existait pas on initialise à 0)
          somme[key] = (somme[key] || 0) + obj[key];
          // on compte le nombre de fois où la clée apparaît dans les objets
          compteur[key] = (compteur[key] || 0) + 1;
        });
      });
    
      const moyenne = {};
    
      Object.keys(somme).forEach(key => {
        // on moyenne par rapport au nombre de fois où les clées apparaissent
        moyenne[key] = somme[key] / compteur[key];
      });
    
      return moyenne;
    }
    // Lancer l'algo qu'à partir de 3 marques et si il n'a pas rentré lui même ses tailles
    if (vetements.length > 2 && !alreadyCalculated){
      setAlreadyCalculated(true)
      setMensurationsCreees(calculerMoyenne(vetements))
    }
    // Si l'algo est passé par là : on met en bdd
    if (mensurationsCreees) {
      fetch(`${url}/users/mensurations/${categorieLC}/${userToken}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mensurationsCreees),
        })
          .then((response) => response.json())
          .then((data) => { console.log(data)})
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
    
    const coupes = [
      {key:'1', value : 'Classic', disabled:false},
      {key:'2', value : 'Ample', disabled:false},
      {key:'3', value : 'Slim', disabled:false},
      {key:'4', value : 'Skinny', disabled:false}
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
    
    //reste à traiter l'impossibilité pour le user de faire suivant si le type qui reste affiché n'est pas disponible pour une marque + afficher un message d'erreur sur l'écran
    const handleSubmit = () => { 
    //Condition d'envoi du tableau de mensuration
      if (!(marque === oldMarque)){  
        if (taille) {
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
                  console.log(vetement);
                  (() => {
                  setMarquesActives((prevMarquesActives) => [...prevMarquesActives, marque]); // fetch les marques en bdd
                  })();
                  console.log("marque enregistrée");
                  setOldMarque(marque);
                  setCounterChanged(!counterChanged);
                });
              };    
            })
        }
      }
      else {
        console.log("marque déjà utilisée")
      }
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
              Alert.alert('Suppression réussie', 'Le vêtement a été supprimé avec succès.');
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
    
      return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.premierRoute}>
            {vetements.length >= 3 ? null : (
            <Text>Vêtement {vetements.length+1}/3</Text>
            )}
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
              </View>
              <View>
                {/* Bouton Suivant */}
                <TouchableOpacity
                   style={
                    vetements.length >= 3
                      ? { ...styles.button, backgroundColor: '#D95B33'}
                      : styles.button
                  }
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                >
                  <Text style={
                    vetements.length >= 3
                      ? { ...styles.textButton, color: '#FFFF'}
                      : styles.textButton
                  }>
                    Suivant
                  </Text>
                </TouchableOpacity>
              </View>
              {vetements.map((vetement) => (
                <View key={vetement._id}>
                  <Text>{vetement.type} {vetement.marque} {vetement.coupe} {vetement.taille}</Text>
                  <TouchableOpacity onPress={() => handleDeleteConfirmation(vetement._id)}>
                    <Ionicons size={32} name="close-circle-outline" color="#D95B33" />
                  </TouchableOpacity>
                </View>
              ))}
              <Modal visible={modalDeleteVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Voulez-vous vraiment supprimer ce vêtement ?</Text>
                    <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={handleDelete}>
                      <Text style={{ ...styles.textButton, color: '#FFFF'}}>Oui, supprimer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={() => setModalDeleteVisible(false)}>
                      <Text style={{ ...styles.textButton, color: '#FFFF'}}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
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
    }
})