import { View, StyleSheet, TextInput,Alert } from "react-native";
import { Layout, Text, Button, useTheme, themeColor } from "react-native-rapi-ui";
import { supabase } from "../../initSupabase";
import { useEffect,useState } from "react";
import { Picker } from '@react-native-picker/picker';

export default function EditFolder({navigation,route}) {
  const { Folder_ID ,FolderName} = route.params;

  const [Folder_Name, setFolder_Name] = useState('');
  const [selectedSubject, setSelectedSubject] = useState([] as any);
  const [subjects, setSubjects] = useState([] as any);
  const [selectedParentFolder, setSelectedParentFolder] = useState([] as any);
  const [ParentFolder, setParentFolder] = useState([] as any);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchFile();
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*");

      if (error) {
        console.error("Error fetching subjects:", error.message || error);
      } else {
        setSubjects(data);
        
      }
    }catch (error: any) {
      console.error("Error fetching subjects:", error.message || error);
    }finally {
      setLoading(false);
    }

  };

  const fetchFile = async () => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("FolderID", Folder_ID)
        .single();
        console.log(data);
      if (error) {
        console.error("Error fetching file:", error.message || error);
      } else {

        setFolder_Name(data.FolderName); 
        setSelectedSubject(data.SubjectID);
        setSelectedParentFolder(data.ParentFolderID);
      }
    }catch (error: any) {
      console.error("Error fetching file:", error.message || error);
    }finally
    {
      setLoading(false);
    }
  };


  useEffect(() => {
    
  }, [selectedSubject]);

  const fetchParentFolder = async () => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        console.log(data);
      if (error) {
        console.error("Error fetching parent folder:", error.message || error);
      } else {
        setParentFolder(data);
      }
    } catch (error) {
      console.error("Error fetching parent folder:", error);
    }
  };
  useEffect(() => {
  if (selectedSubject){
      fetchParentFolder();
    }
  }
  , [selectedSubject]);
  const handleSaveChanges = async () => {
    try {
      if (!Folder_Name) {
        Alert.alert("All fields are required");
        console.log(Folder_Name);
        return;
      }
  
      // Update the file details in the Resources table
      const { data: updateData, error: updateError } = await supabase
        .from('folders')
        .update({
          FolderName: Folder_Name,
          SubjectID: selectedSubject,
          ParentFolderID: selectedParentFolder,
        })
        .eq('FolderID', Folder_ID);
  
      if (updateError) {
        console.error("Error updating file details:", updateError.message || updateError);
      } else {
        console.log("File details updated successfully:", updateData);
        Alert.alert("Folder Updated Successfully");
        navigation.goBack(); 
      }
    } catch (error) {
      console.error("Error updating file details:", error.message || error);
    }
  };

  return (
    <Layout>
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Folder</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Folder Name:</Text>
        <TextInput
          style={styles.input}
          value={Folder_Name}
          onChangeText={(text) => setFolder_Name(text)}
        />
         <Text style={{ marginTop: 10 }}>Select Subject</Text>
          <Picker
              onValueChange={(itemValue) => setSelectedSubject(itemValue)}
              selectedValue={selectedSubject}
              style={styles.picker}

          >
            <Picker.Item label="Select Subject" value="" />
            {subjects.map((subject: any) => (
              <Picker.Item
                key={subject.id}
                label={subject.Name}
                value={subject.id}
              />
            ))}

          </Picker>
          <Text style={{ marginTop: 10 }}>Parent Folder</Text>
          <Picker
              onValueChange={(itemValue) => setSelectedParentFolder(itemValue)}
              selectedValue={selectedParentFolder}
              style={styles.picker}

          >
            <Picker.Item label="Select Parent Folder" value="" />
            {ParentFolder.map((PF: any) => (
              <Picker.Item
                key={PF.FolderID}
                label={PF.FolderName}
                value={PF.FolderID}
              />
            ))}

          </Picker>
         
          
      </View>
      
      <Button text="Save Changes" onPress={handleSaveChanges} style={styles.button} />
    </View>
  </Layout>
  )
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
