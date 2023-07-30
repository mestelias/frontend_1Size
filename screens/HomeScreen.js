import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen({navigation}) {


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
                <Text>HomeScreen</Text>
            </View>
            <Text style={styles.titreH1}>Recherche ton vêtement</Text>

            <TouchableOpacity 
             style={styles.button} 
             activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Continuer</Text>
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
  titreH1: {
    top: 106,
    fontSize: 24,
    fontWeight: '600',

  },
  button: {
    alignItems: 'center',
    paddingTop: 8,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#d95b33',
    borderRadius: 10,
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
    color: '#FFFF',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
});
