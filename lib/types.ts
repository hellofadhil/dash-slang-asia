/**
 * Tipe data untuk statistik dashboard
 */
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  totalEvents: number
  totalTrainers: number
  totalPartners: number
  totalEventCategories: number
  recentOrders: any[]
  recentEvents: Event[]
  topProducts: {
    id: string
    name: string
    sales: number
  }[]
  salesByDay: {
    date: string
    sales: number
  }[]
}

/**
 * Tipe data untuk Event
 */
export interface Event {
  id: string
  title: string
  description: string
  categoryId: string
  categoryName: string
  trainerId: string
  trainerName: string
  partnerId?: string
  partnerName?: string
  location: string
  startDate: number
  endDate: number
  price: number
  capacity: number
  enrolled: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  image?: string
  createdAt: number
  updatedAt: number
}

/**
 * Tipe data untuk form Event
 */
export interface EventFormData {
  title: string
  description: string
  categoryId: string
  trainerId: string
  partnerId?: string
  location: string
  startDate: number
  endDate: number
  price: number
  capacity: number
  enrolled: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  image?: string
}

/**
 * Tipe data untuk Trainer
 */
export interface Trainer {
  id: string
  name: string
  email: string
  specialization: string
  bio: string
  experience: number // dalam tahun
  rating?: number
  status: "active" | "inactive"
  avatar?: string
  phone?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    website?: string
  }
  createdAt: number
  updatedAt?: number
}

/**
 * Tipe data untuk form Trainer
 */
export interface TrainerFormData {
  name: string
  email: string
  specialization: string
  bio: string
  experience: number
  rating?: number
  status: "active" | "inactive"
  avatar?: string
  phone?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    website?: string
  }
}

/**
 * Tipe data untuk Partner
 */
export interface Partner {
  id: string
  name: string
  description: string
  type: "corporate" | "academic" | "nonprofit" | "government"
  website?: string
  logo?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  status: "active" | "inactive"
  createdAt: number
  updatedAt?: number
}

/**
 * Tipe data untuk form Partner
 */
export interface PartnerFormData {
  name: string
  description: string
  type: "corporate" | "academic" | "nonprofit" | "government"
  website?: string
  logo?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  status: "active" | "inactive"
}

/**
 * Tipe data untuk EventCategory
 */
export interface EventCategory {
  id: string
  name: string
  description: string
  color?: string
  icon?: string
  status: "active" | "inactive"
  createdAt: number
  updatedAt?: number
}

/**
 * Tipe data untuk form EventCategory
 */
export interface EventCategoryFormData {
  name: string
  description: string
  color?: string
  icon?: string
  status: "active" | "inactive"
}


export type Class = {
  id: number;
  name: string;
  description: string;
  category: string; 
  type: "no private" | "private"; 
  startDate: number;
  endDate: number;
  price: number;
  status: "active" | "inactive" | "upcoming" | "on going"; 
  image?: string;
  color?: string
  icon?: string
};

/**
 * Tipe data untuk form Class
 */
export interface ClassFormData {
  name: string;
  description: string;
  category: string;
  type: "no private" | "private"; 
  startDate: number;
  endDate: number;
  price: number;
  status: "active" | "inactive" | "upcoming" | "on going";
  image: string;
  color?: string;
  icon?: string;
}



// export interface Participant {
//   id: string
//   name: string
//   phoneNumber: string
//   email: string
//   birthDate: number // timestamp
//   birthPlace: string
//   address: string
//   currentResidence: string
//   reason: string
//   status: "pending" | "accepted" | "rejected"
//   lastEducation: string
//   classId: string // relasi ke Class
//   createdAt: number
//   updatedAt: number
// }

export interface Participant {
  id: string
  name: string
  phoneNumber: string
  email: string
  birthDate: number // timestamp
  birthPlace: string
  address: string
  currentResidence: string
  reason: string
  status: "pending" | "accepted" | "rejected" // status peserta (pending menunggu verifikasi)
  lastEducation: string
  classId: string // relasi ke Class
  createdAt: number
  updatedAt: number
}

export interface PaymentFile {
  id: string // ID pembayaran
  participantId: string // ID peserta yang mengirimkan pembayaran
  filePath: string // Path file pembayaran
  verified: boolean // Status verifikasi oleh admin
  verificationDate?: number // Tanggal verifikasi pembayaran
  verificationStatus: "pending" | "verified" | "invalid" // Status verifikasi admin
}


/**
 * Tipe data untuk form PaymentFile
 */

export interface PaymentFileFormData {
  participantId: string; // ID peserta yang mengirimkan pembayaran
  filePath: string; // Path file pembayaran
  verified: boolean; // Status verifikasi oleh admin
  verificationDate?: number; // Tanggal verifikasi pembayaran
  verificationStatus: "pending" | "verified" | "invalid"; // Status verifikasi admin
}

export interface PaymentDetail {
  payment: PaymentFile
  participant: Participant
}
