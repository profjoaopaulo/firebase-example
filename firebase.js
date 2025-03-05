import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Suas configurações de aplicativo do Firebase - Preencha com as suas credenciais
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db }; // Exporta a instância do Firestore para ser usada em outros arquivos