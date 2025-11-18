import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, ArrowLeft, Search } from 'lucide-react';
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
      alert(`Inquiry sent for: ${product.product_name_te}`);
    }
  };

  const displayProducts = selectedCategory === 'all'
    ? filteredProducts
    : filteredProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">CropSync</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
            వ్యవసాయ దుకాణం
          </h2>
          <p className="text-muted-foreground">Agriculture Shop</p>
        </div>

        {/* Search */}
        <div className="mb-6 animate-fade-in-up">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'secondary'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => handleCategoryChange('all')}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  size="sm"
                  className="whitespace-nowrap"
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
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        )}

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <Card className="border-0 shadow-premium-md">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-lg text-foreground font-telugu mb-1">
                ఉత్పత్తులు కనుగొనబడలేదు
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                No products found
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  handleSearch('');
                  handleCategoryChange('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={handleViewDetails}
                  onInquire={handleInquire}
                />
              </div>
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
