import "./globals.css";

export const metadata = {
  title: "SR SmartFinds - Best Products & Recommendations",
  description: "Find the best home, kitchen, and electronic gadgets with direct links.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600 tracking-tight">
              SimpleGhar <span className="text-gray-800 text-lg font-normal">Telugu</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Affiliate Disclosure: We earn a small commission on purchases.</p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
