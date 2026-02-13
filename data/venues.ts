export interface Venue {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  category: string;
}

export const recentlyViewed: Venue[] = [
  {
    id: "venue-001",
    name: "Urban Cuts Barbershop",
    image: "https://picsum.photos/seed/venue1/400/300",
    rating: 4.8,
    reviewCount: 342,
    address: "123 Main St, New York, NY 10001",
    category: "Barber"
  },
  {
    id: "venue-002",
    name: "Luminous Hair Studio",
    image: "https://picsum.photos/seed/venue2/400/300",
    rating: 4.9,
    reviewCount: 521,
    address: "456 Oak Ave, Los Angeles, CA 90001",
    category: "Hair Salon"
  },
  {
    id: "venue-003",
    name: "Zen Spa Wellness",
    image: "https://picsum.photos/seed/venue3/400/300",
    rating: 4.7,
    reviewCount: 289,
    address: "789 Elm Rd, Miami, FL 33101",
    category: "Spa"
  }
];

export const recommended: Venue[] = [
  {
    id: "venue-004",
    name: "Luxe Nails & Beauty",
    image: "https://picsum.photos/seed/venue4/400/300",
    rating: 4.9,
    reviewCount: 612,
    address: "321 Park Ln, Chicago, IL 60601",
    category: "Nails"
  },
  {
    id: "venue-005",
    name: "Prestige Hair Design",
    image: "https://picsum.photos/seed/venue5/400/300",
    rating: 4.8,
    reviewCount: 458,
    address: "654 Maple Dr, Houston, TX 77001",
    category: "Hair Salon"
  },
  {
    id: "venue-006",
    name: "Serenity Massage & Spa",
    image: "https://picsum.photos/seed/venue6/400/300",
    rating: 4.7,
    reviewCount: 376,
    address: "987 Cedar St, Phoenix, AZ 85001",
    category: "Spa"
  },
  {
    id: "venue-007",
    name: "Classic Gents Barber",
    image: "https://picsum.photos/seed/venue7/400/300",
    rating: 4.9,
    reviewCount: 534,
    address: "147 Birch Ave, Philadelphia, PA 19101",
    category: "Barber"
  }
];

export const newVenues: Venue[] = [
  {
    id: "venue-008",
    name: "Modern Beauty Studio",
    image: "https://picsum.photos/seed/venue8/400/300",
    rating: 4.6,
    reviewCount: 124,
    address: "258 Willow Ct, San Antonio, TX 78201",
    category: "Hair Salon"
  },
  {
    id: "venue-009",
    name: "Elite Nail Spa",
    image: "https://picsum.photos/seed/venue9/400/300",
    rating: 4.5,
    reviewCount: 87,
    address: "369 Ash Blvd, San Diego, CA 92101",
    category: "Nails"
  },
  {
    id: "venue-010",
    name: "Wellness Touch Spa",
    image: "https://picsum.photos/seed/venue10/400/300",
    rating: 4.7,
    reviewCount: 156,
    address: "741 Pine Rd, Dallas, TX 75201",
    category: "Spa"
  },
  {
    id: "venue-011",
    name: "Fade Masters Barber",
    image: "https://picsum.photos/seed/venue11/400/300",
    rating: 4.8,
    reviewCount: 198,
    address: "852 Oak Pl, Austin, TX 78701",
    category: "Barber"
  },
  {
    id: "venue-012",
    name: "Radiant Skin Studio",
    image: "https://picsum.photos/seed/venue12/400/300",
    rating: 4.6,
    reviewCount: 145,
    address: "963 Spruce Ln, Portland, OR 97201",
    category: "Skincare"
  }
];

export const trending: Venue[] = [
  {
    id: "venue-013",
    name: "Glam & Glow Hair Studio",
    image: "https://picsum.photos/seed/venue13/400/300",
    rating: 4.9,
    reviewCount: 789,
    address: "1024 Sycamore St, Denver, CO 80201",
    category: "Hair Salon"
  },
  {
    id: "venue-014",
    name: "Diamond Nails & Aesthetics",
    image: "https://picsum.photos/seed/venue14/400/300",
    rating: 5.0,
    reviewCount: 643,
    address: "2048 Poplar Ave, Boston, MA 02101",
    category: "Nails"
  },
  {
    id: "venue-015",
    name: "Holistic Wellness Center",
    image: "https://picsum.photos/seed/venue15/400/300",
    rating: 4.9,
    reviewCount: 567,
    address: "3072 Juniper Rd, Seattle, WA 98101",
    category: "Spa"
  },
  {
    id: "venue-016",
    name: "Iconic Barber Shop",
    image: "https://picsum.photos/seed/venue16/400/300",
    rating: 4.8,
    reviewCount: 651,
    address: "4096 Hickory Ln, Miami, FL 33101",
    category: "Barber"
  },
  {
    id: "venue-017",
    name: "Premier Hair Extensions",
    image: "https://picsum.photos/seed/venue17/400/300",
    rating: 4.7,
    reviewCount: 421,
    address: "5120 Ash Dr, Atlanta, GA 30301",
    category: "Hair Salon"
  }
];
