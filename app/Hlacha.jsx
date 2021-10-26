import React, { Component, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';





export default function Hlacha({ navigation, route }) {

    const [menuInSrartApp, setMenu] = useState(false)// בדיקה איזה מנות להציג בעת הפעלת האפליקציה

    const [item, setitem] = useState([ //מנות קבועות בעת הפעלת האפליקציה
    ]);

    const storeData = async (key, value) => {//פעולה המאחסנת באסיינסטורג מידע
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פעולה המקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פעולה המוחקת מידע מהאסיינסטורג
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            // remove error
        }

        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://proj3.ruppin-tech.co.il`
        return api
    }
    useEffect(() => {//רינדור הדף והאזנה לכניסה מחדש לאותו מסך
        const unsubscribe = navigation.addListener('focus', () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            GetMenu('x')
        });

        return unsubscribe
    }, [])
    const GetMenu = async (category) => { // משיכת התוכן לפי קטגוריה
        fetch(`${ServerApi()}/api/getHlacha`, {
            method: 'POST',
            body: JSON.stringify(category),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                setitem(result)
                setMenu(true)

            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                })


    }



    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/test.png')} resizeMode="cover" style={styles.image} >
                {/* המבורגר , לוגו , עגלת קניות */}
                <View style={styles.header}>

                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Feather
                            name="menu"
                            size={30}
                            style={styles.menu}
                        />
                    </TouchableOpacity>
                    <Image
                        source={require('../assets/logos/16.png')}
                        resizeMode='contain'
                        style={{
                            marginTop: 70,
                            width: '50%',
                            height: 90,
                        }}
                    />
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            style={styles.shoppingCart}
                        />
                    </TouchableOpacity>
                </View>
                {/* קטגוריות */}
                <View style={styles.catgor}>
                    <TouchableOpacity onPress={() => { GetMenu('forWomen') }}>
                        <Image
                            source={require('../assets/1.png')}
                            resizeMode="contain"
                            style={{
                                width: 100,
                                height: 100,
                                marginLeft:20,
                                transform: [{scaleX: 1.7}, {scaleY: 1.7}]

                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { GetMenu('tfilaWomen') }}>
                        <Image
                            source={require('../assets/5.png')}
                            resizeMode="contain"
                            style={{
                                width: 100,
                                height: 100,
                               
                                transform: [{scaleX: 1.7}, {scaleY: 1.7}]
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { GetMenu('tfilaMen') }}>
                        <Image
                            source={require('../assets/4.png')}
                            resizeMode='contain'
                            style={{
                                width: 100,
                                height: 100,
                                marginRight:20,
                                transform: [{scaleX: 1.7}, {scaleY: 1.7}]
                            }}
                        />
                    </TouchableOpacity>
                </View>
                {/* הצגת הלכות */}
                <ScrollView style={{ marginBottom: 20 }}>
                    {item.map((item, index) => (
                        <View key={index}>
                            <View>
                                <View style={{
                                    backgroundColor: "#FFF",
                                    width: "92%",

                                    marginRight: 15,
                                    marginLeft: 15,
                                    borderRadius: 18,
                                    margin: 15,
                                }}>
                                    <Text style={{ marginLeft: 15, marginTop: 2, color: '#0A268F', fontWeight: 'bold', fontSize: 16, }}>{item.Title}</Text>
                                    <Text style={styles.desc}>{item.Content} </Text>
                                </View>
                            </View>

                        </View>
                    ))}</ScrollView>
            </ImageBackground>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    menu: {
        marginTop: 50,
        color: '#FFF',
    },
    shoppingCart: {
        marginTop: 50,
        color: '#FFF'
    },
    cotert: {
        marginLeft: 45,
        fontSize: 30,
    },
    catgor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop:20
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "flex-start"
    },

    desc: {
        fontWeight: 'bold', fontSize: 13, color: "black",
        marginLeft: 15,
        marginTop: 3,
        marginBottom: 4,
        marginRight: 5

    },
    name: {
        fontWeight: 'bold', fontSize: 20, color: "#9A7759",
        marginLeft: 20,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    userlogin: {
        fontWeight: 'bold', fontSize: 22, color: "#9A7759",
        marginLeft: 20,
    }


})
