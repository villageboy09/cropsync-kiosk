import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, ArrowLeft, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
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
  const { farmerCrops, selectedCrop, cropStages, currentStage, loading } = useSelector((state) => state.cropAdvisory);
  const [view, setView] = useState('list'); // 'list' or 'detail'

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
    const days = differenceInDays(new Date(), new Date(sowingDate));
    return days;
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
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
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
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {view === 'detail' ? 'Back to Crops' : 'Dashboard'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-telugu mb-2">
            🌾 పంట సలహాలు
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            Crop Advisory & Growth Tracking
          </p>
          <p className="text-sm text-gray-500 font-telugu mt-2">
            మీ పంటల పెరుగుదల దశలను ట్రాక్ చేయండి
          </p>
        </div>

        {view === 'list' ? (
          /* Crop List View */
          <>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : farmerCrops.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-4">🌱</div>
                <p className="text-xl text-gray-500 font-telugu mb-2">
                  మీరు ఇంకా పంటలను ఎంపిక చేయలేదు
                </p>
                <p className="text-gray-400 font-poppins mb-4">
                  No crops selected yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmerCrops.map((crop) => {
                  const cropAge = getCropAge(crop.sowing_dates?.sowing_date);
                  
                  return (
                    <Card key={crop.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCropSelect(crop)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-telugu mb-1">
                              {crop.crops?.crop_name_te}
                            </CardTitle>
                            <p className="text-sm text-gray-600 font-poppins">
                              {crop.crops?.crop_name_en}
                            </p>
                          </div>
                          <span className="text-4xl">{crop.crops?.icon || '🌾'}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {crop.crop_varieties && (
                          <div>
                            <p className="text-xs text-gray-500 font-telugu">రకం:</p>
                            <p className="font-medium font-telugu">{crop.crop_varieties.variety_name_te}</p>
                          </div>
                        )}
                        
                        {crop.sowing_dates?.sowing_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="font-poppins">
                              Sown: {format(new Date(crop.sowing_dates.sowing_date), 'dd MMM yyyy')}
                            </span>
                          </div>
                        )}
                        
                        {cropAge !== null && (
                          <Badge className="bg-green-100 text-green-800 font-poppins">
                            {cropAge} days old
                          </Badge>
                        )}
                        
                        <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 font-telugu">
                          వృద్ధి దశలను చూడండి
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Crop Detail View with Growth Stages */
          <div className="max-w-4xl mx-auto">
            {selectedCrop && (
              <>
                {/* Crop Header */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold font-telugu mb-1">
                          {selectedCrop.crops?.crop_name_te}
                        </h3>
                        <p className="text-gray-600 font-poppins">
                          {selectedCrop.crops?.crop_name_en} - {selectedCrop.crop_varieties?.variety_name_te}
                        </p>
                        {selectedCrop.sowing_dates?.sowing_date && (
                          <p className="text-sm text-gray-500 mt-2 font-poppins">
                            Sown on: {format(new Date(selectedCrop.sowing_dates.sowing_date), 'dd MMMM yyyy')} 
                            ({getCropAge(selectedCrop.sowing_dates.sowing_date)} days ago)
                          </p>
                        )}
                      </div>
                      <span className="text-6xl">{selectedCrop.crops?.icon || '🌾'}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Stages Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xl font-bold font-telugu mb-4">పెరుగుదల దశలు</h4>
                  
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </Card>
                    ))
                  ) : cropStages.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        <p className="font-telugu">ఈ పంటకు దశల సమాచారం అందుబాటులో లేదు</p>
                        <p className="font-poppins text-sm">No stage information available for this crop</p>
                      </CardContent>
                    </Card>
                  ) : (
                    cropStages.map((stage, index) => {
                      const status = getStageStatus(stage, selectedCrop.sowing_dates?.sowing_date);
                      
                      return (
                        <Card key={stage.id} className={`border-2 ${status === 'active' ? 'border-blue-500 shadow-lg' : ''}`}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStatusColor(status)}`}>
                                  {getStatusIcon(status)}
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="text-lg font-bold font-telugu">{stage.stage_name_te}</h5>
                                    <p className="text-sm text-gray-600 font-poppins">{stage.stage_name_en}</p>
                                  </div>
                                  <Badge className={getStatusColor(status)}>
                                    {status === 'active' ? 'Active' : status === 'completed' ? 'Completed' : 'Upcoming'}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-700 font-telugu mb-2">{stage.description_te}</p>
                                <p className="text-xs text-gray-500 font-poppins">Duration: {stage.duration_days} days</p>
                                
                                {status === 'active' && (
                                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-semibold text-blue-900 font-telugu mb-1">
                                      ప్రస్తుత దశ సూచనలు:
                                    </p>
                                    <p className="text-sm text-blue-800 font-telugu">
                                      {stage.recommendations_te || 'సూచనలు త్వరలో అందుబాటులోకి వస్తాయి'}
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
