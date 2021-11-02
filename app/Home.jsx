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
    Modal,
    Linking
} from "react-native";
import MapViewDirections from 'react-native-maps-directions';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getDistance, getPreciseDistance } from 'geolib';
import { set } from "react-native-reanimated";


export default function Home({ navigation, route }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [origin, setOrigin] = useState(null)
    const [Adress, setAdress] = React.useState(""); //שמירת כתובת 
    const [destination, setDestination] = useState(null);//מאתר מיקום 
    const [distance, setdistance] = useState(0);//הסלידר  
    const [item, setitem] = useState([])//המערך מקוואת;
    const [forFilter, setforFilter] = useState(false);//בוליאני לפילטר סינון 
    const [f, setF] = useState();
    const [lastItem, setlastItem] = useState([]);


    //שעות פתיחה
    const [openW, setOpenW] = useState('');
    const [openS, setOpenS] = useState('');
    const [openHoliday, setopenHoliday] = useState('');
    const [openSat, setopenSat] = useState('');


    const MapAPI = ""
    const storeData = async (key, value) => {//פעולה המאחסנת באסיינסטורג מידע
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {

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
        const unsubscribe = navigation.addListener('focus', async () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            })
            GetMenu('x')
            console.log(`xxxxxxxxxxxx`)
        });
        return unsubscribe
    }, [])

    const filterDistance = (distance1) => {
        setdistance(distance1)
        let newItem = new Array;
        let newItem1 = new Array;
        if (distance1 != 0) {
            lastItem.map((item) => {
                if (item.distance >= distance1) {
                    newItem1.push()
                }
                if (item.distance <= distance1) {
                    newItem.push(item)
                }

            })
            if (newItem.length > 0) {
                setitem(newItem);
            }
            else { setitem(newItem1) }

        }
        else {
            return;
        }
    }

    const GetCoords = (items) => {
        Geocoder.init(MapAPI);
        items.map(async (item) => {
            try {
                var name = item.neighborhood + " " + item.Religious_Council
                let json = await Geocoder.from(name);
                let location = {
                    latitude: json.results[0].geometry.location.lat,
                    longitude: json.results[0].geometry.location.lng,
                    latitudeDelta: 0.000922,
                    longitudeDelta: 0.000421
                }
                item.location = location;

            } catch (error) {
                console.log(`error`, error)
            }

        })

        setitem(items)
        setlastItem(items)

    }

    const GetMenu = async (search) => { // משיכת התוכן לפי קטגוריה
        setforFilter(false)
        if (search == "x") {
            return
        }
        else {
            var streetaddress = search.substr(0, search.indexOf(','));
            await fetch(`${ServerApi()}/api/getMekve`, {
                method: 'POST',
                body: JSON.stringify(streetaddress),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    return res.json()
                })
                .then((result) => {
                    // setitem(result)
                    // changeItem(result);
                    GetCoords(result);


                },
                    (error) => {
                        console.log("err POST=", error)
                        Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                    })
        }


    }
    const OpenModal = (item) => {
        console.log(`item`, item.Opening_Hours_Winter)
        setOpenW(item.Opening_Hours_Winter)
        setOpenS(item.Opening_Hours_Summer)
        setopenHoliday(item.Opening_Hours_Holiday_Eve_Shabat_Eve)
        setopenSat(item.Opening_Hours_Saturday_Night_Good_Day)
        setModalVisible(true)

    }
    const getloc = (city, neighborhood) => {
        Geocoder.init(MapAPI);
        var name = neighborhood + " " + city
        console.log(`name`, name)
        Geocoder.from(name)
            .then(json => {
                var location = json.results[0].geometry.location;
                console.log("sad", location);
                navigation.navigate("MapToBeacheScreen", location)
            })
            .catch(error => console.warn(error));

    }
    const sendCall = (phone) => {
        phone = phone.replace("-", "");
        Linking.openURL(`tel:${phone}`)
    }

    const openFilter = () => {
        if (forFilter) {
            setforFilter(false)
        }
        else {
            setforFilter(true)
        }
    }
    const test = (dis, index) => {
        item.distance = dis;
        console.log(`lastItem[index]`, lastItem[index])
        lastItem[index].distance = dis;
        console.log(`lastItem[index]astItem[index]astItem[index]`, lastItem[index])

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
                {/* תצוגת חיפוש */}
                <View style={styles.catgor}>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <View style={styles.action1}>

                            <GooglePlacesAutocomplete
                                placeholder='הקלד כתובת'
                                onPress={(data, details = null) => {
                                    let adress = data.description
                                    setAdress(adress)
                                    setDestination({
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                        latitudeDelta: 0.000922,
                                        longitudeDelta: 0.000421
                                    });
                                    GetMenu(adress);

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
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { openFilter() }}>
                            <FontAwesome5
                                name="sliders-h"
                                size={26}
                                color="#fff"
                                style={{ marginTop: 18, marginLeft: '9%' }}
                            />
                        </TouchableOpacity>
                        {forFilter ?
                            <View>
                                <Text style={[styles.text_footer, { marginLeft: "27%", color: "#FFF" }]}>סנן לפי מרחק נסיעה</Text>
                                <Text style={[styles.text_footer, { marginLeft: "42%", color: "#FFF", marginTop: "2%" }]}>{distance.toFixed(0)} ק"מ</Text>
                                <Slider
                                    style={{ width: 265, marginTop: 15, marginLeft: 52, }}
                                    minimumValue={1}
                                    maximumValue={40}
                                    minimumTrackTintColor="#FFF"
                                    maximumTrackTintColor="#FFFFF"
                                    thumbTintColor="#FFF"
                                    onSlidingComplete={value => filterDistance(value)}
                                    step={3}
                                />

                            </View>
                            : null}
                    </View>
                </View>
                {/* הצגת מקוואות */}
                <ScrollView style={{ marginBottom: 20 }}>
                    {item.map((item, index) => (
                        <View key={index}>
                            <MapViewDirections
                                origin={origin}
                                destination={item.location}
                                apikey={MapAPI}
                                onReady={result => test(result.distance, index)}

                            />
                            <View>
                                <View style={{
                                    backgroundColor: "#FFF",
                                    width: "92%",
                                    marginRight: 15,
                                    marginLeft: 15,
                                    borderRadius: 18,
                                    margin: 15,
                                }}>
                                    <Text style={{ marginLeft: "40%", marginTop: 2, color: '#0A268F', fontWeight: 'bold', fontSize: 18, }}>{item.Religious_Council} </Text>
                                    <View style={[styles.desc, { flexDirection: "row" }]} >
                                        <Text style={[styles.desc1,]}>כתובת :</Text>
                                        <Text style={[styles.desc1]}>{item.neighborhood}</Text>

                                    </View>
                                    <View style={[styles.desc, { flexDirection: "row" }]} >
                                        <Text style={[styles.desc1,]}>פאלפון לתיאום :</Text>
                                        <Text style={[styles.desc1]}>{item.Phone}</Text>
                                        <TouchableOpacity onPress={() => { sendCall(item.Phone) }} >
                                            <MaterialCommunityIcons
                                                style={[styles.phone]}
                                                name="phone-plus"
                                                size={35}
                                                color={"green"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {item.distance ?
                                        <View style={[styles.desc, { flexDirection: "row", marginTop: -10 }]} >
                                            <Text style={[styles.desc1,]}>מרחק :</Text>
                                            <Text style={[styles.desc1]}>{item.distance} ק"מ</Text>
                                        </View>
                                        : null}


                                    <TouchableOpacity style={styles.price1} onPress={() => { OpenModal(item) }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 13, color: "#fff" }}> שעות פתיחה </Text>
                                            <Feather
                                                name="info"
                                                size={20}
                                                color={"#fff"}
                                            />
                                        </View>
                                    </TouchableOpacity>



                                    <View style={[styles.desc, { flexDirection: "row" }]}>
                                        <TouchableOpacity style={styles.price} onPress={() => getloc(item.Religious_Council, item.neighborhood)}>
                                            <View>
                                                <Text style={{ fontWeight: 'bold', fontSize: 13, color: "#fff" }}>נווט למקווה  <Feather
                                                    name="map-pin"
                                                    size={20}
                                                    color={"#fff"}
                                                /></Text>
                                            </View>
                                        </TouchableOpacity>



                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}</ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontWeight: 'bold', fontSize: 24, color: "#0A268F", marginBottom: 20 }}>שעות פתיחה:</Text>
                            <View style={[styles.desc, { flexDirection: "row" }]} >
                                <Text style={[styles.desc1, { color: '#0A268F' }]}>חורף :</Text>
                                <Text style={[styles.desc1,]}>{openW}</Text>
                            </View>
                            <View style={[styles.desc, { flexDirection: "row" }]} >
                                <Text style={[styles.desc1, { color: '#0A268F' }]}>קיץ :</Text>
                                <Text style={[styles.desc1,]}>{openS}</Text>
                            </View>
                            <View style={[styles.desc, { flexDirection: "row" }]} >
                                <Text style={[styles.desc1, { color: '#0A268F' }]}>מוצש' :</Text>
                                <Text style={[styles.desc1,]}>{openW}</Text>
                            </View>
                            <View style={[styles.desc, { flexDirection: "row" }]} >
                                <Text style={[styles.desc1, { color: '#0A268F' }]}>שבתות :</Text>
                                <Text style={[styles.desc1,]}>{openHoliday}</Text>
                            </View>
                            < TouchableOpacity onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                                <View
                                    style={[styles.logina]}>
                                    <Text style={styles.textlogin}>סגור</Text>

                                </View>
                            </TouchableOpacity >

                        </View>

                    </View>
                </Modal>
            </ImageBackground>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    price: {

        position: 'relative',
        marginLeft: "70.7%",
        height: 50,
        marginBottom: -1,
        width: 100,
        backgroundColor: "#4157A8",
        borderBottomRightRadius: 18,
        borderTopLeftRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

    },
    // price: {
    //     position: 'relative',
    //     marginLeft: "40.1%",
    //     height: 50,
    //     marginBottom: -1,
    //     width: 110,
    //     backgroundColor: "#4157A8",
    //     borderBottomRightRadius: 18,
    //     borderTopLeftRadius: 25,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     shadowColor: "#000",
    //     shadowOpacity: 0.34,
    //     shadowRadius: 6.27,
    //     elevation: 10,

    // },
    price1: {
        height: 36,
        width: 110,
        backgroundColor: "#4157A8",
        borderTopRightRadius: 17,
        borderBottomRightRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

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
        flexDirection: 'column',
        justifyContent: 'space-between',


    },

    image: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "flex-start"
    },

    desc: {
        fontWeight: 'bold', fontSize: 13, color: "black",
        marginLeft: 15,
        marginRight: 1,


    },
    desc1: {
        fontWeight: 'bold', fontSize: 14, color: "black",
        marginTop: 3,
        marginBottom: 4,
        marginRight: 5

    },
    phone: {
        color: "green",
        marginTop: -5,
        marginBottom: 4,
        marginRight: 5,
        borderRadius: 180

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
    },
    action1: {
        flexDirection: 'row',
        marginTop: 5,
        paddingBottom: 0,
        marginLeft: 30,
        marginRight: 30,
    },
    text_footer: {
        color: '#282E68',
        fontSize: 17,
        marginLeft: 25,
        fontWeight: "bold",


    },

    //modal styel
    logina: {
        padding: 10,
        backgroundColor: '#4157A8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },

    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#fff"
    },
    modalView: {
        justifyContent: 'space-between',
        margin: 10,
        height: 350,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
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
