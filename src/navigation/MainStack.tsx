import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SecondScreen from "../screens/SecondScreen";
import SubjectDetail from "../screens/SubjectDetail";
import DetailFile from "../screens/DetailFile";
import EditFile from "../screens/EditFile";
import MainTabs from "./MainTabs";
import AddCourse from "../screens/AddCourse";
import Detail from "../screens/Detail";

import AddFolder from "../screens/folder/AddFolder";
import EditFolder from "../screens/folder/EditFolder";

import AddSubject from "../screens/subject/AddSubject";
import EditSubject from "../screens/subject/EditSubject";

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,

      }}
      
    > 
    
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />
      <MainStack.Screen name="SubjectDetail" component={SubjectDetail} />
      <MainStack.Screen name="DetailFile" component={DetailFile} />
      <MainStack.Screen name="EditFile" component={EditFile} />
      <MainStack.Screen name="AddCourse" component={AddCourse} />
      <MainStack.Screen name="Detail" component={Detail} />

      <MainStack.Screen name="AddFolder" component={AddFolder} />
      <MainStack.Screen name="EditFolder" component={EditFolder} />

      <MainStack.Screen name="AddSubject" component={AddSubject} />
      <MainStack.Screen name="EditSubject" component={EditSubject} />
    </MainStack.Navigator>
  );
};

export default Main;
