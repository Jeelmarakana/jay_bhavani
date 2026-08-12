import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Jay Bhavani Ornaments | 22K Gold & Bridal Jewellery in Kamrej, Surat',
  description: 'Explore 22K gold, diamond, antique and bridal jewellery at Jay Bhavani Ornaments, Kamrej, Surat. View our collection, check gold rates and enquire on WhatsApp.',
  keywords: 'Gold jewellery shop in Kamrej, jewellery shop in Kamrej Surat, bridal jewellery in Surat, 22K gold jewellery in Kamrej, Jay Bhavani Ornaments',
  openGraph: {
    title: 'Jay Bhavani Ornaments | 22K Gold & Bridal Jewellery in Kamrej, Surat',
    description: 'Digital Showroom + WhatsApp Sales Machine — 22K Gold, Diamond, Bridal & Antique Jewellery.',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        <Navbar />
        <main style={{ marginTop: 'var(--header-height)' }}>
          {children}
        </main>
        <Footer />
        <a
          href="https://wa.me/919898426635?text=Hi%20Jay%20Bhavani%20Ornaments%2C%20I%20would%20like%20to%20enquire%20about%20your%20collection."
          className="floating-whatsapp"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}
