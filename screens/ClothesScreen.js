import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SelectList } from 'react-native-dropdown-select-list'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { set } from "mongoose";

const url = process.env.EXPO_PUBLIC_IP 

export default function ClothesScreen() {
const userToken = "DiQIm2bkhqLbnXDpwzwyF-zfEbqKxsfN" //useSelector((state) => state.user.value.token);
const navigation = useNavigation();

//Etats pour gérer l'ajout des nouveaux vêtement recherchés
const [vetementToConfirm, setVetementToConfirm] = useState(null);
const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

//Affichage de la modale avec définition du vêtement à ajouter 
const handleAddConfirmation = (vetementId) => {
  setVetementToConfirm(vetementId);
  setModalConfirmVisible(true);
};

//Etats pour gérer la suppression des vêtements 
const [vetementToDelete, setVetementToDelete] = useState(null);
const [categorieLC, setCategorieLC] = useState(null)
const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

//Affichage de la modale avec définition du vêtement à supprimer
const handleDeleteConfirmation = (vetement) => {
  setVetementToDelete(vetement._id);
  setCategorieLC(vetement.categorie)
  setModalDeleteVisible(true);
};

const [counterChanged, setCounterChanged] = useState(false);
const [vetements, setVetements] = useState([]);

//Définit s'il y a des vêtements à confimer 
const [enAttenteCounter, setEnAttenteCounter] = useState(false)

const [vetementsEnAttente, setVetementsEnAttente] = useState(null)

//Va chercher l'ensemble des vêtements
useEffect(() => {
  fetch(`${url}/users/alluserclothes?token=${userToken}`)
    .then((response) => response.json())
    .then((data) => {
      const mergedVetements = [
        ...data.haut.map(vetement => ({ ...vetement, categorie: 'haut' })),
        ...data.bas.map(vetement => ({ ...vetement, categorie: 'bas' })),
        ...data.chaussures.map(vetement => ({ ...vetement, categorie: 'chaussures' })),
      ];

      setVetements(mergedVetements);
    })
    .catch((error) => {
      console.error("Une erreur est survenue lors de la récupération des vêtements :", error);
    });
}, [counterChanged]);

console.log(vetements)

//Va chercher l'ensemble des vêtements en attente
useEffect(() => {
  fetch(`${url}/users/allenattente?token=${userToken}`)
    .then((response) => response.json())
    .then((data) => {
      const mergedVetementsEnAttente = [
        ...data.haut.map(vetement => ({ ...vetement, categorie: 'haut' })),
        ...data.bas.map(vetement => ({ ...vetement, categorie: 'bas' })),
        ...data.chaussures.map(vetement => ({ ...vetement, categorie: 'chaussures' })),
      ];

      setVetementsEnAttente(mergedVetementsEnAttente);
    })
    .catch((error) => {
      console.error("Une erreur est survenue lors de la récupération des vêtements :", error);
    });
}, [enAttenteCounter]);

//Supression effective du vêtement
const handleDelete = () => {
  if (vetementToDelete){
  fetch(`${url}/users/vetements/${categorieLC}/${userToken}/${vetementToDelete}`, { // rendre dynamique (token)
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

//Ajout du vêtement en attente dans les vêtements de l'utilisateur et suppression de celui-ci dans le sous-documents vêtements en attente 
const handleSubmit = (fit) => {
  fetch(`${url}/users/vetements/${categorieLC}/${userToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      marque: marque,
      type: type,
      coupe: coupe,
      taille: taille,
      mensurations: mensurations,
      fit : fit
    }),
  })
  .then((response) => response.json())
  .then((vetementtransfert) => {
    if(vetementtransfert) {
    fetch(`${url}/users/enattente/${categorieLC}/${userToken}/${vetementToDelete}`, { // rendre dynamique (token)
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
      setEnAttenteCounter(!enAttenteCounter);
      }})
  };



  return (
    <View style={styles.background}>
        <SafeAreaView style={styles.header}>
          <View style={styles.burgerIcon}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <FontAwesome name={"bars"} size={40} color={"#25958A"} />
            </TouchableOpacity>
          </View>
          {/*<View style={styles.titleContainer}>
            <Text style={styles.H1}>Mes Vetements</Text>
          </View>*/}
        </SafeAreaView>
        <View>
          <Text style={styles.h3}>Vêtements en atttente</Text>
          { vetementsEnAttente ? (
          <View style={styles.enAttente}>
            {vetementsEnAttente.map((vetement, i) => (
              <View key={i}>
                <View style={styles.textContainer}>
                  <Text style={{ ...styles.textButton, color: 'black' }}>
                    {vetement.type} {vetement.marque} {vetement.coupe} {vetement.taille}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={styles.button} onPress={() => handleAddConfirmation(vetement)}>
                    <Text style={styles.textButton}>Confirmer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => handleDeleteConfirmation(vetement)}>
                    <Text style={styles.textButton}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
            </View>))}
          </View>) : (<View style={styles.textContainer}><Text>Aucun vêtement en attente</Text></View>)}
          <Modal visible={modalConfirmVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>La taille recommandée vous convient-elle?</Text>
                <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={() => handleSubmit(true)}>
                  <Text style={{ ...styles.textButton, color: '#FFFF'}}>Oui</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={() => handleSubmit(false)}>
                  <Text style={{ ...styles.textButton, color: '#FFFF'}}>Non</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
          <View>
          <Text style={styles.h3}>Mes vêtements</Text>
          {vetements.map((vetement) => (
            <View style={styles.clotheContainer} key={vetement._id}>
              <Text style={{ ...styles.textButton, color: 'black' }}>
                {vetement.type} {vetement.marque} {vetement.coupe} {vetement.taille}
              </Text>
              {vetement.fit ? (<Ionicons size={32} name="thumbs-up" color="#25958A" />) : (<Ionicons size={32} name="thumbs-down" color="#707B81" />)}
              <TouchableOpacity onPress={() => handleDeleteConfirmation(vetement)}>
                <Ionicons size={32} name="trash-bin-outline" color="#D95B33" />
              </TouchableOpacity>
            </View>
          ))}
          </View>
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
          <View>
           <Text style={styles.h3}>Mon impact</Text>  
           <Text style={{ ...styles.textButton, color: 'black' }}>
            {vetements ? `${vetements.length * 10} kg CO2e et ${vetements.length * 2} kg de déchets économisés` : 'Commencez dès maintenant à économiser du CO2e et des déchets'}
            </Text>
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
  titleContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fcfaf1",
    marginTop: 30,
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
  h3: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Outfit",
    textAlign: "center",
    marginTop: 10, 
    marginBottom: 10
  },
  enAttente: {
    alignItems : "center",
    justifyContent : "center",
    marginBottom : 30,
  },
  textContainer: {
    alignItems : "center",
    justifyContent : "center",
    marginTop: 10,
  },
  button: {
    width: 130,
    alignItems: "center",
    marginTop: 5,
    paddingTop: 8,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
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
    fontSize: 14,
  },
  clotheContainer : {
    flexDirection : "row",
    marginBottom : 10,
    marginTop: 10,
  }
});