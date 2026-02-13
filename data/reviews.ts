export interface Review {
  id: string;
  stars: number;
  title: string;
  text: string;
  avatar: string;
  name: string;
  city: string;
}

export const reviews: Review[] = [
  {
    id: "review-001",
    stars: 5,
    title: "Absolutely fantastic experience!",
    text: "I found the perfect salon through Fresha and had an amazing haircut. The booking process was so easy and convenient. I'll definitely be using it again for all my beauty needs!",
    avatar: "https://picsum.photos/seed/avatar1/100/100",
    name: "Sarah Johnson",
    city: "New York"
  },
  {
    id: "review-002",
    stars: 5,
    title: "Best barber shop experience",
    text: "Fresha helped me find a local barber with great reviews. The app made it simple to book an appointment at a time that works for me. The barber was professional and did an excellent job.",
    avatar: "https://picsum.photos/seed/avatar2/100/100",
    name: "Michael Chen",
    city: "Los Angeles"
  },
  {
    id: "review-003",
    stars: 5,
    title: "Spa day perfection",
    text: "I discovered an incredible spa through Fresha. The whole experience from booking to the actual massage was outstanding. The staff was welcoming and the service exceeded my expectations!",
    avatar: "https://picsum.photos/seed/avatar3/100/100",
    name: "Emma Williams",
    city: "Miami"
  },
  {
    id: "review-004",
    stars: 5,
    title: "So convenient and reliable",
    text: "Fresha makes it incredibly easy to find and book appointments at beauty professionals near me. The reviews on the platform are accurate and helpful. Highly recommend!",
    avatar: "https://picsum.photos/seed/avatar4/100/100",
    name: "Jessica Martinez",
    city: "Chicago"
  }
];
