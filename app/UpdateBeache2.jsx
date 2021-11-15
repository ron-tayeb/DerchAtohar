import React, { Component, useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Dimensions,
    Modal,
    TextInput, ActivityIndicator
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';


export default function UpdateBeache2({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;

    const [renderScreen, setrenderScreen] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);
    const [modalLoadVisible, setModalLoadVisible] = useState(false);

    const [name, setName] = useState(null);
    const [gander, setGander] = useState(null);
    const [opemimgHours, setopemimgHours] = useState(null);
    const [address, setAddress] = useState(null);
    const [price, setPrice] = useState(null);
    const [district, setDistrict] = useState(null);
    const [beacheCode, setBeachCode] = useState();


    const pickerRef = useRef();
    function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }
    const storeData = async (key, value) => {//פונציקה לאחסנת מידע באסיינסטורג
        console.log(`value`, value)
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
            console.log("ok")
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פונקציה לקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פונקציה למחיקת מידע מהאסיינסטורג
        try {
            await AsyncStorage.removeItem(key)
            console.log(`true`)
        } catch (e) {
            console.log(`e`, e)
        }
        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://proj3.ruppin-tech.co.il`
        return api
    }
    
    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus',async () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            let beache = route.params.item
            setName(beache.Name)
            setopemimgHours(beache.opemimgHours)
            setDistrict(beache.District)
            setPrice(beache.Payment)
            setAddress(beache.Address)
            setGander(beache.MenOrWomen)
            setBeachCode(beache.BeachesCode)

        });
        return unsubscribe
    })


  
    useEffect(() => {
        setrenderScreen(false)
    }, [renderScreen])

    const updateBeache1 = async () => {
        if (checkDeitles()) {
            let beache = {
                Name: name,
                OpemimgHours: opemimgHours,
                MenOrWomen: gander,
                Address: address,
                Payment: price,
                District: district,
                BeachesCode:beacheCode
            }
            console.log(`beache`, beache)
            setModalLoadVisible(!modalLoadVisible)
            await fetch(`${ServerApi()}/api/UpdateBeache`, {
                method: 'POST',
                body: JSON.stringify(beache),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    return res.json()
                })
                .then((result) => {
                    console.log("fetch POST", result)
                    setModalLoadVisible(false)
                    if (result=="Beache update"||result.isOk) {
                        Alert.alert("ברכות", "החוף עודכן ")
                    }
                    else {
                        Alert.alert("אופס", "קרתה טעות בעת העלאת החוף אנא נסה שוב ")
                    }
                },
                    (error) => {
                        console.log("err POST=", error)
                        Alert.alert("אופס", "קרתה טעות בעת העלאת הבריכה אנא נסה שוב ")
                    })
            setName("");
            setPrice("");
            setopemimgHours("");
            setAddress("");
            setGander("");
            setDistrict("")         
        }
        else {
            return
        }

    }
    const checkDeitles = () => {
        if (name == null) {
            Alert.alert("אופס", "חסרים פרטים אנא השלם אותם ונסה שנית")
            setName('')
            return false
        }

        if (district == '') {
            Alert.alert("אופס", "אנא בחר מחוז")
            return false
        }
        if (address == null) {
            Alert.alert("אופס", "אנא הוסף רחוב")
            setDesc(null)
            return false
        }
        else { return true }
    }

    return (
        <View style={{ backgroundColor: "#FFF", height: '100%' }}>
            <ImageBackground source={require('../assets/test.png')} resizeMode="cover" style={{
                flex: 1,
                resizeMode: "cover",
            }} >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Feather
                            name="menu"
                            size={30}
                            style={styles.menu}
                        />
                    </TouchableOpacity>
                    <Image
                        source={require('../assets/logos/32.png')}
                        resizeMode='contain'
                        style={{
                            marginTop: 50,
                            width: '55%',
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

                <View>
                  
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>שם החוף</Text>
                        <View style={styles.action}>
                            <MaterialIcons
                                name="location-city"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס שם..."
                                placeholderTextColor="#fff"
                                keyboardType="email-address"
                                style={styles.textInput}
                                // onChangeText={(text) => setName(text)}
                                onChangeText={setName}
                                value={name}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>כתובת</Text>
                        <View style={styles.action}>
                            <MaterialCommunityIcons
                                name="home-group"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס כתובת..."
                                placeholderTextColor="#fff"
                                keyboardType="email-address"
                                style={styles.textInput}
                                // onChangeText={(text) => setName(text)}
                                onChangeText={setAddress}
                                value={address}
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>תשלום</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="shekel"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="...הכנס מחיר"
                                keyboardType='numeric'
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setPrice}
                                value={price}
                                placeholderTextColor="#fff"
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>שעות פתיחה</Text>
                        <View style={styles.action}>
                            <MaterialCommunityIcons
                                name="clock-outline"
                                color="#FFF"
                                size={30}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="...הכנס שעות פתיחה גברים/נשים"
                                placeholderTextColor="#fff"
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setopemimgHours}
                                value={opemimgHours}

                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>מגדר</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="phone"
                                color="#FFF"
                                size={30}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס מגדר - פרטי נשים/גברים..."
                                
                                placeholderTextColor="#fff"
                                style={styles.textInput}
                                onChangeText={setGander}
                                value={gander}
                            />
                        </View>
                    </View>
                    <View style={{}}>
                    <Text style={[styles.text_footer,]}>קטגוריה</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <Picker
                            style={{
                                justifyContent: 'space-between', flex: 8, marginRight: 260,color:'#fff'}}
                            ref={pickerRef}
                            selectedValue={district}
                            onValueChange={(itemValue, itemIndex) =>
                                setDistrict(itemValue)
                            }>
                            <Picker.Item label="בחר" value=""  />
                            <Picker.Item label="צפון" value="צפון" />
                            <Picker.Item label="דרום" value="דרום" />
                            <Picker.Item label="מרכז" value="מרכז" />
                        </Picker>
                    </View>

                </View>

                    
                    <TouchableOpacity onPress={() => { updateBeache1() }}>
                        <View style={[styles.button, { marginTop: 30, }]} >
                            <LinearGradient
                                colors={['#063496', "#59AFFA"]}
                                style={[styles.logina, {
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,

                                }]}>
                                <Text style={[styles.textlogin, { color: "#fff" }]}>          ערוף חוף          </Text>
                            </LinearGradient >
                        </View>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
            <Modal
                transparent={true}
                animationType={'none'}
                visible={modalLoadVisible}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            size="large"
                            color='#282E68' />
                    </View>
                </View>
            </Modal>
        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    textInput: {
        textAlign: 'right',
        flex: 1,
        paddingLeft: 10,
        color: "#fff",
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },

    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        paddingBottom: 0,
        marginLeft: 30,
        marginRight: 30,
    },
    text_footer: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 25,
        fontWeight: "bold",
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
    textPM: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    logina: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 180,

    },
    logina1: {
        padding: 10,
        marginRight: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 180,
        marginLeft: '5%'
    },

    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#282E68",
    },
    modalView: {
        justifyContent: 'space-between',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginTop: '50%',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 10,
        padding: 10,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontWeight: 'bold', fontSize: 17, color: "#9A7759"
    },

})


