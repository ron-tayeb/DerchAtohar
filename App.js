import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, View, Text } from 'react-native';
import React, { Component, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerItems } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// screen import>
import Login from './app/Login.jsx';
import SingUp from './app/SingUp.jsx';
import Hlacha from './app/Hlacha.jsx';
import Home from './app/Home.jsx';
import Beaches from './app/Beaches.jsx';
import MapToBeache from './app/MapToBeache.jsx';
import ManagerAddUsers from './app/ManagerAddUsers.jsx';
import ManagerDelUsers from './app/ManagerDelUsers.jsx';
import ManagerUpdateUsers from './app/ManagerUpdateUsers.jsx';
import ManagerUpdateUsers2 from './app/ManagerUpdateUsers2.jsx';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const CustomDrwerContent = (props) => {
  const [user, setUser] = useState()
  const [uObj, setUObj] = useState({})

  useEffect(() => {//מפעיל בעת כל שימוש בפונקציה את הפעולה שבודקת אם משתמש מחובר
    checkLogIN()
  }, [props])

  const getData = async (key) => {//פעולה שמקבלת מידע מהאסיינסטורג
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      // read error
    }
  }
  const removeValue = async (key) => { // פעולה שמוחקת מידע מהאסיינסטורג
    try {
      await AsyncStorage.removeItem(key)
      console.log(`true`)
    } catch (e) {
      console.log(`e`, e)
    }
    console.log('Done.')
  }
  const checkLogIN = async () => { // בדיקה  אם קיים משתמש מחובר כדי לדעת אם להעלים את כפתור ההרשמה וההתחברות
    let u = await getData("user")
    if (u == undefined) {
      await setUser(false)
      return
    }
    else {
      await setUser(true)
      setUObj(u);
      return
    }
  }
  const logOut = async () => { //פעולה שמתנתקת מהאפליקציה ומוחקת מהאססינססטורג את פרטי המשתמש והעגלה שלו
    await removeValue("user")
    await removeValue("cart")
    setUObj("")
    props.navigation.navigate("loginScreen");
    props.navigation.closeDrawer();
  }


  return (
    <View style={styles.drower}>
      {/* מה שמוצג בדרווור נאביגיישן */}
      <Image source={require('./assets/nav.png')} style={{
        resizeMode: "cover", height: "100%", width: "100%", position: 'absolute', borderBottomLeftRadius: 79, borderTopLeftRadius: 79
      }} />

      <View style={styles.drowerHedear}>

        <Image source={require('./assets/logos/1.png')} style={{ height: 90, width: "100%", marginTop: 75, marginLeft: -7 }} />
      </View>
      <DrawerContentScrollView >
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מצא חוף</Text>)} onPress={() => { props.navigation.navigate("BeachesScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מצא מקווה</Text>)} onPress={() => { props.navigation.navigate("HomeScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        {user ? null : <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הרשם</Text>)} onPress={() => { props.navigation.navigate("SingUpScreen"); props.navigation.closeDrawer(); }}></DrawerItem>}
        {user ? null : <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >התחבר</Text>)} onPress={() => { props.navigation.navigate("loginScreen"); props.navigation.closeDrawer(); }}></DrawerItem>}
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >שער ההלכה</Text>)} onPress={() => { props.navigation.navigate("HlachaScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        {user ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >התנתק</Text>)} onPress={() => logOut()}></DrawerItem> : null}
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מפה</Text>)} onPress={() => { props.navigation.navigate("MapToBeacheScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הוסף משתמש</Text>)} onPress={() => { props.navigation.navigate("ManagerAddUsersScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מחק משתמש</Text>)} onPress={() => { props.navigation.navigate("ManagerDelUsersScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >ערוך משתמש</Text>)} onPress={() => { props.navigation.navigate("ManagerUpdateUsersScreen"); props.navigation.closeDrawer(); }}></DrawerItem>

      </DrawerContentScrollView>
      <View style={styles.drowerfooter}>
      </View>
    </View>

  )
}

function MyDrawer() {
  return (

    <Drawer.Navigator
      initialRouteName="loginScreen"
      drawerPosition="right"
      drawerStyle={styles.container1}
      drawerContent={(props) => (<CustomDrwerContent {...props} />)}
    >

      <Drawer.Screen
        name="loginScreen"
        component={Login}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="SingUpScreen"
        component={SingUp}
        options={{ drawerLabel: 'Second Page' }}
      />
      <Drawer.Screen
        name="HlachaScreen"
        component={Hlacha}
      />
      <Drawer.Screen
        name="HomeScreen"
        component={Home}
      />
      <Drawer.Screen
        name="BeachesScreen"
        component={Beaches}
      />
      <Drawer.Screen
        name="MapToBeacheScreen"
        component={MapToBeache}
      />
      <Drawer.Screen
        name="ManagerAddUsersScreen"
        component={ManagerAddUsers}
      />
      <Drawer.Screen
        name="ManagerDelUsersScreen"
        component={ManagerDelUsers}
      />
      <Drawer.Screen
        name="ManagerUpdateUsersScreen"
        component={ManagerUpdateUsers}
      />
      <Drawer.Screen
        name="ManagerUpdateUsers2Screen"
        component={ManagerUpdateUsers2}
      />
      
      
    </Drawer.Navigator>
  );
}


export default function App() {



  return (
    <NavigationContainer>
      {/* stack navigition */}
      <MyDrawer >
        <Stack.Navigator initialRouteName="loginScreen" headerMode="none"  >
          <Stack.Screen name="loginScreen" component={Login} />
          <Stack.Screen name="SingUpScreen" component={SingUp} />
          <Stack.Screen name="HlachaScreen" component={Hlacha} />
          <Stack.Screen name="HlachaScreen" component={Home} />
          <Stack.Screen name="HlachaScreen" component={Beaches} />
          <Stack.Screen name="MapToBeacheScreen" component={MapToBeache} />
          <Stack.Screen name="ManagerAddUsersScreen" component={ManagerAddUsers} />
          <Stack.Screen name="ManagerDelUsersScreen" component={ManagerDelUsers} />
          <Stack.Screen name="ManagerUpdateUsersScreen" component={ManagerUpdateUsers} />
          <Stack.Screen name="ManagerUpdateUsers2Screen" component={ManagerUpdateUsers2} />

        </Stack.Navigator>
      </MyDrawer>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container1: {
    borderBottomRightRadius: 80,
    borderTopRightRadius: 80

  },
  drower: {
    flex: 1,
    backgroundColor: '#DEEEFE',
    borderBottomRightRadius: 80,
    borderTopRightRadius: 80
  },
  drowerHedear: {
    height: 150,
    flexDirection: "row",
  },
  signup: {
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: '#fff',
    borderColor: "#fff",
    borderWidth: 1.4,
    borderTopRightRadius: 88,
    borderBottomLeftRadius: 88,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  signupT: {
    marginLeft: 20,
    textAlign: 'center',
    color: '#282E68',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
