import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sprout, ArrowLeft, Search, Volume2 } from 'lucide-react';
import SeedCard from '@/components/seeds/SeedCard';
import SeedDetailModal from '@/components/seeds/SeedDetailModal';
import { fetchSeeds, setSelectedSeed, clearSelectedSeed, filterSeeds } from '@/store/slices/seedsSlice';
import { Skeleton } from '@/components/ui/skeleton';

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
            🌱 విత్తన రకాలు
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            Seed Varieties
          </p>
          <p className="text-sm text-gray-500 font-telugu mt-2">
            మీ పంటకు సరైన విత్తనాలను ఎంచుకోండి
          </p>
        </div>

        {/* Search and Audio */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="విత్తనాలను శోధించండి: పంట పేరు లేదా రకం ద్వారా వెతకండి"
              className="pl-10 h-12 font-telugu"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button className="h-12 bg-orange-500 hover:bg-orange-600 font-telugu">
            <Volume2 className="mr-2 h-5 w-5" />
            విత్తన సమాచారం వినండి
          </Button>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 font-poppins">
              Showing {filteredSeeds.length} seed {filteredSeeds.length === 1 ? 'variety' : 'varieties'}
            </p>
          </div>
        )}

        {/* Seed Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredSeeds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-8xl mb-4">🌱</div>
            <p className="text-xl text-gray-500 font-telugu mb-2">
              విత్తనాలు కనుగొనబడలేదు
            </p>
            <p className="text-gray-400 font-poppins mb-4">
              No seeds found for your search
            </p>
            <Button 
              variant="outline" 
              onClick={() => handleSearch('')}
              className="font-poppins"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds.map((seed) => (
              <SeedCard
                key={seed.id}
                seed={seed}
                onViewDetails={handleViewDetails}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}
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
