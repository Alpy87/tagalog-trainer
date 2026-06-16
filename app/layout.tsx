import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tagalog Trainer — Learn Filipino with AI',
  description:
    'Interactive AI-powered Tagalog language trainer for beginners. Practice conversations, grammar, vocabulary, real-world scenarios, and writing with an intelligent tutor.',
  keywords: ['Tagalog', 'Filipino', 'language learning', 'AI tutor', 'beginner'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
