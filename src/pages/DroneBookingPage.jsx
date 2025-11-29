import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Sprout, ArrowLeft, Calendar, DollarSign, Plane, CheckCircle2, History, MapPin } from 'lucide-react';
import {
  updateBookingField,
  resetCurrentBooking,
  createBooking,
  fetchUserBookings,
  clearBookingSuccess
} from '@/store/slices/droneSlice';
import { motion, AnimatePresence } from 'framer-motion';

const DroneBookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentBooking, bookings, loading, bookingSuccess } = useSelector((state) => state.drone);
  const [showHistory, setShowHistory] = useState(false);

  const cropTypes = [
    { id: 'rice', name: 'Rice', nameTe: 'వరి', icon: '🌾' },
    { id: 'cotton', name: 'Cotton', nameTe: 'పత్తి', icon: '🌸' },
    { id: 'maize', name: 'Maize', nameTe: 'మక్క జొన్న', icon: '🌽' },
    { id: 'groundnut', name: 'Groundnut', nameTe: 'వేరుశెనగ', icon: '🥜' },
  ];

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (bookingSuccess) {
      setTimeout(() => {
        dispatch(clearBookingSuccess());
        dispatch(resetCurrentBooking());
      }, 3000);
    }
  }, [bookingSuccess, dispatch]);

  const handleFieldChange = (field, value) => {
    dispatch(updateBookingField({ field, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentBooking.crop_type || !currentBooking.service_date || !currentBooking.acres) {
      alert('దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి (Please fill all fields)');
      return;
    }

    const bookingData = {
      farmer_id: user.id,
      crop_type: currentBooking.crop_type,
      acres: currentBooking.acres,
      service_date: currentBooking.service_date,
      total_cost: currentBooking.total_cost,
      booking_status: 'pending',
      payment_status: 'pending',
    };

    dispatch(createBooking(bookingData));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', text: 'పెండింగ్' },
      confirmed: { color: 'bg-blue-500/10 text-blue-600 border-blue-200', text: 'ధృవీకరించబడింది' },
      completed: { color: 'bg-green-500/10 text-green-600 border-green-200', text: 'పూర్తయింది' },
      cancelled: { color: 'bg-red-500/10 text-red-600 border-red-200', text: 'రద్దు చేయబడింది' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={`${config.color} font-telugu`}>{config.text}</Badge>;
  };

  const selectedCrop = cropTypes.find(c => c.id === currentBooking.crop_type);

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
              🚁 డ్రోన్ బుకింగ్
            </h2>
            <p className="text-muted-foreground font-poppins">
              Drone Spraying Service
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-700 font-telugu text-lg">
                      బుకింగ్ విజయవంతమైంది!
                    </p>
                    <p className="text-sm text-green-600 font-poppins">
                      Your booking has been confirmed. We'll contact you soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="glass border-primary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="font-telugu text-2xl text-primary">కొత్త బుకింగ్</CardTitle>
                <CardDescription className="font-poppins">
                  Fill in the details to book drone spraying service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Crop Type Selection */}
                  <div className="space-y-3">
                    <Label className="font-telugu text-lg">పంట రకం ఎంచుకోండి:</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {cropTypes.map((crop) => (
                        <Button
                          key={crop.id}
                          type="button"
                          variant={currentBooking.crop_type === crop.id ? 'default' : 'outline'}
                          className={`h-24 transition-all duration-300 ${currentBooking.crop_type === crop.id
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 ring-2 ring-primary ring-offset-2'
                            : 'hover:bg-primary/5 hover:text-primary border-primary/20 glass'
                            }`}
                          onClick={() => handleFieldChange('crop_type', crop.id)}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2 drop-shadow-sm">{crop.icon}</div>
                            <div className="font-telugu font-bold">{crop.nameTe}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Acres Input */}
                    <div className="space-y-3">
                      <Label htmlFor="acres" className="font-telugu text-lg">
                        ఎకరాల సంఖ్య:
                      </Label>
                      <div className="flex items-center gap-4 bg-white/50 p-2 rounded-xl border border-primary/10">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-lg border-primary/20 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleFieldChange('acres', Math.max(1, currentBooking.acres - 1))}
                        >
                          -
                        </Button>
                        <Input
                          id="acres"
                          type="number"
                          min="1"
                          value={currentBooking.acres}
                          onChange={(e) => handleFieldChange('acres', parseInt(e.target.value) || 1)}
                          className="text-center text-2xl font-bold h-12 border-none bg-transparent focus-visible:ring-0 font-poppins"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-lg border-primary/20 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleFieldChange('acres', currentBooking.acres + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Service Date */}
                    <div className="space-y-3">
                      <Label htmlFor="service_date" className="font-telugu text-lg">
                        సేవ తేదీ:
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="service_date"
                          type="date"
                          value={currentBooking.service_date}
                          onChange={(e) => handleFieldChange('service_date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="pl-12 h-14 font-poppins text-lg glass border-primary/20 focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 text-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-telugu shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02]"
                  >
                    <Plane className={`mr-3 h-6 w-6 ${loading ? 'animate-pulse' : ''}`} />
                    {loading ? 'బుకింగ్ చేస్తోంది...' : 'బుకింగ్ ధృవీకరించండి'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glass border-primary/10 shadow-lg sticky top-24">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="font-telugu text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  బుకింగ్ సారాంశం
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {selectedCrop ? (
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-primary/5">
                    <span className="text-sm text-muted-foreground font-telugu">పంట (Crop):</span>
                    <span className="font-bold font-poppins text-lg flex items-center gap-2">
                      <span className="text-2xl">{selectedCrop.icon}</span> {selectedCrop.nameTe}
                    </span>
                  </div>
                ) : (
                  <div className="text-center p-4 text-muted-foreground font-telugu bg-white/50 rounded-xl border border-dashed border-primary/20">
                    పంటను ఎంచుకోండి
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-telugu">ఎకరాలు (Acres):</span>
                    <span className="font-bold text-foreground font-poppins">
                      {currentBooking.acres} acres
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-telugu">ధర/ఎకరం (Rate):</span>
                    <span className="font-medium font-poppins">
                      ₹{currentBooking.rate_per_acre.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary font-telugu">
                        మొత్తం ధర:
                      </span>
                      <span className="text-3xl font-bold text-primary font-poppins">
                        ₹{currentBooking.total_cost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-xl space-y-2 text-xs text-accent-foreground font-telugu border border-accent/20">
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> ప్రొఫెషనల్ డ్రోన్ ఆపరేటర్</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> అధునాతన స్ప్రేయింగ్ పరికరాలు</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> పర్యావరణ అనుకూల రసాయనాలు</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> 24/7 కస్టమర్ మద్దతు</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Booking History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto mt-12"
        >
          <Card className="glass border-primary/10 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="font-telugu text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  బుకింగ్ చరిత్ర
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                  className="font-poppins hover:bg-primary/10 hover:text-primary"
                >
                  {showHistory ? 'Hide' : 'Show'} History
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="p-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-primary/20">
                        <p className="text-xl text-muted-foreground font-telugu mb-2">
                          ఇంకా బుకింగ్‌లు లేవు
                        </p>
                        <p className="text-sm text-muted-foreground/80 font-poppins">
                          No bookings found yet
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookings.map((booking) => (
                          <Card key={booking.id} className="bg-white/50 hover:bg-white/80 transition-colors border-primary/10">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <Badge variant="outline" className="bg-primary/5 border-primary/20 font-poppins">
                                  {booking.crop_type.charAt(0).toUpperCase() + booking.crop_type.slice(1)}
                                </Badge>
                                {getStatusBadge(booking.booking_status)}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground font-poppins">
                                  <MapPin className="h-4 w-4 mr-2 text-primary/60" />
                                  {booking.acres} acres
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground font-poppins">
                                  <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                                  {new Date(booking.service_date).toLocaleDateString()}
                                </div>
                                <div className="pt-2 mt-2 border-t border-primary/5 flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground font-telugu">మొత్తం:</span>
                                  <span className="font-bold text-primary font-poppins">
                                    ₹{booking.total_cost.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default DroneBookingPage;
