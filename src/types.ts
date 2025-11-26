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

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'PARTNER';

// Status quy trình duyệt của Partner
export type PartnerStatus = 'pending_review' | 'payment_pending' | 'active' | 'rejected';

// Interface User kế thừa BaseEntity nhưng ghi đè lại status
export interface User extends Omit<BaseEntity, 'status'> {
    email: string;
    displayName: string;
    phoneNumber: string;
    photoURL?: string;
    userType: UserRole;

    // Status đa hình: 
    // - Customer/Admin: true (active), false (banned)
    // - Partner: PartnerStatus (chuỗi quy trình)
    status: boolean | PartnerStatus;

    // Dữ liệu riêng cho Partner (Optional)
    agencyName?: string;
    reason?: string;
    // Mã đơn thanh toán nếu hệ thống tạo link thanh toán bên thứ 3 (PayOS)
    payosOrderCode?: string;

    // Dữ liệu riêng cho Customer (Optional - lấy từ mẫu cũ của bạn)
    rank?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    pointReward?: number;
    coupons?: string[];
    savedTours?: string[];
}