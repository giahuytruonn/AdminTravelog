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
import type { ExploreVideo } from '../types';

const COLLECTION_NAME = 'explores';

export const exploreService = {
    // Lấy tất cả video (Active)
    getAll: async (): Promise<ExploreVideo[]> => {
        const q = query(collection(db, COLLECTION_NAME), where('status', '==', true));
        const snapshot = await getDocs(q);
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

    // Xóa mềm (Soft Delete)
    softDelete: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: false,
            updatedAt: serverTimestamp()
        });
    },

    // Khôi phục
    restore: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: true,
            updatedAt: serverTimestamp()
        });
    }
};