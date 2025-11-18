import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, ArrowLeft, Search } from 'lucide-react';
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
    alert(`Order placed for ${quantity} kg of ${seed.variety_name_te}`);
  };

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
            విత్తన రకాలు
          </h2>
          <p className="text-muted-foreground">Seed Varieties</p>
        </div>

        {/* Search */}
        <div className="mb-6 animate-fade-in-up">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search seeds by crop or variety..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredSeeds.length} {filteredSeeds.length === 1 ? 'variety' : 'varieties'} found
            </p>
          </div>
        )}

        {/* Seed Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filteredSeeds.length === 0 ? (
          <Card className="border-0 shadow-premium-md">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-lg text-foreground font-telugu mb-1">
                విత్తనాలు కనుగొనబడలేదు
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                No seeds found
              </p>
              <Button variant="secondary" onClick={() => handleSearch('')}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSeeds.map((seed, index) => (
              <div
                key={seed.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SeedCard
                  seed={seed}
                  onViewDetails={handleViewDetails}
                  onBuy={handleBuy}
                />
              </div>
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
