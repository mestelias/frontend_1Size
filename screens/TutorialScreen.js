import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import PagerView from 'react-native-pager-view';
import PageOne from './tuto/TutoPageOne';
import PageTwo from './tuto/TutoPageTwo';
import PageThree from './tuto/TutoPageThree';
import PageFour from './tuto/TutoPageFour';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function TutorialScreen({navigation}) {
    const [activePage, setActivePage] = useState(0)
    const token = useSelector((state) => state.user.value.token)
    console.log(token)
  return (
    <View style={styles.container}>
                  <View style={styles.donutContainer}>
                <Image
                    source={require('../assets/Donut.png')}
                    style={styles.donutImage}
                />
            </View>

            {/* "1 Size" text */}
            <Text style={styles.logo}>
                <Text style={{ color: '#d95b33' }}>1</Text>
                <Text style={{ color: '#25958a' }}>Size</Text>
            </Text>
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
        <TouchableOpacity style={styles.skipButton} onPress={() => token ? navigation.navigate("HomeStack") : navigation.navigate("SignIn")}>
        <FontAwesome name='home' size={40} color='#D95B33'/>
        </TouchableOpacity>  
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#FCFAF1",
        height: "50%"
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
      logo: {
        textAlign: 'left',
        fontSize: 45,
        marginLeft: 40,
        marginTop: 70,
        fontFamily: 'Outfit',
    },
    donutContainer: {
      position: 'absolute',
      top: -160,
      right: -170,
      zIndex: 1, 
      overflow: 'visible',
    },
    donutImage: {
        width: 400,
        height: 400,
    },
});