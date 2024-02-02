import React, { useState, useEffect } from "react";
import { View, ScrollView, Switch, StyleSheet, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../initSupabase";
import {
  Layout,
  Text,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import {Linking} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRoute } from "@react-navigation/native";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkmode, setTheme } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem("userData").then((user) => {
      setUser(JSON.parse(user!));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Text
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </Text>
    );
  }

  const handleLogout = async () => {
    AsyncStorage.removeItem("userData");
    const { error } = await supabase.auth.signOut();
    if (!error) {
      alert("Signed out!");
    }
    if (error) {
      alert(error.message);
    }
  };

  return (
    <Layout style={styles.container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={
            isDarkmode
              ? require("../../assets/images/glitch-nobg-white.png")
              : require("../../assets/images/logo-no-background.png")
          }
          style={styles.logo}
        />

        <Text style={{ textAlign: "center" }}>
          {user ? user.email : "Loading..."}
        </Text>

        <Button
          text="Logout"
          onPress={handleLogout}
          style={{
            marginTop: 20,
            marginBottom: 30,
            backgroundColor: themeColor.danger,
          }}
        />

        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkmode ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              isDarkmode ? setTheme("light") : setTheme("dark");
            }}
            value={isDarkmode}
          />
          <Text
            size="md"
            fontWeight="bold"
            style={{
              marginLeft: 5,
            }}
          >
            {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          Made with ❤️ by{" "}
          <Text
            style={{ fontWeight: "bold", color: themeColor.primary }}
            onPress={() => {
              // Open the link
              Linking.openURL("https://twitter.com/SamerGassouma");
              
            }}
          >
            ivan
          </Text>
        </Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 20,
    justifyContent: "center",
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  // Footer styles
  footer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
