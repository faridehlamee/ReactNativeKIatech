import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { Pricing } from '@/components/Pricing';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Services />
        <Portfolio />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}