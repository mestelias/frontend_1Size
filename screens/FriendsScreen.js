import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput
} from "react-native";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

const url = process.env.EXPO_PUBLIC_IP;

export default function FriendsScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [query, setQuery] = useState(""); // State pour stocker la valeur entrée dans le champ de recherche
  const [results, setResults] = useState([]); // State pour stocker les résultats de la recherche

  const userToken = useSelector((state) => state.user.value.token);

  useEffect(() => {
    fetch(`${url}/users/friends?&token=${userToken}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const sortedFriends = data.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        setFriends(sortedFriends);
      });
  }, []);

  // Cette fonction est appelée lorsque l'utilisateur appuie sur le bouton "Rechercher"
  const handleSearch = async () => {
    try {
      const response = await fetch(`${url}/users/searchfriend?username=${query}`);
      const data = await response.json();
      console.log('recherche', data)
      setResults(data);
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
    }
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
          <View>
            <TextInput
              placeholder="Rechercher par nom d'utilisateur..."
              value={query}
              onChangeText={setQuery} // Mettre à jour le state query lorsque l'utilisateur tape
            />
            <Button title="Rechercher" onPress={handleSearch} /> 
            <FlatList
              data={results}
              keyExtractor={(item) => item._id} // Utilisez l'ID unique de l'utilisateur comme clé
              renderItem={({ item }) => (
                <View>
                  <Text>{item}</Text>
                  {/* Ici, vous pouvez ajouter un bouton ou une action pour ajouter l'utilisateur comme ami */}
                </View>
              )}
            />
          </View>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  // Image par défaut si vous en avez une
                  <Image
                    source={require("../assets/messi.jpg")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 10,
                    }}
                  />
                )}
                <Text>{item.username}</Text>
                <TouchableOpacity style={{ marginLeft: 20 }}>
                  <Text>Rechercher</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

//   return (
//     <View style={styles.background}>
//       <SafeAreaView style={styles.header}>
//         <View style={styles.burgerIcon}>
//             <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <FontAwesome name={"bars"} size={40} color={"#25958A"} />
//             </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//       <View style={styles.titleContainer}>
//         <Text style={styles.H1}>Mes amis</Text>
//         <View style={styles.border}></View>
//       <View style={styles.container}>
//       </View>

//       </View>
//     </View>
//   );
// }

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
    marginTop: 30,
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
    fontWeight: "600",
    marginBottom: 20,
  },
});
