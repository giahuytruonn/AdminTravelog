import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Coupon } from "../types";

const COLLECTION_NAME = "coupons";

export const couponsService = {
  getAll: async (): Promise<Coupon[]> => {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Coupon)
    );
  },

  create: async (
    data: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  update: async (id: string, data: Partial<Coupon>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  setStatus: async (id: string, status: boolean): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },
};
