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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';




export default function DelBeache({ navigation, route }) {

    const [menuInSrartApp, setMenu] = useState(false)// בדיקה איזה מנות להציג בעת הפעלת האפליקציה
    const [render, setRender] = useState(false)
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
    const GetMenu = async (District) => { // משיכת התוכן לפי קטגוריה
        fetch(`${ServerApi()}/api/GetBeaches`, {
            method: 'POST',
            body: JSON.stringify(District),
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
    const deleteBeache = async (item) => {//מחיקת משתמש
        let BeacheCode = item.BeachesCode
        await fetch(`${ServerApi()}/api/DeleteBeache`, {
            method: 'POST',
            body: JSON.stringify(BeacheCode),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log("fetch POST=", result)
                Alert.alert("ברכות", "חוף זה הוסר בהצלחה")
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת מחיקת החוף אנא נסה שוב מאוחר יותר")
                })
        setRender(true)

    }
    useEffect(() => {
        GetMenu('צפון')
        setRender(false)       
    }, [render])


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
                        source={require('../assets/logos/40.png')}
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
                    <TouchableOpacity onPress={() => { GetMenu('צפון') }}>
                        <Image
                            source={require('../assets/11.png')}
                            resizeMode="contain"
                            style={{
                                width: 100,
                                height: 100,
                                marginLeft:20,
                                transform: [{scaleX: 1.7}, {scaleY: 1.7}]

                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { GetMenu('מרכז') }}>
                        <Image
                            source={require('../assets/22.png')}
                            resizeMode="contain"
                            style={{
                                width: 100,
                                height: 100,
                               
                                transform: [{scaleX: 1.7}, {scaleY: 1.7}]
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { GetMenu('דרום') }}>
                        <Image
                            source={require('../assets/33.png')}
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
                {/* הצגת חופים */}
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
                                    <Text style={{ marginLeft: 15, marginTop: 2, color: '#0A268F', fontWeight: 'bold', fontSize: 17, }}>{item.Name}</Text>
                                    <Text style={styles.desc}>מגדר: {item.MenOrWomen} </Text> 
                                    <Text style={styles.desc}>שעות פתיחה: {item.opemimgHours} </Text>
                                    <Text style={styles.desc}>כתובת: {item.Address} </Text>
                                    <Text style={styles.desc}>מחיר: {item.Payment} </Text>
                                    <TouchableOpacity style={styles.price} onPress={() => deleteBeache(item)}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 13, color: "#FFF" }}><MaterialCommunityIcons
                                                name="delete"
                                                size={20}
                                                color={"#FFF"}
                                            />מחק </Text>
                                        </View>
                                    </TouchableOpacity>
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
     price: {

        position: 'relative',
        marginLeft: "71.7%",
        height:50,
        marginBottom:-1,
        width: 100,
        backgroundColor: "red",
        borderBottomRightRadius: 18,
        borderTopLeftRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

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
