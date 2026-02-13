import { SearchBar } from './SearchBar';

export const HeroSection = () => {
  return (
    <section className="relative pt-40 md:pt-48 pb-32 md:pb-40">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto text-center px-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Book local selfcare services
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover and book beauty & wellness professionals near you
          </p>
        </div>

        <div className="mb-12">
          <SearchBar />
        </div>

      </div>
    </section>
  );
};
