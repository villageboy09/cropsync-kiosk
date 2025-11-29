import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Search, Sprout, MapPin, ShoppingCart } from 'lucide-react';
import { fetchSeeds, filterSeeds, setSelectedSeed, clearSelectedSeed } from '@/store/slices/seedsSlice';
import SeedDetailModal from '@/components/seeds/SeedDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

const SeedVarietiesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filteredSeeds, selectedSeed, loading } = useSelector((state) => state.seeds);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSeeds());
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(filterSeeds(query));
  };

  const handleViewDetails = (seed) => {
    dispatch(setSelectedSeed(seed));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      dispatch(clearSelectedSeed());
    }, 300);
  };

  const handleOrder = ({ seed, quantity }) => {
    console.log('Order placed:', { seed, quantity });
    // Placeholder for order logic
    alert(`Order placed for ${quantity} kg of ${seed.variety_name_te}`);
  };

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
                🌱 విత్తన రకాలు (Seed Varieties)
              </h2>
              <p className="text-gray-500">
                Explore high-quality seeds for your farm.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search seeds..."
                className="pl-12 h-12 rounded-full border-gray-200 bg-white shadow-sm focus-visible:ring-[#4ade80]"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

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
            ) : filteredSeeds.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm">
                <Sprout className="h-20 w-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600">No seeds found</h3>
                <p className="text-gray-400">Try adjusting your search terms.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredSeeds.map((seed, index) => (
                  <motion.div
                    key={seed.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group h-full rounded-[2rem] border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        {seed.image_url ? (
                          <img
                            src={seed.image_url}
                            alt={seed.variety_name_te}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-green-50">
                            <Sprout className="h-16 w-16 text-green-200" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/90 text-[#1a5d2c] hover:bg-white font-bold backdrop-blur-sm shadow-sm">
                            {seed.crop_name}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section */}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 font-telugu mb-1">
                            {seed.variety_name_te}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium">
                            {seed.variety_name_en}
                          </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</p>
                            <p className="text-lg font-bold text-[#1a5d2c]">
                              ₹{seed.price?.toLocaleString('en-IN') || 'N/A'}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleViewDetails(seed)}
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

      {/* Seed Detail Modal */}
      <SeedDetailModal
        seed={selectedSeed}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
      />
    </div>
  );
};

export default SeedVarietiesPage;
