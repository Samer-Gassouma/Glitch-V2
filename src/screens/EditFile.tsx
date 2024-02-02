import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Layout, Text, Button, useTheme, themeColor } from "react-native-rapi-ui";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import { Picker } from '@react-native-picker/picker';
import { Alert } from "react-native";

export default function EditFile({ route, navigation }: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { id } = route.params;
  const [item, setItem] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(item.SubjectID);
  const [visibilityMode, setVisibilityMode] = useState("");
  const [folders, setFolders] = useState([] as any);
  const [selectedFolder, setselectedFolder] = useState([] as any);


  useEffect(() => {
    if (id) {
      fetchFile();
      fetchSubjects();
    }
  }, []);

  const fetchFile = async () => {
    try {
      const { data, error } = await supabase
        .from("Resources")
        .select("*")
        .eq("ResourceID", id)
        .single();

      if (error) {
        console.error("Error fetching file:", error.message || error);
      } else {
        setItem(data);
        setNewFileName(data.ResourceName); // Set default value for the file name input
        setSelectedSubject(data.SubjectId); // Set default value for the subject picker
        selectedFolder(data.FolderID); // Set default value for the folder picker
        folders(data.FolderID); // Set default value for the folder picker
        setVisibilityMode(data.VisibilityMode); // Set default value for the visibility mode picker
      }
    } catch (error) {
      console.error("Error fetching file:", error.message || error);
    }
  };

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

  useEffect(() => {
    if (selectedSubject) {
      fetchFolders(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchFolders = async (subjectId) => {
    try {
      const { data, error } = await supabase.from("folders").select("*").eq("SubjectID", subjectId);

      if (error) {
        console.error("Error fetching folders:", error.message || error);
      } else {
        setFolders(data);
      }
    } catch (error) {
      console.error("Error fetching folders:", error.message || error);
    }
  };

  

  const handleSaveChanges = async () => {
    try {
      if (!newFileName || !selectedSubject || !visibilityMode) {
        Alert.alert("All fields are required");
        console.log(newFileName, selectedSubject, visibilityMode);
        return;
      }
  
      // Update the file details in the Resources table
      const { data: updateData, error: updateError } = await supabase
        .from('Resources')
        .update({
          ResourceName: newFileName,
          SubjectID: selectedSubject,
          VisibilityMode: visibilityMode,
          FolderID: selectedFolder,
        })
        .eq('ResourceID', id);
  
      if (updateError) {
        console.error("Error updating file details:", updateError.message || updateError);
      } else {
        console.log("File details updated successfully:", updateData);
        navigation.goBack(); 
      }
    } catch (error) {
      console.error("Error updating file details:", error.message || error);
    }
  };
  

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.heading}>Edit File</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New File Name:</Text>
          <TextInput
            style={styles.input}
            value={newFileName}
            onChangeText={(text) => setNewFileName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Subject:</Text>
          <Picker
              selectedValue={selectedSubject }
              onValueChange={(itemValue) => setSelectedSubject(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Subject" value="" />
              {subjects.map((subject, index) => (
                <Picker.Item key={index} label={subject.Name} value={subject.id} />
              ))}
            </Picker>

            <Text style={styles.label}>Select Folder:</Text>
          <Picker
              selectedValue={selectedFolder }
              onValueChange={(itemValue) => setselectedFolder(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select folder" value="" />
              {folders.map((folder, index) => (
                <Picker.Item key={index} label={folder.FolderName} value={folder.FolderID} />
              ))}
            </Picker>
           


          <Text style={styles.label}>Visibility Mode:</Text>
          <Picker
            selectedValue={visibilityMode}
            onValueChange={(itemValue) => setVisibilityMode(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Visibility Mode" value="none" />
            <Picker.Item label="Not Visible" value="none" />
            <Picker.Item label="Read" value="read" />
            <Picker.Item label="Download" value="download" />
          </Picker>
        </View>
        <Button text="Save Changes" onPress={handleSaveChanges} style={styles.button} />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColor.white,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: themeColor.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: themeColor.dark,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: themeColor.dark,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: themeColor.dark,
    borderRadius: 8,
    marginBottom: 15, // Add margin bottom to separate pickers
  },
  button: {
    backgroundColor: themeColor.primary,
  },
});
