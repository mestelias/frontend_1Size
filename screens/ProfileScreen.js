import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ProfileScreen() {

  const navigation = useNavigation(); 

  return (
    <View style={styles.background}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity                     
                onPress={() => navigation.openDrawer()}>
                <FontAwesome 
                  name={'bars'} 
                  size={40} 
                  color={'#25958A'}
                  />
            </TouchableOpacity>
            <Text>ProfileScreen</Text>
          </View>

          <Text>
            Profil
          </Text>
          <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          //AJOUTER LA FONCTIONNALITE POUR SAUVEGARDER LES INPUTS DE PROFIL
          // onPress={()=> }
          >
            <Text style={styles.textButton}>Sauvegarder</Text>
          </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF1',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  background: {
    flex: 1,
    backgroundColor: '#d6d1bd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  button: {
    alignItems: 'center',
    paddingTop: 8,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#D6D1BD',
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
    color: '#707B81',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
});
