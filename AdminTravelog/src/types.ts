import { Timestamp } from 'firebase/firestore';

export interface BaseEntity {
    id: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    status: boolean; // true = active, false = soft deleted
}

export interface Tour extends BaseEntity {
    title: string;
    description: string;
    price: number;
    duration: { days: number; nights: number };
    images: string[];
    averageRating: number;
    reviewCount: number;
    departurePoint: string;
    destinationIDs: string[];
    itinerary: { day: number; title: string; details: string }[];
    transport: string;
}

export interface Coupon extends BaseEntity {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxDiscount?: number;
    validFrom: Timestamp;
    validUntil: Timestamp;
    usageLimit: number;
    usedCount: number;
    description: string;
}

export interface Destination extends BaseEntity {
    name: string;
    country: string;
    description: string;
    imageUrl: string;
    popular: boolean;
    tourCount: number;
}
