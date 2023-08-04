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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SelectList } from 'react-native-dropdown-select-list'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";


const url = process.env.EXPO_PUBLIC_IP 


// Composant Tailles
const PremierRoute = ({ onSubmit }) => {
 
const userToken = useSelector((state) => state.user.value);
console.log('ceci est le token',userToken)

//TODO mettre le sexe de manière dynamique dans le store en fonction du user/ami sélectionné
const sexe = "homme"

//Etats pour stocker les valeurs choisies par l'utilisateur
const [marque, setMarque] = useState();
const [coupe, setCoupe] = useState(); // en local uniquement (pas de coupes en bdd)
const [taille, setTaille] = useState();
const [type, setType] = useState();

const [vetements, setVetements] = useState([]);
const [counterChanged, setCounterChanged] = useState(false);
const [alreadyCalculated, setAlreadyCalculated] = useState(false)

const [mensurations, setMensurations] = useState([])
const [mensurationsExistent, setMensurationsExistent] = useState(false)
const [mensurationsCreees, setMensurationsCreees] = useState(null)

//Etats pour stocker l'ensemble des éléments récupérés en BDD 
const [marquesDispo, setMarquesDispo] = useState([]); // récupéré au moment du fetch
const [typesDispo, setTypesDispo] = useState([]); // récupéré au moment de la sélection de la marque
const [taillesDispo, setTaillesDispo] = useState([]); // récupéré au moment de la sélection du type


//Marques qui ne sont pas désactivées après utilisation
const[marquesActives, setMarquesActives] = useState([])

//Etat pour gérer la marque enregistré précédemment afin d'éviter la sélection de la même marque deux fois de suite (la marque est toujours affichée même quand elle est désactivée)
const [oldMarque, setOldMarque] = useState('neutral')

useEffect(()=>{

  fetch(`${url}/marques/names?sexe=${sexe}&categorie=haut`)
  .then((response)=> response.json())
  .then((marques) => setMarquesDispo(marques))

}, [])

useEffect(()=>{
  fetch(`${url}/users/userclothes?token=WeoG9kKWGakkWr8gWcbmi3zhttkBanva&categorie=haut`) // rendre dynamique (token)
      .then((response)=>response.json())
      .then((vetements) => {
        setVetements(vetements);
        setAlreadyCalculated(false)
      }); 
}, [counterChanged])

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

if (vetements.length > 2 && !alreadyCalculated){
  setAlreadyCalculated(true)
  setMensurationsCreees(calculerMoyenne(vetements))
}

if (mensurationsCreees) {
  console.log('TOKEEEEEEEEN',userToken)
  fetch(`${url}/users/mensurations/haut/${userToken}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mensurationsCreees),
    })
      .then((response) => response.json())
      .then((data) => { console.log(data)})
}

console.log("nouvelles mensu algo",mensurationsCreees)

newDataMarques = marquesDispo.map((name, i) => {
  if(!marquesActives.includes(name)){
  return {key:i, value:name, disabled:false}}
  else {
  return {key:i, value:name, disabled:true}  
  }
})

function displayType(marque) {
  fetch(`${url}/marques/types?marque=${marque}&sexe=${sexe}&categorie=haut`)
  .then((response)=>response.json())
  .then((types) => setTypesDispo(types));
  setMarque(marque);
}

const newDataTypes = typesDispo.map((types, i) => {
  return {key:i, value:types, disabled:false}
})

const coupes = [
  {key:'1', value : 'Regular/Classic', disabled:false},
  {key:'1', value : 'Broad', disabled:false},
  {key:'1', value : 'Slim', disabled:false},
  {key:'1', value : 'Skinny/ExtraSlim', disabled:false}
]

function displayTailles(type) {
  fetch(`${url}/marques/tailles?marque=${marque}&type=${type}&sexe=${sexe}&categorie=haut`)
  .then((response)=>response.json())
  .then((tailles) => setTaillesDispo(tailles));
  setType(type);
}

const newDataTailles = taillesDispo.map((types, i) => {
  return {key:i, value:types, disabled:false}
})

//reste à traiter l'impossibilité pour le user de faire suivant si le type qui reste affiché n'est pas disponible pour une marque + afficher un message d'erreur sur l'écran
const handleSubmit = () => { 
//Condition d'envoi du tableau de mensuration
if (mensurationsCreees && !mensurationsExistent) {

}


if (!(marque === oldMarque)){  
if (taille){
    fetch(`${url}/marques/tableau?marque=${marque}&type=${type}&sexe=${sexe}&categorie=haut&taille=${taille}`)
    .then((response)=>response.json())
    .then((mensurations) => {
    if(mensurations){fetch(`${url}/users/vetements/haut/WeoG9kKWGakkWr8gWcbmi3zhttkBanva`, { // rendre dynamique (token)
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      marque: marque,
      type: type,
      coupe: coupe,
      taille: taille,
      mensurations: mensurations
      }),
    })
    .then((response)=>response.json())
    .then((vetement)=>{console.log(vetement);
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


// TODO Fonction pour vérifier si le formulaire est valide //
  /*const isFormValid = () => {
    return ();
  };*/

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.premierRoute}>
          <Text>Counter{vetements.length}/3</Text>
          <View style={styles.containerInput}>
          <SelectList 
              setSelected={(val) => displayType(val)} 
              data={newDataMarques} 
              save="value"
              placeholder="marque"
          />
          <SelectList 
              setSelected={(val) => displayTailles(val)} 
              data={newDataTypes} 
              save="value"
              placeholder="type"
          />
          <SelectList 
              setSelected={(val) => setCoupe(val)} 
              data={coupes} 
              save="value"
              placeholder="coupe"
          />
          <SelectList 
              setSelected={(val) => setTaille(val)} 
              data={newDataTailles} 
              save="value"
              placeholder="taille"
          />
          </View>
          <View>
            {/* Bouton Suivant */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.textButton}>
                Suivant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Tab Mensurations

const SecondRoute = ({}) => {

  // On stocke les inputs en ref (L'utilisation d'état re-render le composant et empêche la persistance du keyboard)
    const poitrineRef = React.useRef(null);
    const tourTailleRef = React.useRef(null);
    const hancheRef = React.useRef(null)

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

  const token = useSelector((state) => state.user.value);
  const navigation = useNavigation();

  
  const mensurationsSubmit = () => {
    if (!isFormValid()){
      setErrorMsg("Merci de remplir le(s) champ(s) manquant(s)");
      return;
    }

    setErrorMsg('')


    if (isFormValid()){
      fetch(`${url}/users/mensurations/haut/${token}`, {
      // fetch(`${backendIp}/users/mensurations/haut/${token}`, {
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
          }
        }) 
    }
  }
  
  // La fonction permet de fermer la modal et rediriger l'utilisateur vers la Home
  navigateToHome = () =>{
    setModalVisible(false)
    navigation.navigate('Home')
  }



  return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
        <Modal visible={modalVisible} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}> 

          <View style={styles.centeredView}>
          <TouchableWithoutFeedback>  
            <View style={styles.modalView}>
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
        </Modal>
          <ScrollView 
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='never'>
            <View>
                <Text style={styles.h3}>Renseigner vos mensurations</Text>
            </View>
            <View style={styles.tailleSwitch}>
            {/* <TouchableOpacity >
                    <Text style={styles.taille}>EU</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text style={styles.taille}>US</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                 <Text style={styles.taille}>UK</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => setConvertLong('CM')} activeOpacity={0.5}>
                { convertLong == 'CM' ? <Text style={styles.tailleBold}>CM</Text>  : <Text style={styles.taille}>CM</Text> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setConvertLong('Inch')}>
                { convertLong == 'Inch' ? <Text style={styles.tailleBold}>INCH</Text>  : <Text style={styles.taille}>INCH</Text> }
                </TouchableOpacity>
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

export default function CalibrateScreen({ navigation }) {

  // État pour gérer l'onglet actif
  const [index, setIndex] = React.useState(0);


  // Définir les routes pour les onglets
  const [routes] = React.useState([
    { key: "first", title: "Tailles" },
    { key: "second", title: "Mensuration" },
  ]);

    // Fonction pour rendre les scènes des onglets
  const renderScene = SceneMap({
    first: () => <PremierRoute />,
    second: () => <SecondRoute />, 
  });

  // Obtenir la largeur initiale de l'écran
  const initialLayout = { width: Dimensions.get("window").width };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.header}>
        <View style={styles.burgerIcon}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesome name={"bars"} size={40} color={"#25958A"} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.H1}>Calibrage Haut</Text>
        </View>
      </SafeAreaView>
      {/* Onglets */}
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "#FFFF", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#d95b33" }}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
      />
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
  H1: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  tabView: {
    marginTop: 10,
    width: "80%",
    borderRadius: 10,
  },
  premierRoute: {
    flex: 1,
    backgroundColor: "#FCFAF1",
    justifyContent: "space-around",
    alignItems: "center",
  },
  secondRoute: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FCFAF1",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 30,
  },
  containerInput: {
    flexDirection: 'column',
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
    backgroundColor: "#D6D1BD",
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
    color: "#707B81",
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
    color: "#707B81",
    padding: 15,
    fontWeight: "bold",
  },
  h3: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "700",
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
});