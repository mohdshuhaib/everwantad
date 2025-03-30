import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import AdPlaceholder from '@/components/AdPlaceholder';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Ad Placeholder */}
      <AdPlaceholder />

      {/* Footer */}
      <Footer />
    </div>
  );
}