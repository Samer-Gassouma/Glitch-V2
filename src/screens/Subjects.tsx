import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { Layout, Text, useTheme, themeColor } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger ,MenuProvider} from 'react-native-popup-menu';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

export default function SubjectPage({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

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
  } , [] )
  useEffect(() => {
    fetchSubjects();
  }, [subjects]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*");

      if (error) {
        console.error("Error fetching subjects:", error.message || error);
      } else {
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error.message || error);
    }
  };

  const handleSubjectPress = (subjectID, subjectName) => {
    navigation.navigate("SubjectDetail", {
      subjectID,
      subjectName,
    });
  };

  const handleEditSubject = (id:any,name:any) => {
    navigation.navigate('EditSubject', { id ,name});
  }

  const handleDeleteSubject = async (Folder_ID :any) => {
    
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', Folder_ID);

      if (error) {
        throw error;
      }
      Alert.alert("Subject Deleted Successfully");
      navigation.goBack();
    } catch (error) {
      console.log(error.message);
    }
  }

  const renderSubjectItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.subjectItem, { flexDirection: 'row', justifyContent: 'space-between' }]}
      onPress={() => handleSubjectPress(item.id, item.Name)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons
          name="folder"
          size={24}
          color={themeColor.white}
          style={styles.folderIcon}
        />
        <Text style={styles.subjectItemText}>{item.Name}</Text>
      </View>
      {user.is_admin &&
      <Menu>
        <MenuTrigger>
          <MaterialIcons
            name="more-vert"
            size={24}
            color="black"
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => handleEditSubject(item.id,item.Name)}>
            <Text style={styles.menuOptionText}>Edit</Text>
          </MenuOption>
          <MenuOption onSelect={() => handleDeleteSubject(item.id)}>
            <Text style={styles.menuOptionText}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
      }
    </TouchableOpacity>
  );

  if(loading){
    return(
      <Spinner
      visible={loading}
      textContent={'Loading...'}
      textStyle={styles.spinnerTextStyle}
    />
    )
  }
  return (
    <MenuProvider>
    <Layout>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.subjectList}
      />
    </Layout>
    </MenuProvider>
  );
}


const styles = StyleSheet.create({
  subjectList: {
    padding: 20,
  },
  subjectItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColor.danger400,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  menuOptionText: {
    fontSize: 16,
    color: themeColor.dark,
    padding: 10,
  },
  folderIcon: {
    marginRight: 10,
    color: themeColor.dark 
  },
  subjectItemText: {
    fontSize: 16,
    color: themeColor.dark,
  },
});