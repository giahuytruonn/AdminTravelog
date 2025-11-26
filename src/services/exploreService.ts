import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { ExploreVideo } from '../types';

const COLLECTION_NAME = 'explores';

export const exploreService = {
    // Lấy tất cả video
    getAll: async (): Promise<ExploreVideo[]> => {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExploreVideo));
    },

    // Tạo mới
    create: async (data: Omit<ExploreVideo, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'likes'>): Promise<string> => {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            likes: 0, // Mặc định 0 like khi tạo mới
            status: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    },

    // Cập nhật
    update: async (id: string, data: Partial<ExploreVideo>): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    },

    // Cập nhật trạng thái
    setStatus: async (id: string, status: boolean): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
    }
};