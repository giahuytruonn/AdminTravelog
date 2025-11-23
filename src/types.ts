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
    type: 'percentage' | 'fixed';
    cost: number; // discount value
    minimumOrderValue: number;
    maximumDiscount: number | null;
    timeStart: Timestamp;
    timeEnd: Timestamp;
    usageLimit?: number;
    usedCount?: number;
    description: string;
    title: string;
    applicableRanks: string[] | null;
    applicableTours: string[] | null;
}

export interface Destination extends BaseEntity {
    name: string;
    country: string;
    description: string;
    coverImage: string;
    popular?: boolean;
    tourCount?: number;
}

export interface ExploreVideo {
  id: string;
  tourID: string | null; // Null nếu là video quảng bá chung
  videoLink: string;
  title: string;
  description: string;
  likes: number;
  status: boolean;
  createdAt: any;
  updatedAt?: any;
}