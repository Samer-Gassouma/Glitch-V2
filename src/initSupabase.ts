import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { initializeApp } from "firebase/app";


const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YmZzbndmemt5eXpwc2Zwdm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwODMwODgsImV4cCI6MjAyMTY1OTA4OH0.rsJ6cJsDOkQCBVI5eutfiFuGgNQJ2v3KgWG5chqwv7Q"

const firebaseConfig = {
  apiKey: "AIzaSyCCjWIZToi5mzvFWeOynRpEOWQyMYjmLnE",
  authDomain: "glitch-b2794.firebaseapp.com",
  databaseURL: "https://glitch-b2794-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "glitch-b2794",
  storageBucket: "glitch-b2794.appspot.com",
  messagingSenderId: "124197801380",
  appId: "1:124197801380:web:3805e52729963b12a6c531"
};
export const firebaseApp = initializeApp(firebaseConfig);

export const supabase = createClient("https://pxbfsnwfzkyyzpsfpvmv.supabase.co", key, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
});
