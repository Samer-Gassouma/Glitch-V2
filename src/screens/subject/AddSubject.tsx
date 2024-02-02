import { View, StyleSheet, TextInput,Alert } from "react-native";
import { Layout, Text, Button, useTheme, themeColor } from "react-native-rapi-ui";
import { supabase } from "../../initSupabase";
import { useEffect,useState } from "react";
import { useNavigation } from "@react-navigation/native";
export default function AddSubject() {

  const navigation = useNavigation();
  const [newSubjectName, setnewSubjectName] = useState("");

  const handleSaveChanges = async () => {
    try {
      if (!newSubjectName) {
        Alert.alert("All fields are required");
        console.log(newSubjectName);
        return;
      }
  
      // Update the file details in the Resources table
      const { data: updateData, error: updateError } = await supabase
        .from('subjects')
        .insert({
            Name: newSubjectName,
        });
  
      if (updateError) {
        console.error("Error updating file details:", updateError.message || updateError);
      } else {
        console.log("File details Insert it successfully:", updateData);
        Alert.alert("Subject Inserted Successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating file details:", error.message || error);
    }
  };

  return (
    <Layout>
    <View style={styles.container}>
      <Text style={styles.heading}>ADD Subject</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Subject Name:</Text>
        <TextInput
          style={styles.input}
          value={newSubjectName}
          onChangeText={(text) => setnewSubjectName(text)}
        />
      </View>
      
      <Button text="Save" onPress={handleSaveChanges} style={styles.button} />
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
