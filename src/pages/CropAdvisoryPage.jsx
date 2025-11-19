import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Sprout, ArrowLeft, Calendar, CheckCircle2, Clock, AlertCircle, Bug, ChevronRight } from 'lucide-react';
import {
  fetchFarmerCrops,
  fetchCropStages,
  fetchStageProblems,
  setSelectedCrop,
  clearSelectedCrop
} from '@/store/slices/cropAdvisorySlice';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const CropAdvisoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { farmerCrops, selectedCrop, cropStages, stageProblems, loading } = useSelector((state) => state.cropAdvisory);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedProblem, setSelectedProblem] = useState(null);

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

  const handleStageSelect = async (stage) => {
    if (selectedCrop?.crops?.id && stage?.id) {
      await dispatch(fetchStageProblems({ cropId: selectedCrop.crops.id, stageId: stage.id }));
    }
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
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'active': return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'upcoming': return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-blue-400 ring-offset-2';
      case 'upcoming': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
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
              🌾 పంట సలహాలు
            </h2>
            <p className="text-muted-foreground font-poppins">
              Crop Advisory & Growth Tracking
            </p>
          </div>
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {view === 'detail' ? 'Back' : 'Dashboard'}
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="glass">
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : farmerCrops.length === 0 ? (
                <div className="col-span-full text-center py-12 glass rounded-xl">
                  <div className="text-8xl mb-4">🌱</div>
                  <p className="text-xl text-muted-foreground font-telugu mb-2">
                    మీరు ఇంకా పంటలను ఎంపిక చేయలేదు
                  </p>
                  <Button onClick={() => navigate('/dashboard')} variant="default">
                    Add Crop
                  </Button>
                </div>
              ) : (
                farmerCrops.map((crop, index) => {
                  const cropAge = getCropAge(crop.sowing_dates?.sowing_date);
                  return (
                    <motion.div
                      key={crop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="glass hover:shadow-xl transition-all duration-300 cursor-pointer group border-primary/10"
                        onClick={() => handleCropSelect(crop)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl font-telugu mb-1 text-primary">
                                {crop.crops?.crop_name_te}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground font-poppins">
                                {crop.crops?.crop_name_en}
                              </p>
                            </div>
                            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                              {crop.crops?.icon || '🌾'}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {crop.crop_varieties && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground font-telugu">రకం (Variety):</span>
                              <span className="font-medium font-telugu">{crop.crop_varieties.variety_name_te}</span>
                            </div>
                          )}

                          {crop.sowing_dates?.sowing_date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 p-2 rounded-lg">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-poppins">
                                {format(new Date(crop.sowing_dates.sowing_date), 'dd MMM yyyy')}
                              </span>
                            </div>
                          )}

                          {cropAge !== null && (
                            <Badge variant="secondary" className="w-full justify-center py-1">
                              {cropAge} days old
                            </Badge>
                          )}

                          <div className="flex items-center text-primary text-sm font-medium pt-2">
                            View Details <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {selectedCrop && (
                <>
                  {/* Selected Crop Header */}
                  <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-3xl font-bold font-telugu mb-2 text-primary">
                            {selectedCrop.crops?.crop_name_te}
                          </h3>
                          <p className="text-lg text-muted-foreground font-poppins">
                            {selectedCrop.crops?.crop_name_en} - {selectedCrop.crop_varieties?.variety_name_te}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl mb-2">{selectedCrop.crops?.icon || '🌾'}</div>
                          <Badge variant="outline" className="text-lg px-3 py-1 border-primary/30">
                            Day {getCropAge(selectedCrop.sowing_dates?.sowing_date)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Growth Stages Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                      <h4 className="text-xl font-bold font-telugu flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        పెరుగుదల దశలు (Growth Stages)
                      </h4>

                      <div className="space-y-4">
                        {cropStages.map((stage, index) => {
                          const status = getStageStatus(stage, selectedCrop.sowing_dates?.sowing_date);
                          return (
                            <motion.div
                              key={stage.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card
                                className={`transition-all duration-300 ${status === 'active' ? 'border-primary shadow-lg bg-primary/5' : 'opacity-80'}`}
                                onClick={() => status === 'active' && handleStageSelect(stage)}
                              >
                                <CardContent className="p-4 flex gap-4">
                                  <div className={`mt-1 ${getStatusColor(status)} rounded-full p-1 h-fit`}>
                                    {getStatusIcon(status)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-bold font-telugu text-lg">{stage.stage_name_te}</h5>
                                        <p className="text-sm text-muted-foreground">{stage.stage_name_en}</p>
                                      </div>
                                      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                                        {status.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <p className="text-sm mt-2 font-telugu">{stage.description_te}</p>

                                    {status === 'active' && (
                                      <Button
                                        className="mt-4 w-full"
                                        variant="outline"
                                        onClick={() => handleStageSelect(stage)}
                                      >
                                        <Bug className="h-4 w-4 mr-2" />
                                        సమస్యలను గుర్తించండి (Identify Problems)
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Problems Section */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold font-telugu flex items-center gap-2">
                        <Bug className="h-5 w-5 text-destructive" />
                        సాధారణ సమస్యలు (Common Problems)
                      </h4>

                      <div className="grid grid-cols-1 gap-4">
                        {stageProblems.length > 0 ? (
                          stageProblems.map((problem) => (
                            <Card
                              key={problem.id}
                              className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-destructive"
                              onClick={() => setSelectedProblem(problem)}
                            >
                              <CardContent className="p-4 flex gap-3">
                                <img
                                  src={problem.image_url1 || 'https://placehold.co/100x100?text=No+Image'}
                                  alt={problem.problem_name_en}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h5 className="font-bold font-telugu text-sm">{problem.problem_name_te}</h5>
                                  <p className="text-xs text-muted-foreground">{problem.problem_name_en}</p>
                                  <Badge variant="outline" className="mt-1 text-[10px] border-destructive/30 text-destructive">
                                    {problem.category}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <Card className="bg-muted/50 border-dashed">
                            <CardContent className="p-6 text-center text-muted-foreground">
                              <p className="text-sm">దశను ఎంచుకోండి (Select an active stage to view problems)</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problem Detail Modal */}
        <Dialog open={!!selectedProblem} onOpenChange={() => setSelectedProblem(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedProblem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-telugu text-destructive">
                    {selectedProblem.problem_name_te}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedProblem.problem_name_en}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-2">
                    {[selectedProblem.image_url1, selectedProblem.image_url2, selectedProblem.image_url3].filter(Boolean).map((img, i) => (
                      <img key={i} src={img} alt={`Problem ${i + 1}`} className="rounded-lg w-full h-24 object-cover border" />
                    ))}
                  </div>

                  {selectedProblem.crop_advisories?.map((advisory) => (
                    <div key={advisory.id} className="bg-muted/30 p-4 rounded-xl space-y-4">
                      <div>
                        <h4 className="font-bold text-lg font-telugu text-primary mb-1">{advisory.advisory_title_te}</h4>
                        <p className="text-sm text-muted-foreground">{advisory.symptoms_te}</p>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recommendations</h5>
                        {advisory.advisory_recommendations?.map((rec) => (
                          <div key={rec.id} className="flex gap-3 bg-white p-3 rounded-lg border shadow-sm">
                            <div className="bg-primary/10 p-2 rounded h-fit">
                              <Sprout className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold font-telugu text-sm">{rec.component_name_te}</p>
                              <p className="text-xs text-muted-foreground">{rec.component_type} - {rec.dose_te}</p>
                              <p className="text-xs mt-1 font-telugu text-gray-600">{rec.notes_te}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CropAdvisoryPage;
