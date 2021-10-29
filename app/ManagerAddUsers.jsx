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
    TextInput
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function ManagerAddUsers({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;

    const [renderScreen, setrenderScreen] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);


    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [conPass, setConPass] = useState(null);
    const [type, setType] = React.useState('user');
    const [checked, setChecked] = React.useState('');

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
        setrenderScreen(false)
    }, [renderScreen])

    const registerForPushNotificationsAsync= async ()=> {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        return token;
    }



    const addCustomer = async () => {
        let token = await registerForPushNotificationsAsync()
        let user = {
            Name: name,
            Email: email,
            Password: password,
            token:token,
            type: type
        }
        console.log("user",user)
        await fetch(`${ServerApi()}/api/createNewuser`, {
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
                console.log("fetch POST", JSON.stringify(result))
                if (JSON.stringify(result) == 1) {
                    Alert.alert("כל הכבוד", "הרשמת לקוח בוצעה בהצלחה")
                    navigation.goBack();
                }
                else {
                    Alert.alert("אופס", "אימייל זה קיים במערכת אנא נסה שוב")
                }



            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בשרת אנא פנה למנהל מערכת")
                })
        setName("")
        setEmail("")
        setPassword("")
        setConPass("")
        setType("user")
        setChecked(!checked)
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
                        source={require('../assets/logos/16.png')}
                        resizeMode='contain'
                        style={{
                            marginTop: 100,
                            width: '55%',
                            height: 90,
                            marginBottom:"10%"
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
                                placeholderTextColor="#fff"
                                keyboardType='email-address'
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
                        <Text style={styles.text_footer}>אימות סיסמא</Text>
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
                                style={styles.textInput}
                                onChangeText={setConPass}
                                value={conPass}
                                secureTextEntry={true}
                            />
                        </View>
                        <Text style={[styles.text_footer,{marginTop:'8%'}]}>מנהל מערכת</Text>
                        <View style={{marginLeft:'5%',marginTop:'0%'}}>
                            
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked);
                                    setType(!checked ? 'admin':'user')
                                }}
                                color={"#FFF"}
                                uncheckedColor={"#FFF"}
                                
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
                                <Text style={styles.textlogin}>          הוסף לקוח          </Text>
                            </LinearGradient >
                        </View>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    textInput: {
        textAlign: 'right',
        flex: 1,
        color: "#fff",
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


