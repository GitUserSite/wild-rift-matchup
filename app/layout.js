import "./globals.css";

export const metadata = {
  title: "Wild Rift Matchup",
  description: "Community-based Wild Rift matchup explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
