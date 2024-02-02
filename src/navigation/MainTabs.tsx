import React , {useState,useEffect}from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
import { View, Text, Image, TouchableOpacity, StyleSheet, } from 'react-native';

import Home from "../screens/Home";
import Admin from "../screens/Admin";
import Profile from "../screens/Profile";
import Subjects from "../screens/Subjects";
import Spinner from "react-native-loading-spinner-overlay";

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  
  useEffect(() => {
    const fetchUser = async () => {
      try{
      const userData = await AsyncStorage.getItem("userData");
      setUser(JSON.parse(userData!));
      }
      catch(error){
        console.error("Error fetching data:", error.message || error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchUser();
  } , [user] )

  if(loading){
    return (
      <Spinner  visible={loading} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
    )
  }

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"home"} />
          ),
        }}
      />
       <Tabs.Screen
        name="Subjects"
        component={Subjects}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Subjects" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
      {user?.is_admin &&
    <Tabs.Screen
        name="Admin"
        component={Admin}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Admin" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
      }
    </Tabs.Navigator>
  );
};

export default MainTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  button: {
    marginTop: 10,
  },
});