import { View, Text, StyleSheet, Dimensions ,Linking,TouchableOpacity } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf';
import { Ionicons } from '@expo/vector-icons';

const PdfRead = ({navigation,route}) => {
    const { url } = route.params;
    const PdfResource = { uri: url, cache: true };
    const resourceType = url.split('.').pop().split(/\#|\?/)[0];
    console.log(resourceType);
    const resourceTypeArray = ['pdf','doc','docx','xls','xlsx','ppt','pptx'];
    const isResourceType = resourceTypeArray.includes(resourceType);
    console.log(isResourceType);
    const openWithLinking = () => {
        Linking.openURL(url);
    };
    const handleDownload = async () => {
        if(url) {
        try {
          const supported = await Linking.canOpenURL(url);
    
          if (supported) {
            await Linking.openURL(url);
          } else {
            console.error('Cannot open the download link');
          }
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      }
      };
    
    return (
        <View style={styles.container}>
            
            <Pdf 
                trustAllCerts={false}
                source={PdfResource}
                style={styles.pdf}
                onError={(error) => {
                    openWithLinking();
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`number of pages: ${numberOfPages}`);
                }}
            />
            <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.back}>
                    <Ionicons name="arrow-back" size={30} color={'#666'} />
                </TouchableOpacity>
               <TouchableOpacity onPress={handleDownload} style={styles.fab}>
                    <Ionicons name="code-download" size={30} color={'#666'} />
                </TouchableOpacity>
        </View>
    )
}

export default PdfRead

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title:{
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    fab: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        height: 50,
        borderRadius: 20,
      },
      
        back: {
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
})