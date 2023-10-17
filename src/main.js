import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueFire } from 'vuefire'
import { initializeApp } from 'firebase/app'

const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
});


createApp(App)
    .use(VueFire, {
        firebaseApp,
        // add modules like VueFireAuth, ...
        modules: [],
    })
    .mount('#app')
