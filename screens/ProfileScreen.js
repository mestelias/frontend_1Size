import { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Modal, //Ajout modal import
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Icon
} from "react-native";
import { Camera, CameraType, FlashMode } from 'expo-camera'; //ADD TOUT CA
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // à ajouter
  const [cameraVisible, setCameraVisible] = useState(false); // à ajouter
  const [hasPermission, setHasPermission] = useState(false); // à ajouter
  const [type, setType] = useState(CameraType.front); // à ajouter
  const [flashMode, setFlashMode] = useState(FlashMode.off); // à ajouter
  const [picPreview, setPicPreview] = useState(null)

  let cameraRef = useRef(null); // à ajouter
// à ajouter
  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 })
    setPicPreview(photo.uri)
  }

  //Ajout handleCameraButton
  const handleCameraButton = () => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setCameraVisible(true)
    })();
  }

  console.log(cameraVisible)
  //Ajout condition
  if (!cameraVisible) return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
{/* Modal à ajouter */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={() => {
              handleCameraButton();
            }}>
            <Ionicons name="camera-outline" size={32} color="#D95B33"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Ionicons name="folder-open-outline" size={32} color="#D95B33"/>
          </TouchableOpacity>
        </View>
      </Modal>
{/* fin de l'ajout */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
          <Text>Retour</Text>
        </View>
        <View style={styles.profilAvatar}>
          <Text style={styles.h1}>Profil</Text>
          <TouchableOpacity onPress={() => {
              setModalVisible(!modalVisible);
            }}>
          <Image
            source={picPreview != null ? { uri: picPreview } : require('../assets/Nelson.jpg')}
            style={styles.roundedImage}
          />
          <Ionicons name="camera-outline" size={32} color="#D95B33"/>
          </TouchableOpacity>
          <Text>@Samy</Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            // A REDIRIGER VERS LE CALIBRAGE
            // onPress={()=> }
          >
            <Text style={styles.textButton}>Me re-calibrer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataProfil}>
          <View>
            <Text style={styles.h3}>Mes coordonnées</Text>
          </View>
          <View style={styles.inputProfil}>
            <TextInput
              style={styles.input}
              onChangeText={setFirstname}
              value={firstname}
              placeholder="Prénom"
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Nom"
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Nom utilisateur"
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          //todo : AJOUTER LA FONCTIONNALITE POUR SAUVEGARDER LES INPUTS DE PROFIL
          // onPress={()=> }
        >
          <Text style={styles.textButton}>Sauvegarder</Text>
        </TouchableOpacity>
      </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  if (hasPermission) return (
    <Camera type={type} flashMode={flashMode} ref={(ref)=>cameraRef=ref} style={styles.camera}>
      <View style={styles.cameraIconsDiv}>
      <TouchableOpacity onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)} style={styles.cameraButton}>
        <Ionicons name="refresh-outline" size={32} color="#D95B33"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off)} style={styles.cameraButton}>
        <Ionicons name="flash" size={32} color={flashMode === FlashMode.off ? '#D95B33' : '#e8be4b'}/>
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cameraSnap} onPress={() => cameraRef && takePicture()}>
        <Ionicons name="scan-circle-outline" size={95} color="#D95B33"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {setCameraVisible(false)}} >
        <Ionicons name="return-up-back" size={32} color="#D95B33"/>
      </TouchableOpacity>
    </Camera>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex:1,
  }, 
  cameraIconsDiv: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  cameraSnap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 25,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  // Ajouter style de la modale
  modal : {
  flexDirection: "row",
  marginTop: 50,
  backgroundColor: "white",
  padding: 35,
  justifyContent: "space-around",
  alignItems: "space-around",
  shadowColor: "#000"
  },  
  container: {
    flex: 1,
    // backgroundColor: "#FCFAF1",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  profilAvatar: {
    width: "100%",
    margin: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  h3: {
    width: "80%",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    marginBottom: 10,
  },
  dataProfil: {
    alignItems: "center",
    width: "100%",
  },
  inputProfil: {
    alignItems: "center",
    width: "100%",
  },
  input: {
    alignItems: "center",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    padding: 5,
    width: "80%",
    fontFamily: 'Outfit',
  },
  h1: {
    fontFamily: "Outfit",
    fontSize: 24,
    marginBottom: 5,
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 50,
    backgroundColor: "#D6D1BD",
    borderRadius: 30,
    marginBottom: 80,
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
    color: "#707B81",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Outfit",
  },
  imageAvatar: {
    width: 90,
    height: 124,
    marginTop: 15,
  },
  roundedImage: {
    width: 150, 
    height: 150,
    borderRadius: 75, 
  },
});
