import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Search, ShoppingBag, Store, Phone } from 'lucide-react';
import { fetchProducts, filterProducts, setSelectedProduct, clearSelectedProduct, setSelectedCategory } from '@/store/slices/productsSlice';
import ProductDetailModal from '@/components/products/ProductDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4ade80] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a5d2c] tracking-tight">CarbonMint</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-white font-bold font-telugu"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            డాష్‌బోర్డ్ (Dashboard)
          </Button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title & Search Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-[#1a5d2c] font-telugu mb-2">
                🛒 వ్యవసాయ దుకాణం (Agri Shop)
              </h2>
              <p className="text-gray-500">
                Find the best products for your farming needs.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-12 h-12 rounded-full border-gray-200 bg-white shadow-sm focus-visible:ring-[#4ade80]"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`rounded-full px-6 ${selectedCategory === 'all' ? 'bg-[#1a5d2c] hover:bg-[#144a22]' : 'border-gray-200 text-gray-600'}`}
                onClick={() => handleCategoryChange('all')}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`rounded-full px-6 ${selectedCategory === category ? 'bg-[#1a5d2c] hover:bg-[#144a22]' : 'border-gray-200 text-gray-600'}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Content Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-4 space-y-4 shadow-sm">
                    <Skeleton className="h-48 w-full rounded-3xl" />
                    <div className="space-y-2 px-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm">
                <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600">No products found</h3>
                <p className="text-gray-400">Try adjusting your search terms.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group h-full rounded-[2rem] border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        {product.image_url_1 ? (
                          <img
                            src={product.image_url_1}
                            alt={product.product_name_te}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50">
                            <ShoppingBag className="h-16 w-16 text-blue-200" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/90 text-[#1a5d2c] hover:bg-white font-bold backdrop-blur-sm shadow-sm">
                            {product.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section */}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 font-telugu mb-1 line-clamp-2">
                            {product.product_name_te}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium line-clamp-1">
                            {product.product_name_en}
                          </p>
                        </div>

                        {product.advertisers && (
                          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                            <Store className="h-4 w-4 text-[#4ade80]" />
                            <span className="truncate">{product.advertisers.advertiser_name}</span>
                          </div>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</p>
                            <p className="text-lg font-bold text-[#1a5d2c]">
                              ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleViewDetails(product)}
                            className="rounded-full bg-[#1a5d2c] hover:bg-[#144a22] text-white px-6"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
