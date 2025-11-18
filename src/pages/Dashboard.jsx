import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrops } from '@/store/slices/cropSlice';
import { CropCard } from '@/components/crop/CropCard';
import { CropListSkeleton, DashboardSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Sprout, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export function Dashboard() {
  const dispatch = useDispatch();
  const { crops, loading, error } = useSelector((state) => state.crop);
  const { language } = useSelector((state) => state.ui);
  
  const getText = (en, te) => language === 'te' ? te : en;

  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  const stats = {
    totalCrops: crops.length,
    activeCrops: crops.filter(c => c.status === 'active').length,
    upcomingHarvest: crops.filter(c => c.harvest_date && new Date(c.harvest_date) > new Date()).length,
  };

  if (loading && crops.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            {getText('Dashboard', 'డాష్‌బోర్డ్')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {getText('Manage your crops and farm activities', 'మీ పంటలు మరియు వ్యవసాయ కార్యకలాపాలను నిర్వహించండి')}
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          {getText('Add New Crop', 'కొత్త పంట జోడించండి')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {getText('Total Crops', 'మొత్తం పంటలు')}
            </CardTitle>
            <Sprout className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalCrops}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {getText('Registered in system', 'వ్యవస్థలో నమోదు చేయబడింది')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {getText('Active Crops', 'క్రియాశీల పంటలు')}
            </CardTitle>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{stats.activeCrops}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {getText('Currently growing', 'ప్రస్తుతం పెరుగుతున్నవి')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {getText('Upcoming Harvest', 'రాబోయే పంట కోత')}
            </CardTitle>
            <Calendar className="h-8 w-8 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{stats.upcomingHarvest}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {getText('Scheduled this month', 'ఈ నెలలో షెడ్యూల్ చేయబడింది')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={getText('Search crops...', 'పంటలను వెతకండి...')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Crops Grid */}
      {loading ? (
        <CropListSkeleton count={6} />
      ) : crops.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sprout className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {getText('No crops yet', 'ఇంకా పంటలు లేవు')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {getText('Start by adding your first crop', 'మీ మొదటి పంటను జోడించడం ద్వారా ప్రారంభించండి')}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {getText('Add Crop', 'పంట జోడించండి')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <CropCard 
              key={crop.id} 
              crop={crop}
              onView={(crop) => console.log('View:', crop)}
              onEdit={(crop) => console.log('Edit:', crop)}
              onDelete={(crop) => console.log('Delete:', crop)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
