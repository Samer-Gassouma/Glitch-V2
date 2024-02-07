import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet,ActivityIndicator } from "react-native";
import { Layout, Text, useTheme, themeColor } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SubjectPage({  route}) {
  const [subjects, setSubjects] = useState([]);
  const { subjectID,subjectName} = route.params;
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('SubjectID', subjectID)
      .eq('ParentFolderID', 0);

      if (error) {
        console.error("Error fetching subjects:", error.message || error);
      } else {
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error.message || error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubjectPress = (id:any) => {
    navigation.navigate("Detail", {id});
  };

  const renderSubjectItem = ({ item }) => (
    <TouchableOpacity
    style={styles.subjectItem}
    onPress={() => handleSubjectPress(item.FolderID)}
  >
    <MaterialIcons
      name="folder"
      size={24}
      color={themeColor.white}
      style={styles.folderIcon}
    />
    <Text style={styles.subjectItemText}>{item.FolderName}</Text>
  </TouchableOpacity>
  );

  return (
    <Layout>
      <ActivityIndicator animating={loading} size="large" color="#0000ff" />
      
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.FolderID.toString()}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.subjectList}
      />
      <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.back}>
                    <Ionicons name="arrow-back" size={30} color={'#666'} />
                </TouchableOpacity>
    </Layout>
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
  folderIcon: {
    marginRight: 10,
    color: themeColor.dark 
  },
  subjectItemText: {
    fontSize: 16,
    color: themeColor.dark,
  },  back: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    position: 'absolute',
    bottom: 20,
    left: 20,
    height: 50,
    borderRadius: 20,
},
});