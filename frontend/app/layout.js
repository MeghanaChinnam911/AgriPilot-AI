import "./globals.css";

export const metadata = {
  title: "AgriPilot AI - Autonomous Agricultural Co-Founder",
  description: "Continuous crop planning, weather risk warnings, disease diagnostics, and market profit optimization for modern farmers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full bg-[#040908] text-[#f0fdf4] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
