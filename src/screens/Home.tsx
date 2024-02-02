import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Layout, Text, Button, useTheme, themeColor } from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from 'react-native-loading-spinner-overlay';

import { supabase } from "../initSupabase";



export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [user, setUser] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const { isDarkmode } = useTheme();
  const [loading, setLoading] = useState(false); 

  
  useEffect(() => { 
    fetchData();
  }, [] )


  const fetchData = async () => {
    try {
      setLoading(true);

      const userData = await AsyncStorage.getItem("userData");
      setUser(JSON.parse(userData!));

     
      const { data, error: fetchError } = await supabase
      .from("Resources")
      .select("*").order("created_at", { ascending: false }).limit(5);
      
      setLatestCourses(data);
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigation.navigate("DetailFile", { id: courseId });
  }
 
  const handleAddCourse = () => {
    navigation.navigate("AddCourse");
  };
  return (
    <Layout style={styles.container}>
       <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={{fontSize: 18,
    marginBottom: 20,color : isDarkmode ? themeColor.white : themeColor.dark }}>{user ? user.email : "Loading..."}</Text>
            <Image   source={
                isDarkmode
                  ? require("../../assets/images/glitch-nobg-white.png")
                  : require("../../assets/images/logo-no-background.png")
                          } style={styles.logo} />

        </View>

        {/* Latest Courses List */}
        <View style={styles.coursesContainer}>
          <Text style={ {color: isDarkmode ? themeColor.white : themeColor.dark,fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    }}>Latest Courses</Text>
          {latestCourses.map((course) => (
            <TouchableOpacity
              key={course.ResourceID}
              onPress={() => handleCourseClick(course.ResourceID)}
              style={styles.courseItem}
            >
              <Text style={styles.courseItemText}>{course.ResourceName}</Text>
              <Text style={styles.courseItemText}>Upload Date:
              {new Date(course.created_at).toLocaleDateString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          text="See More"
          onPress={() => navigation.navigate("Subjects")}
          style={styles.seeMoreButton}
        />

      
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: themeColor.white,
  },
  logo: {
    width: 40, 
    height: 40,
    marginBottom: 20,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
    color: themeColor.dark,
  },
  teslaLogo: {
    width: 80,
    height: 40,
    resizeMode: "contain",
  },
  coursesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    
  },
  courseItem: {
    backgroundColor: themeColor.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  courseItemText: {
    fontSize: 16,
    color: themeColor.dark,
  },
  seeMoreButton: {
    marginTop: 20,
    backgroundColor: themeColor.success,
  },
  addCourseButton: {
    marginTop: 20,
    marginBottom: 5,
    backgroundColor: themeColor.danger400,
  },
});
