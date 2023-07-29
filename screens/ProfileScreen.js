import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ProfileScreen({ navigation }) {

  const nav = useNavigation(); 

  return (
    <View style={styles.background}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity                     
                onPress={() => nav.openDrawer()}>
                  <FontAwesome 
                  name={'bars'} 
                  size={40} 
                  color={'#25958A'}
                  />
            </TouchableOpacity>
          </View>
          <Text>ProfileScreen</Text>
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
    backgroundColor: '#d6d1bd',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  background: {
    flex: 1,
    backgroundColor: '#d6d1bd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: 15,
    paddingLeft: 20,
  },
  button: {
    alignItems: 'center',
    paddingTop: 8,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#d95b33',
    borderRadius: 10,
    marginBottom: 80,
  },
  textButton: {
    color: '#ffffff',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
});
