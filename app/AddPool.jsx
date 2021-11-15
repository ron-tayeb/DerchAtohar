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


export default function AddPool({ navigation, props }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;

    const [renderScreen, setrenderScreen] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);
    const [modalLoadVisible, setModalLoadVisible] = useState(false);

    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [city, setCity] = useState(null);
    const [opemimgHours, setopemimgHours] = useState(null);
    const [address, setAddress] = useState(null);
    const [image, setImage] = useState(null);
    const [Phone, setPhone] = useState(null);
    const [TypeImg, setTypeImg] = useState(null);

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
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        setrenderScreen(false)
    }, [renderScreen])



    const pickImage = async () => { // לוקחת תמונה מהגלריה 
        setModalVisible(!modalVisible);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });//שמירת התמונה כבייס64
            setImage(base64);
            let x = result.uri
            getTypeImg(x)
        }
    };
    const takeImage = async () => {// גישה לצילום תמונה ממצלמת המכשיר
        setModalVisible(!modalVisible);
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })
        console.log(result)
        if (!result.cancelled) {
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });//שמירת התמונה כבייס64
            setImage(base64);
            let x = result.uri
            getTypeImg(x)
        }
    };
    const getTypeImg = (x) => {//בדיקת סוג התמונה
        let y = /[.]/.exec(x) ? /[^.]+$/.exec(x) : undefined
        setTypeImg(y)
    };
    const addProduct = async () => {
        if (checkDeitles()) {
            let product = {
                base64: image,
                imgType: TypeImg[0],
                nameImg: "pool",
                Name: name,
                OpemimgHours: opemimgHours,
                MenOrWomen: '',
                Address: address,
                Payment: price,
                PhoneNumber: Phone,
                District: city,
            }
            
            setModalLoadVisible(!modalLoadVisible)
            await fetch(`${ServerApi()}/api/addPool`, {
                method: 'POST',
                body: JSON.stringify(product),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    return res.json()
                })
                .then((result) => {
                    console.log("fetch POST", JSON.stringify(result))
                    setModalLoadVisible(false)
                    if (result.isOk) {
                        Alert.alert("ברכות", "הבריכה הועלתה לתפריט")
                    }
                    else {
                        Alert.alert("אופס", "קרתה טעות בעת העלאת הבריכה אנא נסה שוב ")
                    }
                },
                    (error) => {
                        console.log("err POST=", error)
                        Alert.alert("אופס", "קרתה טעות בעת העלאת הבריכה אנא נסה שוב ")
                    })
            console.log(`start`)

            setName("");
            setPrice("");
            setCity("");
            setopemimgHours("");
            setAddress("");
            setImage("");
            setPhone("");
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

        if (city == null) {
            Alert.alert("אופס", "אנא בחר עיר")
            return false
        }
        if (address == null) {
            Alert.alert("אופס", "אנא הוסף רחוב")
            setDesc(null)
            return false
        }
        if (image == null) {
            Alert.alert("אופס", "אנא הוסף תמונה")
            return false
        }
        if (TypeImg == null) {
            Alert.alert("אופס", "אנא הוסף תמונה")
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
                        source={require('../assets/logos/29.png')}
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
                    <View style={{}}>
                        <Text style={styles.text_footer}>עיר</Text>
                        <View style={styles.action}>
                            <MaterialIcons
                                name="location-city"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס עיר..."
                                keyboardType="email-address"
                                placeholderTextColor="#fff"
                                style={styles.textInput}
                                // onChangeText={(text) => setName(text)}
                                onChangeText={setCity}
                                value={city}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>שם הבריכה</Text>
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
                        <Text style={styles.text_footer}>רחוב</Text>
                        <View style={styles.action}>
                            <MaterialCommunityIcons
                                name="home-group"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס רחוב..."
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
                        <Text style={styles.text_footer}>מספר פאלפון</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="phone"
                                color="#FFF"
                                size={30}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס מספר לתיאום..."
                                keyboardType='numeric'
                                placeholderTextColor="#fff"
                                style={styles.textInput}
                                onChangeText={setPhone}
                                value={Phone}
                            />
                        </View>
                    </View>

                    < TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }}>
                        <View>
                            <LinearGradient
                                colors={['#fff', "#fff"]}
                                style={[styles.logina1, { flexDirection: 'row' }]}>
                                <FontAwesome
                                    name="picture-o"
                                    color="#282E68"
                                    size={30}
                                    style={{ paddingLeft: 10 }}
                                />
                                <Text style={styles.textlogin}>הוסף תמונה</Text>
                            </LinearGradient >
                        </View>
                    </TouchableOpacity >
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{ fontWeight: 'bold', fontSize: 24, color: "#282E68", marginBottom: 20 }}>בחר אפשרות העלאה:</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    < TouchableOpacity onPress={pickImage}>
                                        <View>
                                            <LinearGradient
                                                colors={['#063496', "#59AFFA"]}
                                                style={[styles.logina,]}>
                                                <Text style={[styles.textlogin, { color: '#FFF' }]}>הוספה מגלריה</Text>
                                            </LinearGradient >
                                        </View>
                                    </TouchableOpacity >
                                    < TouchableOpacity onPress={() => { takeImage() }}>
                                        <View>
                                            <LinearGradient
                                                colors={['#063496', "#59AFFA"]}
                                                style={[styles.logina, { marginLeft: 10 }]}>
                                                <Text style={[styles.textlogin, { color: '#FFF' }]}>צילום תמונה</Text>
                                            </LinearGradient >
                                        </View>
                                    </TouchableOpacity >
                                </View>
                                < TouchableOpacity onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                    <View>
                                        <LinearGradient
                                            colors={['#063496', "#59AFFA"]}
                                            style={[styles.logina, { marginLeft: 10, marginTop: 25 }]}>
                                            <Text style={[styles.textlogin, { color: '#FFF' }]}>הסתר חלון</Text>
                                        </LinearGradient >
                                    </View>
                                </TouchableOpacity >

                            </View>

                        </View>
                    </Modal>
                    <TouchableOpacity onPress={() => { addProduct() }}>
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
                                <Text style={[styles.textlogin, { color: "#fff" }]}>          הוסף בריכה          </Text>
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


