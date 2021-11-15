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
import Geocoder from 'react-native-geocoding';




export default function UpdatePool({ navigation, route }) {

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
    const GetMenu = async () => { // משיכת התוכן לפי קטגוריה
        fetch(`${ServerApi()}/api/GetPools`, {
            method: 'GET',
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

    const updatePool = (item) => {
        navigation.navigate("UpdatePool2Screen", { item })
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
                        source={require('../assets/logos/34.png')}
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
                <ScrollView style={{ marginBottom: 20 }}>
                    {item.map((item, index) => (
                        <View key={index}>
                            <View>
                                <View style={{
                                    backgroundColor: "#FFF",
                                    width: "92%",
                                    height: 200,
                                    marginRight: 15,
                                    marginLeft: 15,
                                    borderTopLeftRadius: 18,
                                    borderTopRightRadius: 18,
                                    marginTop: 40,
                                    margin: -30
                                }}>

                                    {/* <Image  source={{ uri: `${item.image}?t=${Date.now()}}`}} resizeMode='cover' style={{flex:1,borderRadius:18,width:'100%'}} ></Image> */}
                                    <Image source={{ uri: `${item.image}` }} resizeMode='cover' style={{ flex: 1, borderRadius: 18, width: '100%' }} ></Image>
                                </View>
                                <View style={{
                                    backgroundColor: "#FFF",
                                    width: "92%",
                                    borderBottomLeftRadius: 18,
                                    borderBottomRightRadius: 18,
                                    marginRight: 15,
                                    marginLeft: 15,

                                    margin: 15,
                                }}>
                                    <Text style={{ marginLeft: 15, marginTop: 2, color: '#0A268F', fontWeight: 'bold', fontSize: 17, }}>{item.District}</Text>
                                    <Text style={styles.desc}>שם: {item.Name} </Text>
                                    <Text style={styles.desc}>מגדר: {item.MenOrWomen} </Text>
                                    <Text style={styles.desc}>שעות פתיחה: {item.OpemimgHours} </Text>
                                    <Text style={styles.desc}>כתובת: {item.Address} </Text>
                                    <Text style={styles.desc}>מחיר: {item.Payment} </Text>
                                    <TouchableOpacity style={styles.price} onPress={() => updatePool(item)}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 13, color: "#FFF",marginTop:-4  }}><MaterialIcons
                                                name="pool"
                                                size={20}
                                                color={"#FFF"}
                                            />  ערוך בריכה</Text>
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
        height: 50,
        marginBottom: -1,
        width: 100,
        backgroundColor: "green",
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
        marginTop: 20
    },
    image: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
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
