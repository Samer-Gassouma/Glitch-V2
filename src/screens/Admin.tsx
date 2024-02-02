import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet} from 'react-native';
import { Layout, Text, Button } from 'react-native-rapi-ui';
import { supabase } from '../initSupabase';
export default function Admin() {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [nbUsers, setNbUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }
  , []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id');
      if (error) {
        throw error;
      }
      setNbUsers(data.length);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Total 
          Users : {nbUsers}
        </Text>
        <Button
          text="ADD Course"
          onPress={() =>
            navigation.navigate('AddCourse')
          }
          style={styles.button}
        />
        <Button
          text="ADD Folder"
          onPress={() => 
            navigation.navigate('AddFolder')
          }
          style={styles.button}
        />
        <Button
          text="ADD Subject"
          onPress={() => 
            navigation.navigate('AddSubject')
          }
          style={styles.button}
        />

      
      </View>
    </Layout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 80,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  CloseButton: {
    marginTop: 10,
    paddingHorizontal: 80,
    backgroundColor: 'white',
    color: 'black',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,

  },
});