import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Sprout, ArrowLeft, Search, Volume2 } from 'lucide-react';
import SeedCard from '@/components/seeds/SeedCard';
import SeedDetailModal from '@/components/seeds/SeedDetailModal';
import { fetchSeeds, setSelectedSeed, clearSelectedSeed, filterSeeds } from '@/store/slices/seedsSlice';
import { Skeleton } from '@/components/ui/skeleton';
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

  const handleBuy = (seed) => {
    dispatch(setSelectedSeed(seed));
    setIsModalOpen(true);
  };

  const handleOrder = ({ seed, quantity }) => {
    console.log('Order placed:', { seed, quantity });
    // TODO: Implement order functionality with Supabase
    alert(`Order placed for ${quantity} kg of ${seed.variety_name_te}`);
  };

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
              🌱 విత్తన రకాలు
            </h2>
            <p className="text-muted-foreground font-poppins">
              Seed Varieties
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
              placeholder="విత్తనాలను శోధించండి: పంట పేరు లేదా రకం ద్వారా వెతకండి"
              className="pl-12 h-14 font-telugu text-lg glass border-primary/20 focus-visible:ring-primary/30 rounded-full shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button className="h-14 px-8 bg-accent hover:bg-accent/90 text-white font-telugu rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-105">
            <Volume2 className="mr-2 h-5 w-5" />
            విత్తన సమాచారం వినండి
          </Button>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <p className="text-sm text-muted-foreground font-poppins bg-primary/5 inline-block px-4 py-1 rounded-full">
              Showing {filteredSeeds.length} seed {filteredSeeds.length === 1 ? 'variety' : 'varieties'}
            </p>
          </motion.div>
        )}

        {/* Seed Cards Grid */}
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
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </motion.div>
          ) : filteredSeeds.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 glass rounded-2xl max-w-2xl mx-auto"
            >
              <div className="text-8xl mb-6 animate-bounce">🌱</div>
              <h3 className="text-2xl font-bold text-primary font-telugu mb-2">
                విత్తనాలు కనుగొనబడలేదు
              </h3>
              <p className="text-muted-foreground font-poppins mb-6">
                No seeds found for your search query "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={() => handleSearch('')}
                className="font-poppins border-primary/20 hover:bg-primary/5"
              >
                Clear Search
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredSeeds.map((seed, index) => (
                <motion.div
                  key={seed.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SeedCard
                    seed={seed}
                    onViewDetails={handleViewDetails}
                    onBuy={handleBuy}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
