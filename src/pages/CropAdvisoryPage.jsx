import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, ArrowLeft, Calendar, CheckCircle2, Clock, Circle, ChevronRight } from 'lucide-react';
import {
  fetchFarmerCrops,
  fetchCropStages,
  setSelectedCrop,
  clearSelectedCrop
} from '@/store/slices/cropAdvisorySlice';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';

const CropAdvisoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { farmerCrops, selectedCrop, cropStages, loading } = useSelector((state) => state.cropAdvisory);
  const [view, setView] = useState('list');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFarmerCrops(user.id));
    }
  }, [dispatch, user]);

  const handleCropSelect = async (crop) => {
    dispatch(setSelectedCrop(crop));
    if (crop.crops?.id) {
      await dispatch(fetchCropStages(crop.crops.id));
    }
    setView('detail');
  };

  const handleBack = () => {
    if (view === 'detail') {
      setView('list');
      dispatch(clearSelectedCrop());
    } else {
      navigate('/dashboard');
    }
  };

  const getCropAge = (sowingDate) => {
    if (!sowingDate) return null;
    return differenceInDays(new Date(), new Date(sowingDate));
  };

  const getStageStatus = (stage, sowingDate) => {
    if (!sowingDate) return 'upcoming';

    const daysElapsed = getCropAge(sowingDate);
    let cumulativeDays = 0;
    const stageIndex = cropStages.findIndex(s => s.id === stage.id);

    for (let i = 0; i < stageIndex; i++) {
      cumulativeDays += cropStages[i].duration_days || 0;
    }

    const stageStart = cumulativeDays;
    const stageEnd = cumulativeDays + (stage.duration_days || 0);

    if (daysElapsed < stageStart) return 'upcoming';
    if (daysElapsed >= stageStart && daysElapsed < stageEnd) return 'active';
    return 'completed';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground/40" />;
    }
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
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {view === 'detail' ? 'Back' : 'Dashboard'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
            పంట సలహాలు
          </h2>
          <p className="text-muted-foreground">Crop Advisory & Growth Tracking</p>
        </div>

        {view === 'list' ? (
          /* Crop List View */
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : farmerCrops.length === 0 ? (
              <Card className="border-0 shadow-premium-md">
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-lg text-foreground font-telugu mb-1">
                    మీరు ఇంకా పంటలను ఎంపిక చేయలేదు
                  </p>
                  <p className="text-sm text-muted-foreground">
                    No crops selected yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {farmerCrops.map((crop, index) => {
                  const cropAge = getCropAge(crop.sowing_dates?.sowing_date);

                  return (
                    <Card
                      key={crop.id}
                      className="group border-0 shadow-premium-md hover:shadow-premium-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                      style={{ animationDelay: `${index * 75}ms` }}
                      onClick={() => handleCropSelect(crop)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold font-telugu">
                              {crop.crops?.crop_name_te}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {crop.crops?.crop_name_en}
                            </p>
                          </div>
                          <span className="text-3xl">{crop.crops?.icon || '🌾'}</span>
                        </div>

                        {crop.crop_varieties && (
                          <p className="text-sm text-muted-foreground mb-3 font-telugu">
                            {crop.crop_varieties.variety_name_te}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {crop.sowing_dates?.sowing_date && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(crop.sowing_dates.sowing_date), 'MMM d')}
                              </div>
                            )}
                            {cropAge !== null && (
                              <Badge variant="secondary" className="text-xs">
                                {cropAge}d
                              </Badge>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Crop Detail View */
          <div className="max-w-3xl mx-auto">
            {selectedCrop && (
              <>
                {/* Crop Header */}
                <Card className="mb-6 border-0 shadow-premium-md animate-fade-in-up">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold font-telugu">
                          {selectedCrop.crops?.crop_name_te}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedCrop.crops?.crop_name_en}
                          {selectedCrop.crop_varieties && ` · ${selectedCrop.crop_varieties.variety_name_te}`}
                        </p>
                        {selectedCrop.sowing_dates?.sowing_date && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Sown {format(new Date(selectedCrop.sowing_dates.sowing_date), 'MMM d, yyyy')}
                            <span className="mx-1">·</span>
                            {getCropAge(selectedCrop.sowing_dates.sowing_date)} days
                          </p>
                        )}
                      </div>
                      <span className="text-5xl">{selectedCrop.crops?.icon || '🌾'}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Stages Timeline */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold font-telugu mb-4">పెరుగుదల దశలు</h4>

                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-xl" />
                    ))
                  ) : cropStages.length === 0 ? (
                    <Card className="border-0 shadow-premium">
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground font-telugu">
                          ఈ పంటకు దశల సమాచారం అందుబాటులో లేదు
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    cropStages.map((stage, index) => {
                      const status = getStageStatus(stage, selectedCrop.sowing_dates?.sowing_date);

                      return (
                        <Card
                          key={stage.id}
                          className={`border-0 shadow-premium transition-all duration-300 animate-fade-in-up ${
                            status === 'active' ? 'ring-2 ring-blue-500/30 shadow-premium-md' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {/* Timeline indicator */}
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  status === 'active' ? 'bg-blue-100' :
                                  status === 'completed' ? 'bg-primary/10' : 'bg-secondary'
                                }`}>
                                  {getStatusIcon(status)}
                                </div>
                                {index < cropStages.length - 1 && (
                                  <div className={`w-0.5 flex-1 mt-2 ${
                                    status === 'completed' ? 'bg-primary/30' : 'bg-border'
                                  }`} />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 pb-4">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <h5 className="font-semibold font-telugu">{stage.stage_name_te}</h5>
                                    <p className="text-xs text-muted-foreground">{stage.stage_name_en}</p>
                                  </div>
                                  <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                    {stage.duration_days}d
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground font-telugu mt-2">
                                  {stage.description_te}
                                </p>

                                {status === 'active' && stage.recommendations_te && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs font-medium text-blue-900 mb-1">
                                      Recommendations:
                                    </p>
                                    <p className="text-xs text-blue-800 font-telugu">
                                      {stage.recommendations_te}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CropAdvisoryPage;
