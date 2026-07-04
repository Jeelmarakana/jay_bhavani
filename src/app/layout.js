import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Jay Bhavani Ornaments | Premium Gold & Diamond Jewellery',
  description: 'Discover premium gold, diamond, kundan, and bridal jewellery at Jay Bhavani Ornaments. Handcrafted elegance and legacy in Rajkot, Gujarat.',
  keywords: 'Jay Bhavani Ornaments, gold jewellery, diamond rings, bridal set, necklaces, jhumkas, Soni Bazar Rajkot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ marginTop: 'var(--header-height)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
