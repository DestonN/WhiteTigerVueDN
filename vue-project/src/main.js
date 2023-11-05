import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';
import Rating from 'primevue/rating';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';

import 'primevue/resources/themes/lara-light-teal/theme.css'
// import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
import 'primeicons/primeicons.css';

import StyleClass from 'primevue/styleclass';




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
app.use(ToastService)

app.directive('styleclass', StyleClass);

app.component('Header', Header)
.component('Footer', Footer)
.component('Toolbar', Toolbar)
.component('InputText', InputText)
.component('Column', Column)
.component('Rating', Rating)
.component('Tag', Tag)
.component('DataTable', DataTable)
.component('Textarea', Textarea)
.component('Dropdown', Dropdown)
.component('ButtonArrow', Button)
.component('RadioButton', RadioButton)
.component('InputNumber', InputNumber)
.component('Dialog', Dialog)
.component('FileUpload', FileUpload)

app.mount('#app')
