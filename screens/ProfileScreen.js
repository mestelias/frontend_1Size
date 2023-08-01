import { useState, useRef, useEffect} from "react";
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import {
  Modal, 
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
import { Camera, CameraType, FlashMode } from 'expo-camera'; 
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; 

const backendIp = process.env.EXPO_PUBLIC_IP



export default function ProfileScreen() {

  const navigation = useNavigation();

//états pour gérer les focus des champs inputs 
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const [isFocused4, setIsFocused4] = useState(false);
//états des différents inputs  
  const [firstname, setFirstname] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  const [gender, setGender] = useState([
    { id: 1, value: true, name: "Homme", selected: false },
    { id: 2, value: false, name: "Femme", selected: false }
  ]);

/* Afin d'éviter de faire plein de fetchs vers la BDD, l'ensemble des infos du user doivent être mis dans un seul état - à faire
  const [userData, setUserData] = useState({
    firstname: "",
    name: "",
    username: "",
    email: "",
    gender: [
      { id: 1, value: true, name: "Homme", selected: false },
      { id: 2, value: false, name: "Femme", selected: false }
    ],
  })
  */

  const [modalVisible, setModalVisible] = useState(false);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [picPreview, setPicPreview] = useState(null)
  const userToken = useSelector((state) => state.user.value);

  const formData = new FormData();

  //TODO Sauvegarder ses données de profil 
  const handleSaveButton = () => {
    formData.append('profilePic', {
      uri: picPreview,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
  
    fetch(`${backendIp}/users/upload`, {
      method: 'POST',
      body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        fetch(`${backendIp}/users/update`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: userToken,
            image: data.url
          })
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.result === true) {
            console.log("Youpi !")
          } else {
            console.log("Moins youpi...")
          }
        })
      })
  }

  // Choisir une image dans le dossier
  const pickImage = async () => {
    // Pas de permission nécessaire pour l'accès à la Galerie
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPicPreview(result.assets[0].uri);
    }
  };

//Affichage des éléments du user à travers un fetch via son token puis le stockage des éléments reçus dans des états


/*useEffect(
    fetch(`${BACKEND_ADRESS}/userdata:${usertoken}`)
    .then(response =>response.json())
    .then(data => {setFirstname(data.nom), setName(data.prenom), setUsername(data.username), setEmail(data.email)})
    )*/

// Prise de photo
    let cameraRef = useRef(null);
    const takePicture = async () => {
      const photo = await cameraRef.takePictureAsync({ quality: 0.3 })
      setPicPreview(photo.uri)
    }
  
    const handleCameraButton = () => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        setCameraVisible(true)
      })();
    }

  // Création des différents éléments pour chaque radiobouton qui sera map dans le return

  const RadioButton = ({ onPress, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
   // Fonction onclick du Radiobouton pour passer d'un sexe à un autre

  const onRadioBtnClick = (item) => {
    let updatedState = gender.map((isGender) =>
      isGender.id === item.id
        ? { ...isGender, selected: true }
        : { ...isGender, selected: false }
    );
    setGender(updatedState);
  };


//Ajout condition caméra ou profileScreen
  if (!cameraVisible) return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}> 
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>  
                <View style={styles.modal}>
                  <TouchableOpacity
                    onPress={() => {
                      handleCameraButton();
                    }}>
                    <Ionicons name="camera-outline" size={32} color="#D95B33"/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      pickImage()
                      setModalVisible(false)
                    }}>
                    <Ionicons name="folder-open-outline" size={32} color="#D95B33"/>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>      
          <Text style={{ fontWeight: 'bold', color: '#D95B33' }}>Retour</Text> 
        </View>
        <View style={styles.profilAvatar}>
          <Text style={styles.h1}>Profil</Text>
          <TouchableOpacity style={styles.picture} onPress={() => {
              setModalVisible(!modalVisible);
            }}>
          <Image
            source={picPreview != null ? { uri: picPreview } : require('../assets/Nelson.jpg')}
            style={styles.roundedImage}
          />
          <View style={styles.iconContainer}>
           <Ionicons name="camera-outline" size={23} color="#fff"/>
          </View>
          </TouchableOpacity>
          <Text>@Samy</Text>
          <TouchableOpacity
            style={styles.classicbutton}
            activeOpacity={0.8}
            // A REDIRIGER VERS LE CALIBRAGE
            // onPress={()=> }
          >
            <Text style={styles.textButtonactive}>Me re-calibrer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataProfil}>
          <View>
            <Text style={styles.h3}>Mes coordonnées</Text>
          </View>
          <View style={styles.inputProfil}>
            <View style = {styles.gender}>
              {/* Radio boutons */}
              {gender.map((item) => (
              <RadioButton
                onPress={() => onRadioBtnClick(item)}
                selected={item.selected}
                key={item.id}
              >
              {item.name}
              </RadioButton>
              ))} 
            </View>
            <TextInput
              style={[
                styles.input,
                { borderColor: isFocused ? "#D95B33" : "#D6D1BD" }
              ]}
              onFocus={()=> setIsFocused(true)}
              onBlur={()=> setIsFocused(false)}
              onChangeText={setFirstname}
              value={firstname}
              placeholder="Prénom"
            ></TextInput>
            <TextInput
               style={[
                styles.input,
                { borderColor: isFocused2 ? "#D95B33" : "#D6D1BD" }
              ]}
              onFocus={()=> setIsFocused2(true)}
              onBlur={()=> setIsFocused2(false)}
              onChangeText={setName}
              value={name}
              placeholder="Nom"
            ></TextInput>
            <TextInput
               style={[
                styles.input,
                { borderColor: isFocused3 ? "#D95B33" : "#D6D1BD" }
              ]}
              onFocus={()=> setIsFocused3(true)}
              onBlur={()=> setIsFocused3(false)}
              onChangeText={setUsername}
              value={username}
              placeholder="Nom utilisateur"
            ></TextInput>
            <TextInput
               style={[
                styles.input,
                { borderColor: isFocused4 ? "#D95B33" : "#D6D1BD" }
              ]}
              onFocus={()=> setIsFocused4(true)}
              onBlur={()=> setIsFocused4(false)}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity
          style={styles.savebutton}
          activeOpacity={0.8}
          onPress={()=> handleSaveButton()}
        >
          <Text style={styles.textButtoninactive}>Sauvegarder mes modifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.classicbutton}
          activeOpacity={0.8}
          //todo : AJOUTER LA FONCTIONNALITE POUR INVITER UN AMI
          // onPress={()=> }
        >
          <Text style={styles.textButtonactive}>Inviter un ami</Text>
        </TouchableOpacity>
      </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  // Afficher la camera
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modal : {
  flexDirection: "row",
  marginTop: 50,
  backgroundColor: "white",
  padding: 35,
  shadowColor: "#000",
  borderRadius: 10, 
  borderWidth: 1,  
  borderColor: '#D95B33',
  },  
  background: {
    flex: 1,
    backgroundColor: '#FCFAF1' ,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#FCFAF1",
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
    justifyContent: "center",
    alignItems: "center",
    margin : 0,
  },
  picture: {
  flex: 1,
  position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 25,
  },
  iconContainer: {
    flex:1,
    position: 'absolute',
    top: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D95B33',
    width: 40, 
    height: 40,
    borderRadius: 20,
    padding: 8,
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
    margin : 0,
  },
  inputProfil: {
    flex: 1, 
    alignItems: "center",
    width: "100%",
  },
  input: {
    alignItems: "center",
    height: 50,
    width: "95%",
    marginTop: 10,
    borderWidth: 1,
    padding: 5,
    fontFamily: 'Outfit',
    borderRadius: 5,
    backgroundColor: '#FFF',
    fontSize: 12,
  },
  h1: {
    fontFamily: "Outfit",
    fontSize: 24,
    marginBottom: 15,
  },
  classicbutton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingTop: 8,
    width: "50%",
    marginTop: 30,
    backgroundColor: "#D95B33",
    borderRadius: 30,
    marginBottom: 40,
    fontSize : 12,
  },
  savebutton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingTop: 8,
    width: "90%",
    marginTop: 35,
    backgroundColor: "#D6D1BD",
    borderRadius: 30,
    fontSize : 12,
    marginBottom: 10,
  },
  textButtonactive: {
    color: "#707B81",
    height: 30,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#FFF",
  },
  textButtoninactive: {
    color: "#707B81",
    height: 30,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#707B81",
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
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginRight: 30,
    marginLeft: 30,
    padding: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D6D1BD",
    alignItems: "center",
    justifyContent: "center"
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#25958A"
  },
  radioButtonText: {
    fontFamily: "Outfit",
    fontSize: 12,
    marginLeft: 16,
  },
  gender: {
    marginTop: 20,
    flexDirection: "row",
  }
});