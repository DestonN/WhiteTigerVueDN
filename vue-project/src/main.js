import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/mira/theme.css'

// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJzQGWfTgB_dno-BkXTyYlwY8CDUvnyYY",
  authDomain: "whitetiger-20ec3.firebaseapp.com",
  projectId: "whitetiger-20ec3",
  storageBucket: "whitetiger-20ec3.appspot.com",
  messagingSenderId: "266932814458",
  appId: "1:266932814458:web:ced30ffd34c35e735bb1c3"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase

const app = createApp(App)

app.use(router)
app.use(PrimeVue)

app.mount('#app')
