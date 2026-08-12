import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Page3D from '@/components/Page3D';
import { DEFAULT_WHATSAPP_URL } from '@/lib/config';

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
        <Page3D>
          <main style={{ marginTop: 'var(--header-height)' }}>
            {children}
          </main>
        </Page3D>
        <Footer />
        <a
          href={DEFAULT_WHATSAPP_URL}
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
