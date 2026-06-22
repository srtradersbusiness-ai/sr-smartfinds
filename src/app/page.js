import Papa from 'papaparse';
import { ExternalLink, ShoppingBag } from 'lucide-react';

// Fetch the CSV directly from your Google Sheet or Hosted CSV URL
async function getProducts() {
  const csvUrl = process.env.NEXT_PUBLIC_CSV_URL;
  
  if (!csvUrl) {
    return [];
  }

  try {
    const res = await fetch(csvUrl, { next: { revalidate: 3600 } }); // Cache data for 1 hour
    const csvText = await res.text();
    
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    return parsed.data;
  } catch (error) {
    console.error("Error fetching or parsing CSV data:", error);
    return [];
  }
}

export default async function Home({ searchParams }) {
  const products = await getProducts();
  
  // Extract unique categories for the filter bar
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const selectedCategory = searchParams.category || 'All';

  // Filter products based on URL params
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Category Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-gray-100">
        {categories.map((cat) => (
          <a
            key={cat}
            href={cat === 'All' ? '/' : `?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-red-600 Republic text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {/* Product Feed Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found. Please verify your Google Sheet URL setup.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-4">
                <img 
                  src={product.image || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                  {product.category}
                </span>
              </div>

              {/* Product Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-gray-800 text-base line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2 flex-grow">
                  {product.description}
                </p>
                
                {/* Price Display */}
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xs text-gray-400 font-medium">Approx Price</span>
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                </div>

                {/* Affiliate Link Button */}
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors group"
                >
                  <ShoppingBag size={16} />
                  <span>Check Price on Amazon</span>
                  <ExternalLink size={14} className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}