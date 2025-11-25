import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import type { User as UserType } from '../types'; // Import cái interface User mới mình đã sửa ở bài trước

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Lấy thông tin chi tiết từ Firestore (để biết role và status)
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data() as UserType);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, userProfile, loading };
}