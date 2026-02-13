import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/hero/HeroSection";
import { GradientBlobs } from "./components/hero/GradientBlobs";
import { VenueSection } from "./components/venues/VenueSection";
import { ReviewsSection } from "./components/reviews/ReviewsSection";
import { StatsSection } from "./components/stats/StatsSection";
import { DownloadAppSection } from "./components/download/DownloadAppSection";
import { ForBusinessSection } from "./components/business/ForBusinessSection";
import { BrowseByCitySection } from "./components/browse/BrowseByCitySection";
import {
  recentlyViewed,
  recommended,
  newVenues,
  trending,
} from "../data/venues";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main>
        {/* Hero + Recently viewed share the gradient background */}
        <div className="relative overflow-hidden">
          <GradientBlobs />

          <div className="relative z-[1]">
            <HeroSection />
            <VenueSection title="Recently viewed" venues={recentlyViewed} />
          </div>

          {/* Fade out at the bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to bottom, transparent, white)' }}
          />
        </div>

        <div className="flex flex-col w-full gap-6 mt-4">
          <VenueSection title="Recommended" venues={recommended} />
          <VenueSection title="New to Blyss" venues={newVenues} />
          <VenueSection title="Trending" venues={trending} />
        </div>

        {/* <ReviewsSection /> */}

        {/* <StatsSection /> */}

        {/* <DownloadAppSection /> */}

        <ForBusinessSection />

        <BrowseByCitySection />
      </main>

      {/* <Footer /> */}
    </div>
  );
}
