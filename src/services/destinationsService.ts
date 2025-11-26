import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Destination } from '../types';

const COLLECTION_NAME = 'destinations';

export const destinationsService = {
    getAll: async (): Promise<Destination[]> => {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
    },

    create: async (data: Omit<Destination, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            status: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    },

    update: async (id: string, data: Partial<Destination>): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    },

    setStatus: async (id: string, status: boolean): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
    }
};
