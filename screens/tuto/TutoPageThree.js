import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function PageThree() {
    return (
        <View style={styles.background}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.H1}>Je suis la page 3</Text>
                    <View style={styles.border}></View>
                </View>
            </View>
        </View>
        )
    }
    
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#FCFAF1",
        alignItems: "center",
        width: "100%",
        height: "100%",
        },
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#FCFAF1"
    },
    border: {
        paddingHorizontal: 35, 
        borderBottomWidth:3,
        borderBottomColor: '#d95b33', 
        borderRadius: 50,
    },
    titleContainer: {
        alignItems: "center",
        backgroundColor: "#fcfaf1",
        marginTop: 30,
    },
    H1: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        },
})