import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sprout, ArrowLeft, Search, Volume2 } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import ProductDetailModal from '@/components/products/ProductDetailModal';
import { 
  fetchProducts, 
  setSelectedProduct, 
  clearSelectedProduct, 
  setSelectedCategory,
  filterProducts 
} from '@/store/slices/productsSlice';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filteredProducts, categories, selectedProduct, selectedCategory, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(filterProducts(query));
  };

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
    if (category === 'all') {
      dispatch(fetchProducts());
    } else {
      const filtered = filteredProducts.filter(p => p.category === category);
      // For simplicity, just filter client-side
    }
  };

  const handleViewDetails = (product) => {
    dispatch(setSelectedProduct(product));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      dispatch(clearSelectedProduct());
    }, 300);
  };

  const handleInquire = (product) => {
    console.log('Inquire about product:', product);
    // TODO: Implement inquiry functionality
    if (product.advertisers?.contact_number) {
      window.location.href = `tel:${product.advertisers.contact_number}`;
    } else {
      alert(`విచారణ పంపబడింది: ${product.product_name_te}`);
    }
  };

  // Filter products by selected category
  const displayProducts = selectedCategory === 'all' 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-600 font-poppins">CropSync</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-telugu mb-2">
            🛒 వ్యవసాయ దుకాణం
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            Agriculture Shop
          </p>
          <p className="text-sm text-gray-500 font-telugu mt-2">
            మీ వ్యవసాయ అవసరాలకు నాణ్యమైన ఉత్పత్తులు
          </p>
        </div>

        {/* Search and Audio */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="ఉత్పత్తులను శోధించండి: పేరు లేదా వర్గం ద్వారా వెతకండి"
              className="pl-10 h-12 font-telugu"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button className="h-12 bg-orange-500 hover:bg-orange-600 font-telugu">
            <Volume2 className="mr-2 h-5 w-5" />
            ఉత్పత్తుల సమాచారం వినండి
          </Button>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`whitespace-nowrap font-telugu ${
                  selectedCategory === 'all' ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                అన్ని వర్గాలు
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`whitespace-nowrap font-poppins ${
                    selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 font-poppins">
              Showing {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        )}

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-8xl mb-4">📦</div>
            <p className="text-xl text-gray-500 font-telugu mb-2">
              ఉత్పత్తులు కనుగొనబడలేదు
            </p>
            <p className="text-gray-400 font-poppins mb-4">
              No products found for your search
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                handleSearch('');
                handleCategoryChange('all');
              }}
              className="font-poppins"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onInquire={handleInquire}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onInquire={handleInquire}
      />
    </div>
  );
};

export default ProductsPage;
