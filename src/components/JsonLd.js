export default function JsonLd() {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Jay Bhavani Ornaments',
    description: '22K gold, diamond, antique and bridal jewellery in Kamrej, Surat.',
    url: 'https://jaybhavaniornaments.com',
    telephone: '+919898426635',
    email: 'info@jaybhavaniornaments.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 103, Vastu Palace-B, Pasodra Patiya',
      addressLocality: 'Kamrej',
      addressRegion: 'Surat',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '11:00',
      closes: '20:30',
    }],
    priceRange: '₹₹₹',
    sameAs: ['https://www.instagram.com/jaybhavaniornaments'],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is Jay Bhavani Ornaments located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jay Bhavani Ornaments is at Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to login to enquire about jewellery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. You can browse, shortlist and send enquiries without login. WhatsApp enquiry is available on every page.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of jewellery does Jay Bhavani Ornaments offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '22K gold, diamond, bridal, antique and silver jewellery including rings, necklaces, earrings, bangles and bridal sets.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
