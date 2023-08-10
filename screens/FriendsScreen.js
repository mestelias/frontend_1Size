import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const url = process.env.EXPO_PUBLIC_IP;

export default function FriendsScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [friendProfile, setFriendProfile] = useState(false);
  const [searched, setSearched] = useState(false);

  const [friendSearch, setFriendSearch] = useState(""); // State pour stocker la valeur entrée dans le champ de recherche
  const [results, setResults] = useState([]); // State pour stocker les résultats de la recherche
  const [friendSelected, setFriendSelected] = useState({});

  const userToken = useSelector((state) => state.user.value.token);

  // Affiche la liste des amis à l'initialisation du composant
  useEffect(() => {
    fetchFriends();
  }, []);

  // Fonction qui permet d'afficher la liste d'amis de l'utilisateur
  const fetchFriends = async () => {
    try {
      const response = await fetch(`${url}/users/friends?&token=${userToken}`);
      const data = await response.json();

      const sortedFriends = data.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      setFriends(sortedFriends);
    } catch (error) {
      console.error("Erreur lors de la récupération des amis:", error);
    }
  };

  const renderSearchResults = () => {
    {
      searched && results.length === 0 && (
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            fontFamily: "Outfit",
            fontSize: 16,
          }}
        >
          Aucun utilisateur ne correspond à votre recherche.
        </Text>
      );
    }

    return results.map((item) => (
      <View
        key={item._id}
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 20,
              }}
            />
          ) : (
            <Image
              source={require("../assets/messi.jpg")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 20,
              }}
            />
          )}
          <Text style={styles.text}>{item.username}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleAddFriend(item.username)}
          style={{ marginLeft: 20 }}
        >
          <Text style={styles.text}>Ajouter </Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const mappedFriends = friends.map((item) => {
    return (
      <View
        key={item.username}
        style={{
          flexDirection: "row",
          width: "80%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          marginLeft: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 15,
                marginLeft: 15,
              }}
            />
          ) : (
            <Image
              source={require("../assets/messi.jpg")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 15,
                marginLeft: 15,
              }}
            />
          )}
          <TouchableOpacity onPress={() => openFriendProfile(item)}>
            <Text style={styles.text}>{item.username}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {/* <TouchableOpacity style={{ marginRight : 5 }}>
          <Text style={styles.text}>Rechercher</Text>
        </TouchableOpacity> */}
          <FontAwesome name="shopping-bag" color={"#d95b33"} size={20} />

          {/* <Ionicons size={32} name="close-circle-outline" color="#D95B33" /> */}
        </View>
      </View>
    );
  });

  // Cette fonction est appelée lorsque l'utilisateur appuie sur le bouton "Rechercher"
  const handleSearch = async () => {
    // Vérifie que la requête est d'au moins 3 caractères
    if (friendSearch.length < 3) {
      alert(
        "Veuillez entrer au moins 3 caractères pour effectuer une recherche."
      );
      return;
    }

    try {
      const response = await fetch(
        `${url}/users/searchfriend?username=${friendSearch}`
      );
      const data = await response.json();
      console.log("recherche", data);
      setResults(data);
      setSearched(true);
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
    }
  };

  // Cette fonction est appelée lorsque l'utilisateur appuie sur le bouton "ajouter"
  const handleAddFriend = async (friendId) => {
    console.log(friendId);
    try {
      const response = await fetch(`${url}/users/addfriend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          friendUsername: friendId,
        }),
      });
      const data = await response.json();

      console.log("data", data);

      if (data.success) {
        alert(data.message);
        fetchFriends();
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un ami:", error);
      alert("Une erreur est survenue.");
    }
  };

  const handleDeleteFriend = async (friendId) => {
    console.log(friendId);
    try {
      const response = await fetch(`${url}/users/deletefriend`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          friendId: friendId,
        }),
      });
      const data = await response.json();

      console.log("data", data);

      if (data.success) {
        alert(data.message);
        // Rafraîchir la liste des amis après une suppression réussie
        fetchFriends();
        setFriendProfile(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression d'un ami:", error);
      alert("Une erreur est survenue.");
    }
  };

  const openFriendProfile = (item) => {
    console.log(item);
    setFriendProfile(true);
    setFriendSelected(item);
  };

  const closeFriendProfile = () => {
    setFriendProfile(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setFriendSearch(""); // Réinitialiser le champ de recherche
    setResults([]); // Vider les résultats de la recherche
    setSearched(false);
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.H1}>Mes amis</Text>
        <View style={styles.border}></View>
        <View style={styles.container}>
          {/* Bouton pour ouvrir la modal */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.button}
          >
            <Text style={styles.textButton}>Ajouter un ami</Text>
          </TouchableOpacity>
          <ScrollView
            style={{
              width: "80%",
              borderTopWidth: 0.5,
              borderTopColor: "#d95b33",
              paddingTop: 15,
            }}
            showsVerticalScrollIndicator={false}
          >
            {mappedFriends}
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.h3}>Ajouter un ami</Text>

                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#D6D1BD"
                  value={friendSearch}
                  onChangeText={setFriendSearch}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.button}>
                  <Text style={styles.textButton}>Rechercher</Text>
                </TouchableOpacity>
                {results.length ? renderSearchResults() : null}

                {searched && results.length === 0 && (
                  <Text
                    style={{
                      marginTop: 20,
                      color: "#000000",
                      textAlign: "center",
                    }}
                  >
                    Aucun utilisateur ne correspond à votre recherche.
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="fade"
        transparent
        visible={friendProfile}
        onRequestClose={() => {
          setFriendProfile(!friendProfile);
        }}
      >
        <TouchableWithoutFeedback onPress={closeFriendProfile}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.modalViewProfil}>
                  <Image
                    source={{ uri: friendSelected.image }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 75,
                      borderColor: "#d95b33",
                      borderWidth: 2,
                    }}
                  />
                  <Text style={styles.H1}>{friendSelected.username}</Text>

                </View>

                <View style={styles.vetementsContainer}>
                  <Text style={styles.h3}>Ses vêtements</Text>
                  <View style={styles.border}></View>
                  <ScrollView
                    style={{
                      width: "100%",
                      paddingTop: 15,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {friendProfile &&
                      Object.keys(friendSelected.vetements).map((category) => (
                        <View key={category} style={styles.vetementsInput}>
                          <Text style={styles.h3}>{category}</Text>
                          {friendSelected.vetements[category].map(
                            (vetement, index) => (
                              <View key={index} style={styles.categorieList}>
                                <Text style={styles.vetements}>
                                  {vetement.marque}
                                </Text>
                                <Text style={styles.vetements}>
                                  {vetement.type}
                                </Text>
                                <Text style={styles.vetements}>
                                  {vetement.coupe}
                                </Text>
                                <Text style={styles.vetements}>
                                  {vetement.taille}
                                </Text>
                                {/* Si vous avez une image pour chaque vêtement, vous pouvez également l'afficher ici */}
                                {/* <Image source={{ uri: vetement.image }} style={styles.vetementImage} /> */}
                              </View>
                            )
                          )}
                        </View>
                      ))}
                    <TouchableOpacity
                      onPress={() => handleDeleteFriend(friendSelected._id)}
                      style={styles.button2}
                    >
                      <Text style={styles.textButton2}>
                        retirer de ma liste d'ami
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "#fcfaf1",
    marginTop: 20,
  },
  border: {
    paddingHorizontal: 35,
    borderBottomWidth: 3,
    borderBottomColor: "#d95b33",
    borderRadius: 50,
  },
  burgerIcon: {
    paddingLeft: 30,
    paddingTop: 15,
  },
  header: {
    justifyContent: "flex-start",
    width: "100%",
  },
  H1: {
    fontSize: 24,
    fontFamily: "Outfit",
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    alignItems: "flex-start",
    height: 40,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  textButton: {
    color: "#ffffff",
    fontFamily: "Outfit",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  button: {
    width: 200,
    alignItems: "center",
    marginTop: 30,
    paddingTop: 8,
    marginBottom: 40,
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
  modalView: {
    backgroundColor: "#FCFAF1",
    borderRadius: 20,
    padding: 50,
    width: "90%",
    height: "70%",
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewProfil :{
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center"
  },
  h3: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Outfit",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Outfit",
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
  textButton2: {
    color: "#707b81",
    fontFamily: "Outfit",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  vetementsContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  categorieList: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  vetements: {
    fontFamily: "Outfit",
  },
  vetementsInput: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
