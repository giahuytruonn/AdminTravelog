import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    getDocs,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { BaseEntity } from '../types';

interface UseFirestoreQueryResult<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useFirestoreQuery<T extends {id : string}>(
    collectionName: string,
    constraints: QueryConstraint[] = []
): UseFirestoreQueryResult<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ref = collection(db, collectionName);
            const q = query(ref, ...constraints);
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as T[];

            setData(items);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [collectionName, JSON.stringify(constraints)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
