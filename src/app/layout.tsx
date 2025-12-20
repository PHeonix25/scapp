import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import AppLayout from '@/components/AppLayout';
import { Providers } from '@/components/Providers';
import "./globals.css";


const poppinsRegular = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins-regular',
});

const poppinsBlack = Poppins({
  subsets: ['latin'],
  weight: '900',
  variable: '--font-poppins-black',
});

export const metadata: Metadata = {
  title: "Social Circus Skills Tracker",
  description: "Teacher aid for tracking student progress in aerial skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppinsRegular.variable} ${poppinsBlack.variable} antialiased`}
      >
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
