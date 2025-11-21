import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Tour } from '../types';

const COLLECTION_NAME = 'tours';

export const toursService = {
    getAll: async (): Promise<Tour[]> => {
        const q = query(collection(db, COLLECTION_NAME), where('status', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
    },

    create: async (data: Omit<Tour, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            status: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    },

    update: async (id: string, data: Partial<Tour>): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    },

    softDelete: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: false,
            updatedAt: serverTimestamp()
        });
    },

    restore: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: true,
            updatedAt: serverTimestamp()
        });
    }
};
