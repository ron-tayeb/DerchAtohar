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
    TextInput,
    ActivityIndicator,
    Modal,
    Platform, ScrollView
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import RNDateTimePicker from '@react-native-community/datetimepicker';


export default function AddMikve({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;
    const MapAPI = ""


    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const[city,setAdress] = useState("");
    const[neighborhood,setNeighborhood] = useState("");
    const[phone,setPhone] = useState();
    const[notes,setNotes] = useState();

    const [index1, setindx1] = useState();

    const [index0, setindx0] = useState('-');
    const [index2, setindx2] = useState('-');
    const [index3, setindx3] = useState('-');
    const [index4, setindx4] = useState('-');
    const [index5, setindx5] = useState('-');
    const [index6, setindx6] = useState('-');
    const [index7, setindx7] = useState('-');
    const [index8, setindx8] = useState('-');


    // =========================================
    const onChangeSummer = (event, selectedDate) => {
        let c = index1;
        if (selectedDate != undefined) {
            let hour = selectedDate.toString().substr(16, 2);;
            let minute = selectedDate.toString().substr(19, 2);
            let time = hour + ":" + minute
            if (c == 1) {
                setindx0(time)
                console.log('open summer')
            }
            else if (c == 2) {
                setindx2(time)
                console.log('close summer')
            }
            else if (c == 3) {
                setindx3(time)
                console.log('open winter')
            }
            else if (c == 4) {
                setindx4(time)
                console.log('close winter')
            }
            else if (c == 5) {
                setindx5(time)
                console.log('open holi')
            }
            else if (c == 6) {
                setindx6(time)
                console.log('close holi')
            }
            else if (c == 7) {
                setindx7(time)
                console.log('open sat')
            }
            else if (c == 8) {
                setindx8(time)
                console.log('close sat')
            }
            const currentDate = selectedDate || date;
            setShow(false);
            setDate(currentDate);
        }
        setShow(false);

    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showTimepicker = () => {
        showMode('time');
    };
    // =========================================


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
    const [modalLoadVisible, setModalLoadVisible] = useState(false);


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


    const AddMikve1 = async () => {
       
        let mikve = {
            Religious_Council: city,
            City: city,
            nobody: "",
            neighborhood: neighborhood,
            Phone: phone,
            Opening_Hours_Summer:`פתיחה:${index0} סגירה: ${index2}` ,
            Opening_Hours_Winter: `פתיחה:${index3} סגירה: ${index4}`,
            Opening_Hours_Holiday_Eve_Shabat_Eve:`פתיחה:${index5} סגירה: ${index6}` ,
            Opening_Hours_Saturday_Night_Good_Day:`פתיחה:${index7} סגירה: ${index8}` ,
            Accessibility:'',
            Schedule_Appointment:'',
            Notes:notes
        }
        setModalLoadVisible(!modalLoadVisible)
        await fetch(`${ServerApi()}/api/AddMikve`, {
            method: 'POST',
            body: JSON.stringify(mikve),
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
                if (JSON.stringify(result) == 1) {
                    Alert.alert("כל הכבוד", "הוספת מקווה בהצלחה")
                    navigation.goBack();
                }

            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בשרת אנא פנה למנהל מערכת")
                })
            setAdress("");
            setNeighborhood("");
            setPhone("");
            setNotes("");
            setindx0('-')
            setindx2('-')
            setindx3('-')
            setindx4('-')
            setindx5('-')
            setindx6('-')
            setindx7('-')
            setindx8('-')
        setChecked(!checked)
        setrenderScreen(true)
    }
    const userVal = () => {//וולידציה להרשמה שמפעילה את המטודה שמבצעת הרשמה
        if(city==''){
            Alert.alert("אופס", "כנראה שלא הכנסת ישוב , נסה שנית")
            setAdress("")
            return
        }
        if(neighborhood==''){
            Alert.alert("אופס", "כנראה שלא הכנסת שכונה , נסה שנית")
            setNeighborhood("")
            return 
        }
        else {
            AddMikve1();} 
    }
    const openingIndex = (x) => {
        if (x == 1) {
            setindx1(x)
        }
        else if (x == 2) {
            setindx1(x)
        }
        else if (x == 3) {
            setindx1(x)
        }
        else if (x == 4) {
            setindx1(x)
        }
        else if (x == 5) {
            setindx1(x)
        }
        else if (x == 6) {
            setindx1(x)
        }
        else if (x == 7) {
            setindx1(x)
        }
        else {
            setindx1(x)
        }
        showTimepicker();
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
                            marginBottom: "10%"
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

                <ScrollView keyboardShouldPersistTaps='always'
                    listViewDisplayed={false} >
                    {show && (
                        <RNDateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeSummer}
                        />
                    )}
                    <Text style={styles.text_footer}>ישוב</Text>
                    <View style={styles.action1}>
                        <FontAwesome5
                            name="city"
                            color="#FFF"
                            size={20}
                            style={{ paddingLeft: 10,marginTop:10 }}
                        />
                        <GooglePlacesAutocomplete
                            placeholder='הזן ישוב'
                            onPress={(data, details = null) => {
                                let adress = data.description
                                setAdress(adress)
                                
                            }}
                            query={{
                                key: MapAPI,
                                language: 'iw',
                                components: 'country:il',
                                type: "(cities)"
                            }}
                            enablePoweredByContainer={false}
                            fetchDetails={true}
                        />
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>שכונה</Text>
                        <View style={styles.action1}>
                            <MaterialCommunityIcons
                                name="home-group"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס שכונה..."
                                placeholderTextColor="#fff"
                                keyboardType='default'
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setNeighborhood}
                                value={neighborhood}

                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>פאלפון</Text>
                        <View style={styles.action1}>
                            <Feather
                                name="phone"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                            <TextInput
                                placeholder="הכנס פאלפון לתיאום..."
                                placeholderTextColor="#fff"
                                keyboardType="phone-pad"
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setPhone}
                                value={phone}

                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>הערות</Text>
                        <View style={styles.action1}>
                            <MaterialCommunityIcons
                                name="note"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10 }}
                            />
                             <TextInput
                                placeholder="הכנס הערות..."
                                placeholderTextColor="#fff"
                                keyboardType="default"
                                style={[styles.textInput, { textAlign: 'right' }]}
                                onChangeText={setNotes}
                                value={notes}

                            />
                        </View>
                    </View>
                    <View style={{}}>
                        <Text style={styles.text_footer}>שעות פתיחה בקיץ</Text>
                        <View style={styles.action}>
                            <Feather
                                name="clock"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10, marginTop: 6 }}
                            />
                            <TouchableOpacity onPress={() => openingIndex(1)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת פתיחה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openingIndex(2)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת סגירה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{}}>
                        <Text style={styles.text_footer}>שעות פתיחה בחורף</Text>
                        <View style={styles.action}>
                            <Feather
                                name="clock"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10, marginTop: 6 }}
                            />
                            <TouchableOpacity onPress={() => openingIndex(3)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת פתיחה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openingIndex(4)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת סגירה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{}}>
                        <Text style={styles.text_footer}>שעות פתיחה בשבתות וחגים</Text>
                        <View style={styles.action}>
                            <Feather
                                name="clock"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10, marginTop: 6 }}
                            />
                            <TouchableOpacity onPress={() => openingIndex(5)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת פתיחה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openingIndex(6)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת סגירה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{}}>
                        <Text style={styles.text_footer}>שעות פתיחה במוצאי שבת וימים טובים</Text>
                        <View style={styles.action}>
                            <Feather
                                name="clock"
                                color="#FFF"
                                size={20}
                                style={{ paddingLeft: 10, marginTop: 6 }}
                            />
                            <TouchableOpacity onPress={() => openingIndex(7)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת פתיחה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openingIndex(8)}>
                                <View style={[styles.button, { width: 150, }]} >
                                    <LinearGradient
                                        colors={['#fff', "#fff"]}
                                        style={[styles.logina111, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,

                                            elevation: 5,

                                        }]}>
                                        <Text style={[styles.textlogin, { textAlign: 'center', fontSize: 12 }]}>שעת סגירה </Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => { userVal() }}>
                        <View style={[styles.button, { marginTop: 30, marginBottom: 80 }]} >
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
                                <Text style={[styles.textlogin1, {}]}>          הוסף מקווה          </Text>
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
                </ScrollView>
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
        marginTop: 15,

        paddingBottom: 0,
        marginLeft: 50,
        marginRight: 30,
    },
    action1: {
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
        justifyContent: 'flex-end',

    },
    logina: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 180,

    },
    logina11: {
        padding: 5,
        borderRadius: 7,
    },
    logina1: {
        padding: 10,
        marginRight: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        marginLeft: '5%'
    },
    logina111: {

        padding: 2,
        marginRight: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: '5%'
    },
    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#282E68",
    },
    textlogin1: {
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


