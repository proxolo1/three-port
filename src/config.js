import { collection, addDoc, getDocs } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
export default class Config {
    constructor() {
        this.firebaseConfig =
        {
            apiKey: "AIzaSyDqeIeHdTodMCizOlA6uAxn7S0qAT7h3Ws",
            authDomain: "proxoloo.firebaseapp.com",
            projectId: "proxoloo",
            storageBucket: "proxoloo.appspot.com",
            messagingSenderId: "256159945638",
            appId: "1:256159945638:web:45388f7e0073d3cf523567",
            measurementId: "G-TTMHVYJPXE"
        };

    }

    readFirestore(){
        const app = initializeApp(this.firebaseConfig);
         const db = getFirestore(app);
        
    }
}