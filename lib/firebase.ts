import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"

/**
 * Konfigurasi Firebase
 * Berisi kredensial dan pengaturan untuk koneksi ke Firebase
 */
const firebaseConfig = {
  apiKey: "AIzaSyCDXGe7qYScSvBbT0ed44vfd7yj6GmGcoM",
  authDomain: "training-b34f7.firebaseapp.com",
  databaseURL: "https://training-b34f7-default-rtdb.firebaseio.com",
  projectId: "training-b34f7",
  storageBucket: "training-b34f7.firebasestorage.app",
  messagingSenderId: "946439855027",
  appId: "1:946439855027:web:6176004d1a919aa5be09c6",
  measurementId: "G-77LH0CR4EH"
};

// Inisialisasi variabel Firebase
let app
let database
let storage
let auth

try {
  // Inisialisasi Firebase
  app = initializeApp(firebaseConfig)
  database = getDatabase(app)
  storage = getStorage(app)
  auth = getAuth(app)

  // Atur persistensi ke LOCAL untuk menjaga user tetap login
  if (typeof window !== "undefined") {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting auth persistence:", error)
    })
  }
} catch (error) {
  console.error("Error initializing Firebase:", error)
  // Sediakan fallback atau tangani error dengan tepat
  app = null
  database = null
  storage = null
  auth = null
}

export { app, database, storage, auth }

