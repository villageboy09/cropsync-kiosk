import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, ArrowLeft, Search, TrendingUp, TrendingDown, BarChart3, Store } from 'lucide-react';
import MarketPriceCard from '@/components/market/MarketPriceCard';
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
    { id: 'maize', name: 'Maize', nameTe: 'మక్క', icon: '🌽' },
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
            మార్కెట్ ధరలు
          </h2>
          <p className="text-muted-foreground">
            {currentCommodity.name} Prices · {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        {/* Commodity Selector */}
        <div className="mb-6 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {commodities.map((commodity) => (
              <Button
                key={commodity.id}
                variant={selectedCommodity === commodity.id ? 'default' : 'outline'}
                className={`h-16 sm:h-20 flex-col gap-1 ${
                  selectedCommodity === commodity.id ? '' : 'border-border/60'
                }`}
                onClick={() => handleCommodityChange(commodity.id)}
              >
                <span className="text-2xl">{commodity.icon}</span>
                <span className="font-telugu text-sm">{commodity.nameTe}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-in-up animation-delay-100">
            <Card className="border-0 shadow-premium">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Store className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalMarkets}</p>
                    <p className="text-xs text-muted-foreground">Markets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{stats.avgPrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{stats.minPrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">Min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{stats.maxPrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">Max</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* District Filter */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <Button
              variant={selectedDistrict === 'all' ? 'default' : 'secondary'}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleDistrictChange('all')}
            >
              All Districts
            </Button>
            {districts.map((district) => (
              <Button
                key={district}
                variant={selectedDistrict === district ? 'default' : 'secondary'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => handleDistrictChange(district)}
              >
                {district}
              </Button>
            ))}
          </div>
        </div>

        {/* Market Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <Card className="border-0 shadow-premium">
            <CardContent className="py-16 text-center">
              <p className="text-lg text-foreground font-telugu mb-1">
                మార్కెట్లు కనుగొనబడలేదు
              </p>
              <p className="text-sm text-muted-foreground">
                No markets found for these filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MarketPriceCard
                  market={price.market}
                  district={price.district}
                  variety={price.variety}
                  price={price.modal_price}
                  onAudioPlay={(text) => console.log('Play audio:', text)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketPricesPage;
