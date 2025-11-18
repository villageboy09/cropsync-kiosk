import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, ArrowLeft, Search, Volume2, TrendingUp, TrendingDown, DollarSign, Store } from 'lucide-react';
import MarketPriceCard from '@/components/market/MarketPriceCard';
import StatsCard from '@/components/market/StatsCard';
import { fetchMarketPrices, fetchDistricts, setSelectedCommodity, setSelectedDistrict } from '@/store/slices/marketSlice';
import { Skeleton } from '@/components/ui/skeleton';

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
            {currentCommodity.icon} {currentCommodity.nameTe} మార్కెట్ ధరలు
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            {currentCommodity.name} Market Prices
          </p>
          <p className="text-sm text-gray-500 font-telugu mt-2">
            తేదీ: {new Date().toLocaleDateString('te-IN')}
          </p>
        </div>

        {/* Commodity Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {commodities.map((commodity) => (
              <Button
                key={commodity.id}
                variant={selectedCommodity === commodity.id ? 'default' : 'outline'}
                className={`h-20 text-lg font-telugu ${
                  selectedCommodity === commodity.id
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                }`}
                onClick={() => handleCommodityChange(commodity.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-1">{commodity.icon}</div>
                  <div>{commodity.nameTe}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Audio */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="మార్కెట్ శోధించండి: మార్కెట్ పేరు లేదా జిల్లా ద్వారా వెతకండి"
              className="pl-10 h-12 font-telugu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-12 bg-orange-500 hover:bg-orange-600 font-telugu">
            <Volume2 className="mr-2 h-5 w-5" />
            మార్కెట్ సారాంశం వినండి
          </Button>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
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
          </div>
        )}

        {/* District Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <Button
              variant={selectedDistrict === 'all' ? 'default' : 'outline'}
              className={`whitespace-nowrap font-telugu ${
                selectedDistrict === 'all' ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
              onClick={() => handleDistrictChange('all')}
            >
              అన్ని జిల్లాలు
            </Button>
            {districts.map((district) => (
              <Button
                key={district}
                variant={selectedDistrict === district ? 'default' : 'outline'}
                className={`whitespace-nowrap font-poppins ${
                  selectedDistrict === district ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
                onClick={() => handleDistrictChange(district)}
              >
                {district}
              </Button>
            ))}
          </div>
        </div>

        {/* Market Price Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 font-telugu mb-2">
              ఈ వడపోతలకు సరిపోలే మార్కెట్లు కనుగొనబడలేదు
            </p>
            <p className="text-gray-400 font-poppins">
              No markets found for these filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, index) => (
              <MarketPriceCard
                key={index}
                market={price.market}
                district={price.district}
                variety={price.variety}
                price={price.modal_price}
                onAudioPlay={(text) => console.log('Play audio:', text)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketPricesPage;
