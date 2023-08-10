import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PagerView from 'react-native-pager-view';
import PageOne from './tuto/TutoPageOne';
import PageTwo from './tuto/TutoPageTwo';
import PageThree from './tuto/TutoPageThree';
import PageFour from './tuto/TutoPageFour';

export default function TutorialScreen({navigation}) {
    const [activePage, setActivePage] = useState(0)
    const token = useSelector((state) => state.user.value.token)
    console.log(token)
  return (
    <View style={styles.container}>

        <PagerView style={styles.pagerView} initialPage={0} onPageSelected={(event) => {
          setActivePage(event.nativeEvent.position);
        }}>
        <View key="1">
            <PageOne />
        </View>
        <View key="2">
            <PageTwo />
        </View>
        <View key="3">
            <PageThree />
        </View>
        <View key="4">
            <PageFour />
        </View>
        </PagerView>
        <View style={styles.indicatorContainer}>
        <View style={styles.indicatorContainerView}>
        {[0, 1, 2, 3].map((i) => (
        <View
            key={i}
            style={[
            styles.indicator,
            i === activePage ? styles.activeIndicator : null,
            ]}
        />
        ))}
        </View>
        <TouchableOpacity onPress={() => token ? navigation.navigate("HomeStack") : navigation.navigate("SignIn")}>
        <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>  
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#FCFAF1"
    },
    pagerView: {
        flex: 1,
    },
    skipButton: {
        fontWeight: 'bold', 
        color: '#D95B33', 
        borderBottomWidth: 2,
        borderColor:'#D95B33'   
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 50,
        backgroundColor: "#FCFAF1"
      },
      indicatorContainerView: {
        flexDirection:'row'
      },
      indicator: {
        width: 20,
        height: 12,
        borderRadius: 50,
        backgroundColor: '#D6D1BD',
        marginHorizontal: 5,
      },
      activeIndicator: {
        backgroundColor: '#D95B33',
      },
});