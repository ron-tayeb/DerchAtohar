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
    TextInput,
    ActivityIndicator,

} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function ManagerAddCustomer({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;

    const [renderScreen, setrenderScreen] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);

    const [modalLoadVisible, setModalLoadVisible] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [conPass, setConPass] = useState(null);
    const [id, setID] = useState()


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
    const ServerApi = () => { // כתובת שרת
        const api = `http://proj3.ruppin-tech.co.il`
        return api
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            let user = route.params.item
            setID(user.CustomersCode)
            setName(user.Name)
            setEmail(user.Email)
            setPassword(user.Password)
            setConPass(user.Password)

        });
        return unsubscribe
    })

    useEffect(() => {
        setrenderScreen(false)
    }, [renderScreen])



    const addCustomer = async () => {
        let user = {
            Name: name,
            Email: email,
            Password: password,
            CustomersCode: id
        }
        setModalLoadVisible(!modalLoadVisible)
        await fetch(`${ServerApi()}/api/UpdateCustomers`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res=', JSON.stringify(res))
                return res.json()
            })
            .then((result) => {
                setModalLoadVisible(false)
                console.log("fetch POST", JSON.stringify(result))
                Alert.alert("כל הכבוד", "עדכון שליח בוצע בהצלחה")
                navigation.navigate("loginScreen")
            },
                (error) => {
                    console.log("err POST=", error)
                })
        setName("")
        setEmail("")
        setPassword("")
        setConPass("")
        setrenderScreen(true)
    }
    const userVal = () => {//וולידציה להרשמה שמפעילה את המטודה שמבצעת הרשמה
        var emailregex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // שימוש בריגיקס
        var pasRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        if (!(emailregex.test(email))) {
            Alert.alert("אופס", "האימל שהוכנס לא תואם לפורמט אנא נסה בפורמט הבא: name@example.com")
            setEmail("")
            return
        }
        if (!(pasRegex.test(password))) {
            Alert.alert("אופס", "הסיסמה צריכה להכיל לפחות: 8 תווים , אות גדולה , אות קטנה ,תו , ומספר")
            setPassword("")
            setConPass("")
            return
        }
        if (password !== conPass) {
            Alert.alert("אופס", "הסיסמאות לא זהות , אנא נסה שוב")
            setPassword("")
            setConPass("")
            return
        }
        else {
            addCustomer();
        }

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
                        source={require('../assets/logos/31.png')}
                        resizeMode='contain'
                        style={{
                            marginTop: 50,
                            width: '55%',
                            height: 90,
                            marginTop: '25%'
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
                        <Text style={styles.text_footer}>שם</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס שם..."
                                placeholderTextColor="#fff"
                                style={styles.textInput}
                                onChangeText={setName}
                                value={name}
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>אימייל</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס אימייל..."
                                keyboardType='email-address'
                                placeholderTextColor="#fff"
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setEmail}
                                value={email}

                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>סיסמא</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס סיסמא..."
                                placeholderTextColor="#fff"
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry={true}

                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>אמת סיסמא</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"

                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס סיסמא שוב..."
                                placeholderTextColor="#fff"
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setConPass}
                                value={conPass}
                                secureTextEntry={true}

                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { userVal() }}>
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
                                <Text style={styles.textlogin}>          ערוך לקוח          </Text>
                            </LinearGradient >
                        </View>
                    </TouchableOpacity>
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

                </View>
            </ImageBackground>
        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

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
        borderBottomColor: '#FFF',
        paddingBottom: 0,
        marginLeft: 30,
        marginRight: 30,
    },
    textInput: {
        textAlign: 'right',
        flex: 1,
        color: "#fff",
    },
    text_footer: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 25,
        fontWeight: "bold",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    menu: {
        marginTop: 50,
        color: '#fff',

    },
    shoppingCart: {
        marginTop: 50,
        color: '#fff'
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
        borderRadius: 18,

    },
    logina1: {
        padding: 10,
        marginRight: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        marginLeft: '5%'
    },

    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#FFF",
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


