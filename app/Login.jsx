import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Alert, ImageBackground
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native-gesture-handler";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check_textEmailInputChange: false,
            email: '',
            password: '',
            secureTextEntry: true
        }
    }
    getDateNow = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = {
            day: dd,
            month: mm,
            year: yyyy
        }
        return today
    }
    storeData = async (key, value) => {//פעולה המאחסנת מידע באסיינסטורג
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(`e`, e)
        }
    }
    getMyObject = async (key) => {//פעולה המקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }

        console.log('Done.')

    }
    textEmailInputChange(value) {// מטודה שמפעילה סמן ירוק בעת הכנסת איימל נכון
        var emailregex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // שימוש בריגיקס
        if (emailregex.test(value)) {
            this.setState({
                check_textEmailInputChange: true
            })
        }
        else {
            this.setState({
                check_textEmailInputChange: false
            })
        }
        this.setState({

        })
    }
    secureTextEntry = () => {//מסתיר את הסיסמה או לא 
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        })

    }
    fingerLogin = async () => { // פונקציה שאחראית על הזדהות עם טביעת אצבע
        let u = await this.getMyObject("user")
        if (u == undefined) {
            Alert.alert("אופס", "אנא התחבר קודם בדרך הרגילה כדי שמכשירך ישמור את פרטיך")
        } else {
            try {
                let results = await LocalAuthentication.authenticateAsync();
                if (results.success) {
                    this.setState({
                        modalVisible: false,
                        authenticated: true,
                        failedCount: 0,
                    });
                    if (u.CustomersCode) {
                        this.props.navigation.navigate("HomeScreen")
                    }
                } else {
                    this.setState({
                        failedCount: this.state.failedCount + 1,
                    });
                }
            } catch (e) {
                console.log('error =', e);
                Alert.alert("אופס", "לצערנו קיימת בעיה בשרתים אנא נסה שוב מאוחר יותר")
                   
            }
        }

    }
    ServerApi() {// הלוקל הוסט
        const api = `http://proj3.ruppin-tech.co.il`
        return api
    }
    userLogin = async () => {//מתחבר לשרת בודק אם היוזר קיים ומחבר אותו
        const user = {
            Email: this.state.email,
            Password: this.state.password,
        }
        if (user.Email === '') {
            Alert.alert("אופס", "אנא הכנס איימל תקין ונסה שוב")
            return
        }
        if (user.Password === '') {
            Alert.alert("אופס", "אנא הכנס סיסמא ונסה שוב")
            return
        }

        await fetch(`${this.ServerApi()}/api/login`, {
            method: 'POST',
            body: JSON.stringify(user),
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
                if (result) {
                    this.storeData("user", result)
                    this.storeData("date", this.getDateNow())
                    this.props.navigation.navigate("ManagerHomeScreen")
                }
                else {
                    Alert.alert("אופס", "כנראה הוכנסו פרטים שגואים , אנא נסה שוב")
                }
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "לצערנו קיימת בעיה בשרתים אנא נסה שוב מאוחר יותר")
                })
    }
    componentDidMount() { //דואג לרנדור מחדש של הדף במקרה של חזרה אליו
        this._unsubscribeFocus = this.props.navigation.addListener('focus', (payload) => {
            console.log('will focus', payload);
            this.setState({ stam: 'will focus ' + new Date().getSeconds() });
        });
    }
    componentWillUnmount() {//דואג לרנדור מחדש של הדף במקרה של חזרה אליו
        this._unsubscribeFocus();
    }



    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageBackground source={require('../assets/test.png')} resizeMode="cover" style={styles.image} >
                        <View style={styles.header1}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                                <Feather
                                    name="menu"
                                    size={30}
                                    style={[styles.menu, { marginLeft: 15 }]}
                                />
                            </TouchableOpacity>
                            <Image
                                source={require('../assets/logos/26.png')}
                                resizeMode='contain'
                                style={{
                                    marginTop: 95,
                                    width: '60%',
                                    height: 100,
                                    marginRight: 25
                                }}
                            />
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("HomeScreen")}>
                                <Entypo
                                    name="home"
                                    size={30}
                                    style={styles.shoppingCart}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.text_footer}>אימייל</Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name="user-o"
                                    color="#fff"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="הכנס אימייל..."
                                    placeholderTextColor="#fff" 
                                    keyboardType="email-address"
                                    style={styles.textInput}
                                    onChange={() => this.textEmailInputChange(this.state.email)}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    ref={input => { this.textInputEmail = input }}
                                />
                                {this.state.check_textEmailInputChange ?
                                    <Feather
                                        name="check-circle"
                                        color="#FFF"
                                        size={20}
                                    />
                                    : null}
                            </View>
                            <Text style={[styles.text_footer, {
                                marginTop: 35
                            }]}>סיסמא</Text>
                            <View style={styles.action}>
                                <Feather
                                    name="lock"
                                    color="#fff"
                                    size={20}
                                />
                                {this.state.secureTextEntry ?
                                    <TextInput
                                        ref={input => { this.textInputPass = input }}
                                        placeholder="...הכנס סיסמא"
                                        placeholderTextColor="#fff" 
                                        secureTextEntry={true}
                                        style={styles.textInput}
                                        value={this.state.password}
                                        onChangeText={(text) => this.setState({
                                            password: text
                                        })}
                                    /> :
                                    <TextInput

                                        placeholder="...הכנס סיסמא"
                                        placeholderTextColor="#fff" 
                                        style={styles.textInput}
                                        value={this.state.password}
                                        onChangeText={(text) => this.setState({
                                            password: text
                                        })}
                                    />

                                }
                                <TouchableOpacity
                                    onPress={() => this.secureTextEntry()}>
                                    {this.state.secureTextEntry ?
                                        <Feather
                                            name="eye-off"
                                            color="#fff"
                                            size={20}
                                        /> :
                                        <Feather
                                            name="eye"
                                            color="#fff"
                                            size={20}
                                        />
                                    }
                                </TouchableOpacity>

                            </View>
                            <TouchableOpacity onPress={this.userLogin}>
                                <View style={[styles.button, { marginTop: '25%' }]}>
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
                                        <Text style={styles.textlogin}>התחבר</Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                            activeOpacity={.5}
                            onPress={this.fingerLogin}>
                                <View style={styles.button} >
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
                                        <Text style={styles.textlogin}>התחבר באמצעות טביעת אצבע</Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('SingUpScreen')}>
                                <View style={styles.button} >
                                    <View style={[styles.logina, {
                                        backgroundColor: "#fff",
                                        borderRadius: 30,
                                        borderColor: '#0A278D',
                                        borderWidth: 1,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }]}>
                                        <Text style={{
                                            color: '#282E68',
                                            fontSize: 18,
                                            fontWeight: "bold",
                                        }}>הירשם</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ManagerHomeScreen')}>
                                <Text style={{
                                    fontSize: 18, fontWeight: "bold", color: '#fff', marginBottom:40,marginTop:20, marginLeft: '25%'
                                }}>המשך ללא התחבורת</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </ScrollView>
            </View>
        );
    }
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    shoppingCart: {
        marginTop: 50,
        color: '#fff',
        marginRight: 15
    },
    header1: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5

    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop: '10%',
    },
    text_header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    },
    text_footer: {
        color: '#fff',
        fontSize: 18,
        fontWeight:'bold',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        marginLeft: 0,
        marginRight: 0,
    },
    textInput: {
        textAlign: 'right',
        flex: 1,
        paddingLeft: 10,
        color: "#fff",
    },
    button: {
        alignItems: 'center',
        marginTop: 30,
    },
    logina: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },

    textlogin: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "flex-start"
    },
    menu: {
        marginTop: 50,
        color: '#fff',
    },


});