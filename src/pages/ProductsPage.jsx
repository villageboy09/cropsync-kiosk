import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Sprout, ArrowLeft, Search, Volume2, ShoppingBag } from 'lucide-react';
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
    if (category === 'all') {
      dispatch(fetchProducts());
    } else {
      // We already have all products, so just filtering is enough if we want to avoid re-fetching
      // But for consistency with the slice logic (which might fetch from DB), we can dispatch if needed
      // For now, let's rely on the slice's filter logic if it was client-side, but the slice has fetchProductsByCategory
      // Let's just filter the current list for smoother UX if we have data, or fetch if we want fresh data.
      // The slice logic shows fetchProductsByCategory does a DB call. Let's use that for now.
      // Actually, to keep it snappy, let's just filter client side if we have data, but the slice structure suggests fetching.
      // Let's stick to the slice actions for now.
      // Wait, the slice has fetchProductsByCategory. Let's use it.
      // Actually, the previous code was doing client side filtering in the component?
      // No, it was dispatching fetchProducts() for 'all'.
      // Let's just use the client-side filtering for now as it's faster and we have all products.
      // But wait, the slice has `filteredProducts`.
      // Let's just re-fetch to be safe and consistent with the original code's intent, or improve it.
      // I'll stick to the original logic but improved UI.
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
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-gradient font-telugu mb-2">
              🛒 వ్యవసాయ దుకాణం
            </h2>
            <p className="text-muted-foreground font-poppins">
              Agriculture Shop
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </motion.div>

        {/* Search and Audio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ఉత్పత్తులను శోధించండి: పేరు లేదా వర్గం ద్వారా వెతకండి"
              className="pl-12 h-14 font-telugu text-lg glass border-primary/20 focus-visible:ring-primary/30 rounded-full shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button className="h-14 px-8 bg-accent hover:bg-accent/90 text-white font-telugu rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-105">
            <Volume2 className="mr-2 h-5 w-5" />
            ఉత్పత్తుల సమాచారం వినండి
          </Button>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 overflow-x-auto pb-4 scrollbar-hide"
          >
            <div className="flex gap-3">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`whitespace-nowrap font-telugu rounded-full px-6 transition-all ${selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                  : 'hover:bg-primary/10 hover:text-primary border-primary/20'
                  }`}
                onClick={() => handleCategoryChange('all')}
              >
                అన్ని వర్గాలు (All)
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`whitespace-nowrap font-poppins rounded-full px-6 transition-all ${selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                    : 'hover:bg-primary/10 hover:text-primary border-primary/20'
                    }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <p className="text-sm text-muted-foreground font-poppins bg-primary/5 inline-block px-4 py-1 rounded-full">
              Showing {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
            </p>
          </motion.div>
        )}

        {/* Product Cards Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3 glass p-4 rounded-xl">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </motion.div>
          ) : displayProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 glass rounded-2xl max-w-2xl mx-auto"
            >
              <div className="text-8xl mb-6 animate-bounce">📦</div>
              <h3 className="text-2xl font-bold text-primary font-telugu mb-2">
                ఉత్పత్తులు కనుగొనబడలేదు
              </h3>
              <p className="text-muted-foreground font-poppins mb-6">
                No products found for your search query "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  handleSearch('');
                  handleCategoryChange('all');
                }}
                className="font-poppins border-primary/20 hover:bg-primary/5"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                    onInquire={handleInquire}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
