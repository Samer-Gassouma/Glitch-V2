import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet ,Alert} from "react-native";
import { Layout, Text, useTheme, themeColor } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger,MenuProvider } from 'react-native-popup-menu';
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";



type DetailScreenProps = NativeStackScreenProps<MainStackParamList, 'Detail'>;


const DetailScreen: React.FC<DetailScreenProps> = ({ route }) => {

  const [subjects, setSubjects] = useState([]);
  const id = route.params.id;
  const [Resources, setResources] = useState([] as any);
  const [folders, setFolders] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  const fetchData = useCallback(async () => {
    try {
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("Resources")
        .select("*")
        .eq("FolderID", id);
      setResources(resourcesData || []);

      if (resourcesError) {
        throw resourcesError;
      } 
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('ParentFolderID', id);

      if (foldersError) {
        throw foldersError;
      }

      setFolders(foldersData || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleEditFolder = (Folder_ID:any,FolderName:any) => {
    navigation.navigate('EditFolder', { Folder_ID ,FolderName});
  }

  const handleDeleteFolder = async (Folder_ID :any) => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('FolderID', Folder_ID);

      if (error) {
        throw error;
      }
      Alert.alert("Folder Deleted Successfully");
      navigation.goBack();
    } catch (error) {
      console.log(error.message);
    }
  }


  const renderSubjectItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.subjectItem, { flexDirection: 'row', justifyContent: 'space-between' }]}
      onPress={() => navigation.navigate('Detail', { id: item.FolderID })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons
          name="folder"
          size={24}
          color={themeColor.white}
          style={styles.folderIcon}
        />
        <Text style={styles.subjectItemText}>{item.FolderName}</Text>
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
          <MenuOption onSelect={() => handleEditFolder(item.FolderID,item.FolderName)}>
            <Text style={styles.menuOptionText}>Edit</Text>
          </MenuOption>
          <MenuOption onSelect={() => handleDeleteFolder(item.FolderID)}>
            <Text style={styles.menuOptionText}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
      }
    </TouchableOpacity>
  );

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resourceItem}
      onPress={() => navigation.navigate('DetailFile', { id: item.ResourceID })}
    >
      <FontAwesome
        name="file-o"
        size={24}
        color={themeColor.white}
        style={styles.fileIcon}
      />
      <Text style={styles.resourceItemText}>{item.ResourceName}</Text>
    </TouchableOpacity>
  );

  if(loading) {
    return (
      <Layout>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </Layout>
    )
  }
  
  if(!loading && folders.length === 0 && Resources.length === 0) {
    return (
      <Layout>
          <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons style={{
        marginTop: 5,
        marginBottom: 5, 
        
        marginLeft: 20,
      
      }} name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
        <Text style={{ 
          textAlign: 'center', 
          marginTop: 120, 
          fontSize: 16, 
          justifyContent: 'center',
          alignItems: 'center',
          
        }}>No files or folders found.</Text>
      </Layout>
    )
  }

  return (
    <MenuProvider>

    <Layout>
       <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons style={{
        marginTop: 5,
        marginBottom: 5, 
        
        marginLeft: 20,
      
      }} name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
      <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
  

      <FlatList
        data={folders}
        keyExtractor={(item) => item.FolderID.toString()}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.subjectList}
      />

        <FlatList
            data={Resources}
            keyExtractor={(item) => item.ResourceID.toString()}
            renderItem={renderResourceItem}
            contentContainerStyle={styles.subjectList}
        />
    </Layout>
    </MenuProvider>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  subjectList: {
    padding: 20,
  }, 
  spinnerTextStyle: {
    color: '#FFF',
  },
  subjectItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColor.danger300,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  folderIcon: {
    marginRight: 10,
    color: themeColor.dark,
  },
  subjectItemText: {
    fontSize: 16,
    color: themeColor.dark,
  },

  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColor.info900,
    padding: 14,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  fileIcon: {
    marginRight: 10,
  },
  resourceItemText: {
    fontSize: 16,
    color: themeColor.white,
  },

  menuOptionText: {
    fontSize: 16,
    color: themeColor.dark,
    padding: 10,
  },

});
