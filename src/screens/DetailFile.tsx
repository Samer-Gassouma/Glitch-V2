import React, { useEffect,useState } from "react";
import { View, StyleSheet,Linking ,TouchableOpacity } from "react-native";
import { Layout, Text, Button, useTheme, themeColor } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';

interface Resource {
  ResourceID: number;
  ResourceName: string;
  URL: string;
  URL2: string;
  FolderID: number;
  VisibilityMode: string;
  created_at: string;
}

export default function DetailFile({ navigation,route }) {
  const { isDarkmode } = useTheme();
  const uploadDateColor = isDarkmode ? themeColor.primary : themeColor.dark;

  const { id } = route.params;
  const [item, setItem] = useState<Resource>({} as Resource);
  const [loading, setLoading] = useState(false);
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
    
  } , [] )

  useEffect(() => {
    
    fetchFile();
  }, []);



  const fetchFile = async () => {
    try{
    setLoading(true);
    
    const { data, error } = await supabase
    .from("Resources")
    .select("*")
    .eq("ResourceID", id)
    .single();
    if (error) {
      throw error;
    }
    setItem(data);
  } catch (error) {
    console.error("Error fetching file:", error.message || error);
  }
  finally {
    setLoading(false);
  }
  };

  const handleRead =async () => {
    if(item.URL2) {
    try {
      const downloadURL = item.URL2;
      const supported = await Linking.canOpenURL(downloadURL);

      if (supported) {
        await Linking.openURL(downloadURL);
      } else {
        console.error('Cannot open the download link');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
  };
  const handleDownload = async () => {
    if(item.URL2) {
    try {
      const downloadURL = item.URL2;
      const supported = await Linking.canOpenURL(downloadURL);

      if (supported) {
        await Linking.openURL(downloadURL);
      } else {
        console.error('Cannot open the download link');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
  };

  const handleEdit = () => {
    // Navigate to the EditFile screen
    navigation.navigate("EditFile", { id: item.ResourceID });
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("Resources")
        .delete()
        .match({ ResourceID: item.ResourceID });
      if (error) {
        throw error;
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting file:", error.message || error);
    }
  };
  return (
    <Layout style={{ backgroundColor: uploadDateColor ? themeColor.black : themeColor.white }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons style={{
        marginTop: 15,
        marginBottom: 10, 
        
        marginLeft: 20,
      
      }} name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
 <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.fileName}>File Name : {item.ResourceName}</Text>
        <Text style={styles.visibilityMode}>{item.VisibilityMode}</Text>
      </View>        
      <Text style={styles.uploadDate}>Uploaded on: {item.created_at}</Text>
        <View style={styles.buttonsContainer}>
          <Button text="Read" onPress={handleRead} style={styles.button} />
          {item.VisibilityMode == "Download" && (
          <Button text="Download" onPress={handleDownload} style={styles.button} />
          )}
          {user.is_admin && (
          <Button text="Edit" onPress={handleEdit} style={styles.button} />
          )}
          {user.is_admin && (
            <Button text="Delete" onPress={handleDelete} style={styles.button} />
            )}
        </View>
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  fileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: themeColor.primary,
  },
  uploadDate: (isDarkmode:any) => ({
    fontSize: 16,
    color: isDarkmode ? themeColor.primary : themeColor.dark,
    marginBottom: 20,
  }),
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: (isDarkmode) => ({
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: isDarkmode ? themeColor.dark : themeColor.primary,
  }),
  buttonsContainer : {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },

});
