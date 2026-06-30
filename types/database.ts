export type VenueSource = 'google' | 'user' | 'owner';

export interface Profile {
  id: string;
  username: string | null;
  city: string | null;
  points: number;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  location: unknown | null; // PostGIS geography type
  source: VenueSource;
  google_place_id: string | null;
  verified: boolean;
  created_by: string | null;
  created_at: string;
}

export interface MenuItem {
  id: string;
  venue_id: string;
  name: string;
  menu_price: number | null;
  currency: string;
  created_at: string;
}

export interface Receipt {
  id: string;
  venue_id: string;
  user_id: string;
  image_url: string | null;
  parsed_data: Record<string, unknown> | null;
  created_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  item_name: string | null;
  receipt_price: number | null;
  matched_menu_item_id: string | null;
}

export interface Review {
  id: string;
  venue_id: string;
  user_id: string;
  rating: number;
  text: string | null;
  receipt_id: string | null;
  created_at: string;
}

// Joined types for UI
export interface VenueWithStats extends Venue {
  avg_rating: number | null;
  review_count: number;
  has_price_discrepancy: boolean;
}

export interface MenuItemWithDiscrepancy extends MenuItem {
  latest_receipt_price: number | null;
  price_diff: number | null;
}

export interface ReviewWithProfile extends Review {
  profiles: Pick<Profile, 'username'>;
  is_verified: boolean; // receipt_id !== null
}
