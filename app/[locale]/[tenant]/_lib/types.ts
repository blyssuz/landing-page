import type { Locale } from '@/lib/i18n';

export type { Locale };

export interface MultilingualText {
  uz: string;
  ru: string;
}

export interface Service {
  id: string;
  name: MultilingualText;
  description?: MultilingualText | null;
  price: number;
  duration_minutes: number;
  category?: string;
}

export interface Employee {
  id: string;
  first_name: string | null;
  last_name: string | null;
  position: string;
  services: {
    id: string;
    service_id: string;
    name: MultilingualText | null;
    price: number;
    duration_minutes: number;
  }[];
}

export interface Photo {
  id: string;
  url: string;
  category: 'interior' | 'exterior';
  order: number;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}

export interface Review {
  id: string;
  customer_name: string;
  comment: string;
  submitted_at: string;
  rating: number | null;
  services: { service_name: MultilingualText | string; employee_name: string }[];
}

export interface Business {
  id?: string;
  name: string;
  bio?: string;
  business_type: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  working_hours?: Record<string, { start: number; end: number; is_open: boolean }>;
  business_phone_number: string;
  tenant_url: string;
  avatar_url?: string | null;
  cover_url?: string | null;
  review_stats?: ReviewStats | null;
  social_media?: {
    instagram?: string;
  };
  tagline?: string;
  primary_color?: string | null;
}

export interface SavedUser {
  phone: string;
  first_name: string;
  last_name: string;
}

export interface TenantPageProps {
  business: Business;
  services: Service[];
  employees: Employee[];
  photos: Photo[];
  reviews: Review[];
  tenantSlug: string;
  businessId: string;
  locale: Locale;
  savedUser: SavedUser | null;
}
