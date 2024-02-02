import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import { Layout, Text, Button, useTheme, themeColor, TextInput } from "react-native-rapi-ui";
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from "../initSupabase";
import { Picker } from '@react-native-picker/picker';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { firebaseApp } from '../initSupabase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

export default function AddResourceScreen({ navigation }) {
  const { isDarkmode } = useTheme();
  const [resourceName, setResourceName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [visibilityMode, setVisibilityMode] = useState("Read" as "Read" | "Download");
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProg, setLoadingProg] = useState(false);
  const [folders, setFolders] = useState([] as any);
  const [selectedFolder, setSelectedFolder] = useState(0)

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.assets[0].uri !== undefined) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error choosing file:', error);
    }
  };
  useEffect(() => {
    if (selectedSubject != 'Subject') {
      fetchFolders(selectedSubject);
    }
  }, [selectedSubject]);

  useEffect(() => {
    fetchSubjects();
    setSelectedSubject(subjects[0]?.id);
    
  }, []);

  const fetchFolders = async (selectedSubject : any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('folders').select('*').eq('SubjectID', selectedSubject);
      if (error) {
        throw error;
      }
      
        setFolders(data);
        setLoading(false);
        setSelectedFolder(data[0].FolderID)
      
    }catch (error: any) {
      console.error("Error fetching folders:", error.message || error);
    }finally {
        setLoading(false);
    }
  }
  const fetchSubjects = async () => {
    const userData = await AsyncStorage.getItem("userData");
    setUser(JSON.parse(userData!));
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) {
      throw error;
    }
    setSubjects(data);
  };

  const handleUpload = async () => {
    if (!resourceName || !selectedSubject || !file) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      setLoadingProg(true);
      const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
      const filePath = `${resourceName}${new Date().getTime()}.${file.mimeType.split('/')[1]}`;
      const contentType = file.mimeType;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(
          filePath,
          decode(base64),
          {
            contentType,
            onProgress: (event) => {
              const progress = (event.loaded / event.total) * 100;
              setUploadProgress(progress);
            },
          }
        );

      if (uploadError) {
        console.error("Error uploading file:", uploadError.message || uploadError);
        return;
      }
      const fetchResponse = await fetch(file.uri);
      const theBlob = await fetchResponse.blob();
      const firebaseRef = ref(getStorage() , filePath);
      const uploadTask = uploadBytesResumable(firebaseRef, theBlob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(downloadURL);
            resolve({
              downloadURL,
              metadata: uploadTask.snapshot.metadata,
            });
            const fileKey = uploadData?.Key;
            const { data: insertData, error: insertError } = await supabase
              .from('Resources')
              .insert([{ ResourceName: resourceName, URL: fileKey, SubjectID: selectedSubject, FolderID: selectedFolder,VisibilityMode :visibilityMode ,URL2:downloadURL,UserID:user.id }]);
            if (insertError) {
              console.error("Error inserting resource:", insertError.message || insertError);
              return;
            }
            Alert.alert("Resource uploaded successfully");
            setResourceName("");
            setSelectedSubject("");
            setFile([]);
            setSelectedFolder(0)
            setUploadProgress(0);
          }
        );
      });

      } catch (error) {
      Alert.alert("Error uploading file", error.message || error);
    }
    finally {
      setLoadingProg(false);
    }
  };

  if(loading) {
    return (
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  if(loadingProg) {
    return (
      <Spinner
        visible={loadingProg}
        textContent={'Prosessing...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Add Resource</Text>

        <View style={styles.formContainer}>
          <Button text="Go BACK" onPress={() => navigation.goBack()} />
          <Text>Resource Name</Text>
          <TextInput
            containerStyle={{ marginTop: 10 }}
            placeholder="Enter resource name"
            value={resourceName}
            onChangeText={(text) => setResourceName(text)}
          />

          <Text style={{ marginTop: 10 }}>Select Subject</Text>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          >
            <Picker.Item label="Select Subject" value="" />
            {subjects.map((subject, index) => (
              <Picker.Item key={index} label={subject.Name} value={subject.id} />
            ))}
          </Picker>
          
        <Text style={{ marginTop: 10 }}>Select Folder</Text>
          <Picker
            selectedValue={selectedFolder}
            onValueChange={(itemValue) => setSelectedFolder(Number(itemValue))}   
          >
            <Picker.Item label="Select Folder" value="" />
            {folders.map((folder, index) => (
              <Picker.Item key={index} label={folder.FolderName} value={folder.FolderID} />
            ))}
          </Picker>
          
          <Text style={{ marginTop: 10 }}>Select VIS Mod</Text>
          <Picker
            selectedValue={visibilityMode}
            onValueChange={(itemValue) => setVisibilityMode(itemValue)}
          >
            <Picker.Item label="Select Subject" value="" />
            <Picker.Item label="Read" value="Read" />
            <Picker.Item label="Download" value="Download" />
           
          </Picker>

          <Button
            text="Pick File"
            style={styles.pickFileButton}
            onPress={handleChooseFile}
          />

          {file && <Text style={{ marginTop: 10 }}>Selected File: {file.name}</Text>}

          {uploadProgress > 0 && (
            <View style={styles.progressBarContainer}>
              <Text style={{ marginTop: 10 }}>Upload Progress: {uploadProgress.toFixed(2)}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={{
                    width: `${uploadProgress}%`,
                    height: 10,
                    backgroundColor: themeColor.dark,
                  }}
                />
              </View>
            </View>
          )}

          <Button
            text="Upload Resource"
            onPress={handleUpload}
            style={styles.uploadButton}
          />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  pickFileButton: {
    marginTop: 10,
    backgroundColor: themeColor.primary,
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: themeColor.success,
  },
  progressBarContainer: {
    marginTop: 20,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: themeColor.white,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
});
