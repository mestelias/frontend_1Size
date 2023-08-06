import { useState, useRef, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
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
} from "react-native";
import { Camera, CameraType, FlashMode } from 'expo-camera'; 
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; 
import {updatePicture} from '../reducers/user'

const backendIp = process.env.EXPO_PUBLIC_IP
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export default function ProfileScreen() {

  const userToken = useSelector((state) => state.user.value.token);
  
  const navigation = useNavigation();
  const dispatch = useDispatch()
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
  const [userGender, setUserGender] = useState("")
  const [picPreview, setPicPreview] = useState(null)

  
  //vérifier si tous les champs sont pleins et que l'email est correct
  const emailValid = (EMAIL_REGEX.test(email))
  const saveable = Boolean(emailValid && firstname && name && username && email && userGender)
  
  const [gender, setGender] = useState([
    { id: 1, value: true, name: "Homme", selected: false },
    { id: 2, value: false, name: "Femme", selected: false }
  ]);

  const [picModalVisible, setPicModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [flashMode, setFlashMode] = useState(FlashMode.off);

  const formData = new FormData();

  useEffect(() => {
    fetch(`${backendIp}/users/userdata/${userToken}`)
    .then((response) => response.json())
    .then((user) => {
      setName(user.nom)
      setFirstname(user.prenom)
      setUsername(user.username)
      setEmail(user.email)
      setUserGender(user.genre)
      setPicPreview(user.image)

      const updatedGender = gender.map(item => {
        if (item.name === user.genre) {
          return { ...item, selected: true };
        }
        return { ...item, selected: false };
      });
      setGender(updatedGender);
    })
  },[userToken])
//rajout du userToken dans le useEffect, car c'est l'indication qu'un utilisateur se connecte
//donc il faut charger les données dans la page profil 

  
  const handleSaveButton = async () => {
    setSaveModalVisible(false)
    //pas besoin de vérifier si tous les cahmps sont pleins, le bouton est inactif si c'est pas le cas, grâce à saveable
    let imageUrl = null;
    //on vérifie juste s'il veut enregistrer une photo, car on doit attendre cloudinary
    if (picPreview) {
        //on formate la photo
        formData.append('profilePic', {
            uri: picPreview,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        // on fait la demande et on attend la réponse de cloudinary pour continuer
        let response = await fetch(`${backendIp}/users/upload`, {
            method: 'POST',
            body: formData,
        });

        let data = await response.json();
        imageUrl = data.url;
    }
    // on fabrique l'objet qu'on va mettre en bdd
    let updateData = {
        token: userToken,
        username: username,
        nom: name,
        email: email,
        prenom: firstname,
        genre: userGender
    };
    // si il y a une image, on l'ajoute
    if (imageUrl) {
        updateData.image = imageUrl;
    }
    // on requête le back pour update avec l'objet qu'on a créé
    let response = await fetch(`${backendIp}/users/update`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    });

    let data = await response.json();
    // si ça a bien fonctionné, on met à jour le store redux pour l'afficher dans le drawer
    if (data.result === true) {
        if (imageUrl) {
            dispatch(updatePicture(imageUrl));
        }
        console.log("Youpi !");
    } else {
        console.log("Moins youpi...");
    }
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

      if (!result.canceled) {
        setPicPreview(result.assets[0].uri);
      }
  };


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
    setUserGender(item.name)
  };

   // Fonction pour empêcher l'utilisateur de faire la saisie en majuscule
   const updateEmail = (value) => {
    setEmail(value.toLowerCase()); 
  };


//Ajout condition caméra ou profileScreen
  if (!cameraVisible) return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Modal de sauvegarde des données profil */}
      <Modal visible={saveModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Voulez-vous vraiment sauvegarder ces données ?</Text>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={handleSaveButton}>
              <Text style={{ ...styles.textButton, color: '#FFFF'}}>Oui, sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: '#D95B33'}} onPress={() => setSaveModalVisible(false)}>
              <Text style={{ ...styles.textButton, color: '#FFFF'}}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal de choix entre photo et galerie */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={picModalVisible}>
        <TouchableWithoutFeedback onPress={() => setPicModalVisible(false)}> 
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
          <TouchableOpacity onPress={() => navigation.navigate('HomeStack')}>
            <Text style={{ fontWeight: 'bold', color: '#D95B33' }}>Retour</Text>
          </TouchableOpacity>       
        </View>
        <View style={styles.profilAvatar}>
          <Text style={styles.h1}>Profil</Text>
          <TouchableOpacity style={styles.picture} onPress={() => {
              setPicModalVisible(!picModalVisible);
            }}>
          <Image
            source={picPreview != null ? { uri: picPreview } : require('../assets/messi.jpg')}
            style={styles.roundedImage}
          />
          <View style={styles.iconContainer}>
           <Ionicons name="camera-outline" size={23} color="#fff"/>
          </View>
          </TouchableOpacity>
          <Text>@{username}</Text>
          <TouchableOpacity
            style={styles.classicbutton}
            activeOpacity={0.8}
            onPress={()=> navigation.navigate('Calibrage')}
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
              onChangeText={updateEmail}
              value={email}
              placeholder="Email"
            ></TextInput>
          </View>
        </View>
        {saveable ? 
        <TouchableOpacity style={[styles.savebutton, {backgroundColor: "#D95B33"}]} activeOpacity={0.8} onPress={()=>setSaveModalVisible(true)} >
          <Text style={styles.textButtonactive}>Sauvegarder mes modifications</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.savebutton} activeOpacity={0.8} >
          <Text style={styles.textButtoninactive}>Sauvegarder mes modifications</Text>
        </TouchableOpacity>
        }
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
    color : "#FFF"
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
});