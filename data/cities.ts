export interface ServiceLink {
  name: string;
  slug: string;
}

export interface City {
  name: string;
  services: ServiceLink[];
}

export interface CountryCities {
  [country: string]: City[];
}

export const citiesByCountry: CountryCities = {
  "Australia": [
    {
      name: "Sydney",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Spas", slug: "spas" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Melbourne",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Brisbane",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Waxing", slug: "waxing" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Perth",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Eyelash Extensions", slug: "eyelash-extensions" }
      ]
    },
    {
      name: "Adelaide",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Gold Coast",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Canberra",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" }
      ]
    }
  ],
  "Canada": [
    {
      name: "Toronto",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Spas", slug: "spas" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Vancouver",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Montreal",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Waxing", slug: "waxing" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Calgary",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Eyelash Extensions", slug: "eyelash-extensions" }
      ]
    },
    {
      name: "Ottawa",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Edmonton",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Winnipeg",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" }
      ]
    },
    {
      name: "Halifax",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" }
      ]
    }
  ],
  "United Kingdom": [
    {
      name: "London",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Spas", slug: "spas" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Manchester",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Birmingham",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Waxing", slug: "waxing" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Leeds",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Eyelash Extensions", slug: "eyelash-extensions" }
      ]
    },
    {
      name: "Glasgow",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Edinburgh",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Bristol",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" }
      ]
    },
    {
      name: "Liverpool",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" }
      ]
    }
  ],
  "United States": [
    {
      name: "New York",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Spas", slug: "spas" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Los Angeles",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Chicago",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Spas", slug: "spas" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Houston",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Waxing", slug: "waxing" }
      ]
    },
    {
      name: "Phoenix",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "San Francisco",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Eyelash Extensions", slug: "eyelash-extensions" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Miami",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Seattle",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Denver",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" }
      ]
    }
  ],
  "United Arab Emirates": [
    {
      name: "Dubai",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Spas", slug: "spas" },
        { name: "Makeup Artists", slug: "makeup-artists" }
      ]
    },
    {
      name: "Abu Dhabi",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Sharjah",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Waxing", slug: "waxing" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    },
    {
      name: "Ajman",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Eyelash Extensions", slug: "eyelash-extensions" }
      ]
    },
    {
      name: "Ras Al Khaimah",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Barbers", slug: "barbers" },
        { name: "Skincare", slug: "skincare" },
        { name: "Massage Therapy", slug: "massage-therapy" }
      ]
    },
    {
      name: "Fujairah",
      services: [
        { name: "Hair Salons", slug: "hair-salons" },
        { name: "Nail Salons", slug: "nail-salons" },
        { name: "Spas", slug: "spas" },
        { name: "Beauty Therapists", slug: "beauty-therapists" }
      ]
    }
  ]
};
