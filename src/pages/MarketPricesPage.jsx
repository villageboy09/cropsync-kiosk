import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Sprout, ArrowLeft, Search, Volume2, TrendingUp, TrendingDown, DollarSign, Store } from 'lucide-react';
import MarketPriceCard from '@/components/market/MarketPriceCard';
import StatsCard from '@/components/market/StatsCard';
import { fetchMarketPrices, fetchDistricts, setSelectedCommodity, setSelectedDistrict } from '@/store/slices/marketSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const MarketPricesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { prices, districts, selectedCommodity, selectedDistrict, loading, stats } = useSelector((state) => state.market);
  const [searchQuery, setSearchQuery] = useState('');

  const commodities = [
    { id: 'rice', name: 'Rice', nameTe: 'వరి', icon: '🌾' },
    { id: 'cotton', name: 'Cotton', nameTe: 'పత్తి', icon: '🌸' },
    { id: 'maize', name: 'Maize', nameTe: 'మక్క జొన్న', icon: '🌽' },
    { id: 'groundnut', name: 'Groundnut', nameTe: 'వేరుశెనగ', icon: '🥜' },
  ];

  useEffect(() => {
    dispatch(fetchDistricts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMarketPrices({
      commodity: selectedCommodity,
      district: selectedDistrict
    }));
  }, [dispatch, selectedCommodity, selectedDistrict]);

  const handleCommodityChange = (commodity) => {
    dispatch(setSelectedCommodity(commodity));
  };

  const handleDistrictChange = (district) => {
    dispatch(setSelectedDistrict(district));
  };

  const filteredPrices = prices.filter((price) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      price.market.toLowerCase().includes(query) ||
      price.district.toLowerCase().includes(query) ||
      price.variety.toLowerCase().includes(query)
    );
  });

  const currentCommodity = commodities.find(c => c.id === selectedCommodity) || commodities[0];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gradient font-telugu mb-2 flex items-center justify-center gap-3">
            <span className="text-4xl">{currentCommodity.icon}</span>
            {currentCommodity.nameTe} మార్కెట్ ధరలు
          </h2>
          <p className="text-muted-foreground font-poppins">
            {currentCommodity.name} Market Prices
          </p>
          <p className="text-sm text-primary/80 font-telugu mt-2 bg-primary/5 inline-block px-4 py-1 rounded-full">
            తేదీ: {new Date().toLocaleDateString('te-IN')}
          </p>
        </motion.div>

        {/* Commodity Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {commodities.map((commodity) => (
              <Button
                key={commodity.id}
                variant={selectedCommodity === commodity.id ? 'default' : 'outline'}
                className={`h-24 text-lg font-telugu transition-all duration-300 ${selectedCommodity === commodity.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 border-primary'
                    : 'hover:bg-primary/5 hover:text-primary hover:border-primary/30 border-primary/10 glass'
                  }`}
                onClick={() => handleCommodityChange(commodity.id)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 drop-shadow-sm">{commodity.icon}</div>
                  <div className="font-bold">{commodity.nameTe}</div>
                </div>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Search and Audio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="మార్కెట్ శోధించండి: మార్కెట్ పేరు లేదా జిల్లా ద్వారా వెతకండి"
              className="pl-12 h-14 font-telugu text-lg glass border-primary/20 focus-visible:ring-primary/30 rounded-full shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-14 px-8 bg-accent hover:bg-accent/90 text-white font-telugu rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-105">
            <Volume2 className="mr-2 h-5 w-5" />
            మార్కెట్ సారాంశం వినండి
          </Button>
        </motion.div>

        {/* Stats Cards */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto"
          >
            <StatsCard
              label="Total Markets"
              labelTe="మొత్తం మార్కెట్లు"
              value={stats.totalMarkets}
              icon={Store}
            />
            <StatsCard
              label="Average Price"
              labelTe="సగటు ధర"
              value={`₹${stats.avgPrice.toLocaleString('en-IN')}`}
              icon={DollarSign}
            />
            <StatsCard
              label="Minimum Price"
              labelTe="కనీస ధర"
              value={`₹${stats.minPrice.toLocaleString('en-IN')}`}
              icon={TrendingDown}
            />
            <StatsCard
              label="Maximum Price"
              labelTe="గరిష్ట ధర"
              value={`₹${stats.maxPrice.toLocaleString('en-IN')}`}
              icon={TrendingUp}
            />
          </motion.div>
        )}

        {/* District Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 overflow-x-auto pb-4 scrollbar-hide"
        >
          <div className="flex gap-3">
            <Button
              variant={selectedDistrict === 'all' ? 'default' : 'outline'}
              className={`whitespace-nowrap font-telugu rounded-full px-6 transition-all ${selectedDistrict === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                  : 'hover:bg-primary/10 hover:text-primary border-primary/20'
                }`}
              onClick={() => handleDistrictChange('all')}
            >
              అన్ని జిల్లాలు (All)
            </Button>
            {districts.map((district) => (
              <Button
                key={district}
                variant={selectedDistrict === district ? 'default' : 'outline'}
                className={`whitespace-nowrap font-poppins rounded-full px-6 transition-all ${selectedDistrict === district
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                    : 'hover:bg-primary/10 hover:text-primary border-primary/20'
                  }`}
                onClick={() => handleDistrictChange(district)}
              >
                {district}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Market Price Cards */}
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
                <div key={i} className="glass p-4 rounded-xl space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg" />
                </div>
              ))}
            </motion.div>
          ) : filteredPrices.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 glass rounded-2xl max-w-2xl mx-auto"
            >
              <div className="text-8xl mb-6 animate-bounce">📉</div>
              <h3 className="text-2xl font-bold text-primary font-telugu mb-2">
                ఈ వడపోతలకు సరిపోలే మార్కెట్లు కనుగొనబడలేదు
              </h3>
              <p className="text-muted-foreground font-poppins">
                No markets found for these filters
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrices.map((price, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MarketPriceCard
                    market={price.market}
                    district={price.district}
                    variety={price.variety}
                    price={price.modal_price}
                    onAudioPlay={(text) => console.log('Play audio:', text)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MarketPricesPage;
