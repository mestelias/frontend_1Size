import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  hideModal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

// URL de l'API
const url = process.env.EXPO_PUBLIC_IP;

// Composant principal
export default function ClothesScreen() {
  // État pour gérer le token de l'utilisateur
  const userToken = useSelector((state) => state.user.value.token); // Remplacez par useSelector

  // Initialisation de la navigation
  const navigation = useNavigation();

  // États pour gérer les modales et actions utilisateur
  const [vetementToConfirm, setVetementToConfirm] = useState(null);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [vetementToDelete, setVetementToDelete] = useState(null);
  const [categorieLC, setCategorieLC] = useState(null);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  // Autres états pour le compteur et les données des vêtements
  const [counterChanged, setCounterChanged] = useState(false);
  const [vetements, setVetements] = useState([]);
  const [vetementsEnAttente, setVetementsEnAttente] = useState([]);
  const [deleteEnAttente, setDeleteEnAttente] = useState(false);



  // Effet pour charger les vêtements de l'utilisateur
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
        console.error("Erreur lors de la récupération des vêtements :", error);
      });
  }, [counterChanged]);

  // Effet pour charger les vêtements en attente
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
        console.error("Erreur lors de la récupération des vêtements en attente :", error);
      });
  }, [counterChanged]);

  // Fonction pour confirmer l'ajout d'un vêtement
  const handleAddConfirmation = (vetement) => {
    setVetementToConfirm(vetement);
    setCategorieLC(vetement.categorie);
    setModalConfirmVisible(true);
  };

  // Fonction pour confirmer la suppression d'un vêtement
  const handleDeleteConfirmation = (vetement) => {
    setVetementToDelete(vetement._id);
    setCategorieLC(vetement.categorie);
    setModalDeleteVisible(true);
  };

  // Fonction pour supprimer un vêtement
  const handleDelete = () => {
    if (vetementToDelete) {
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
    }
  };
  
  // Fonction pour supprimer un vêtement en attente
const handleDeleteEnAttente = () => {
  if (vetementToDelete) {
    fetch(`${url}/users/enattente/${categorieLC}/${userToken}/${vetementToDelete}`, {
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
  }
};

  // Fonction pour traiter la soumission d'un vêtement
  const handleSubmit = (fit) => {
    fetch(`${url}/users/vetements/${categorieLC}/${userToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marque: vetementToConfirm.marque, 
        type: vetementToConfirm.type, 
        coupe: vetementToConfirm.coupe, 
        taille: vetementToConfirm.taille, 
        mensurations: vetementToConfirm.mensurations, 
        fit: fit,
      }),
    })
    .then((response) => response.json())
    .then((vetementtransfert) => {
      if (vetementtransfert.result) 
      {
        fetch(`${url}/users/enattente/${categorieLC}/${userToken}/${vetementToConfirm._id}`, {
          method: 'DELETE',
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            Alert.alert('Le vêtement a été confirmé avec succès.');
          } else {
            Alert.alert('Erreur', data.error);
          }
        })
        .catch((error) => {
          Alert.alert('Erreur', 'Une erreur est survenue');
        });
      }
      setModalConfirmVisible(false);
      setCounterChanged(!counterChanged)
    });
  };

  // Rendu du composant
  return (
    <View style={styles.background}>
       <ScrollView>
      {/* En-tête */}
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
          {/* Bouton pour ouvrir le menu de navigation */}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View>
        {/* ... (autres éléments d'en-tête) */}
      </SafeAreaView>
      
      {/* Section pour les vêtements en attente */}
      <View>
        <Text style={styles.h3}>Vêtements en attente</Text>
        <View style={styles.orangeLine}></View>
        {vetementsEnAttente.length > 0 ? (
        <View>
          {vetementsEnAttente.map((vetement) => (
          <View style={styles.centeredContainer} key={vetement._id}>
            <View style={styles.clothingItem}>
              {/* Affichage des informations du vêtement en attente */}
              <Text style={{ ...styles.textButton, color: 'black' }}>
                {vetement.type} {vetement.marque} {vetement.coupe} {vetement.taille}
              </Text>
              <View style={styles.buttonContainer}>
                {/* Bouton pour confirmer l'ajout */}
                <TouchableOpacity onPress={() => handleAddConfirmation(vetement)}>
                  <Ionicons size={32} name="save-outline" color="#D95B33" />
                </TouchableOpacity>
                {/* Bouton pour supprimer */}
                <TouchableOpacity
                  style={{ marginLeft: 35 }}
                  onPress={() => {
                    handleDeleteConfirmation(vetement);
                    setDeleteEnAttente(true);
                  }}
                >
                  <Ionicons size={32} name="close-circle-outline" color="#D95B33" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
              ))}
        </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={{ ...styles.textButton, color: 'black' }}>Aucun vêtement en attente</Text>
          </View>
        )}
        
        {/* Modale de confirmation pour ajouter un vêtement */}
        <Modal
          visible={modalConfirmVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalConfirmVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalConfirmVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Message de confirmation */}
                <Text style={styles.modalText}>La taille recommandée vous convient-elle?</Text>
                {/* Bouton pour confirmer l'ajout avec la taille recommandée */}
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: '#D95B33'}}
                  onPress={() => handleSubmit(true)}
                >
                  <Text style={{ ...styles.textButton, color: '#FFFF'}}>Oui</Text>
                </TouchableOpacity>
                {/* Bouton pour confirmer l'ajout sans la taille recommandée */}
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: '#D95B33'}}
                  onPress={() => handleSubmit(false)}
                >
                  <Text style={{ ...styles.textButton, color: '#FFFF'}}>Non</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        

      </View>
      
      {/* Section pour les vêtements de l'utilisateur */}
      <View>
        <Text style={styles.h3}>Mes vêtements</Text>
        <View style={styles.orangeLine}></View>
        {vetements.map((vetement) => (
        <View style={styles.centeredContainer} key={vetement._id}>
          <View style={styles.clothingItem}>
            {/* Affichage des informations du vêtement */}
            <Text style={{ ...styles.textButton, color: 'black'}}>
              {vetement.type} {vetement.marque} {vetement.coupe} {vetement.taille}
            </Text>
            <View style={styles.buttonContainer}>
            {/* Affichage de l'icône de confirmation ou de rejet */}
            {vetement.fit ? (<Ionicons size={32} name="happy-outline" color="#25958A" />) : (<Ionicons size={32} name="sad-outline" color="#707B81" />)}
            <TouchableOpacity style={{marginLeft: 35}} onPress={() => {handleDeleteConfirmation(vetement); setDeleteEnAttente(false)}}>
              <Ionicons size={32} name="close-circle-outline" color="#D95B33" />
            </TouchableOpacity>
            </View>
          </View>
        </View>
        ))}
      </View>
      
      {/* Modale de confirmation pour supprimer un vêtement */}
      <Modal
          visible={modalDeleteVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalDeleteVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalDeleteVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Message de confirmation */}
                <Text style={styles.modalText}>Voulez-vous vraiment supprimer ce vêtement ?</Text>
                {/* Bouton pour confirmer la suppression */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={deleteEnAttente ? handleDeleteEnAttente : handleDelete}
                >
                  <Text style={{ ...styles.textButton, color: '#FFFF'}}>Supprimer</Text>
                </TouchableOpacity>
                {/* Bouton pour annuler la suppression */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalDeleteVisible(false)}
                >
                  <Text style={{ ...styles.textButton, color: '#FFFF'}}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      
      {/* Section pour l'impact environnemental */}
      <View>
        <View style={{...styles.centeredContainer, marginTop : 50}}>
          <Text style={{ ...styles.textButton, color: 'black' }}>
            {vetements ? `${vetements.length * 10} kg CO2e et ${vetements.length * 2} kg de déchets économisés` : 'Commencez dès maintenant à économiser du CO2e et des déchets'}
          </Text>
        </View> 
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: "#FCFAF1",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      width: "100%",
      paddingLeft: 30,
      paddingTop: 15,
    },
    h3: {
      fontSize: 20,
      fontWeight: "700",
      fontFamily: "Outfit",
      textAlign: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    orangeLine: {
      height: 2, 
      width: "33%",
      backgroundColor: "#D95B33",
      marginTop: 5,
      alignSelf: "center",
    },
    enAttente: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 30,
    },
    textContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      marginBottom: 20,
      fontFamily: "Outfit",
    },
    button: {
      width: 150,
      alignItems: "center",
      marginTop: 10,
      paddingVertical: 12,
      backgroundColor: "#D95B33",
      borderRadius: 30,
      shadowOpacity: 0.8,
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
      height: 25,
      fontWeight: "600",
      fontSize: 14,
    },
    centeredContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
    },
    clothingItem: {
      width: "85%",
      flexDirection: "row",
      marginVertical: 8,
      justifyContent: "space-between",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      width: "40%",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});
