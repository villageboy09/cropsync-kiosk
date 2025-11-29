import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Plane, CheckCircle2, History, MapPin, Leaf, Droplets, Wind, ShieldCheck } from 'lucide-react';
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
    { id: 'rice', name: 'Rice', nameTe: 'వరి', icon: '🌾', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'cotton', name: 'Cotton', nameTe: 'పత్తి', icon: '🌸', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { id: 'maize', name: 'Maize', nameTe: 'మక్క జొన్న', icon: '🌽', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'groundnut', name: 'Groundnut', nameTe: 'వేరుశెనగ', icon: '🥜', color: 'bg-amber-100 text-amber-700 border-amber-200' },
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
      pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: 'పెండింగ్' },
      confirmed: { color: 'bg-blue-50 text-blue-700 border-blue-200', text: 'ధృవీకరించబడింది' },
      completed: { color: 'bg-green-50 text-green-700 border-green-200', text: 'పూర్తయింది' },
      cancelled: { color: 'bg-red-50 text-red-700 border-red-200', text: 'రద్దు చేయబడింది' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={`${config.color} font-telugu px-3 py-1 rounded-full`}>{config.text}</Badge>;
  };

  const selectedCrop = cropTypes.find(c => c.id === currentBooking.crop_type);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4ade80] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a5d2c] tracking-tight">CarbonMint</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-white font-bold font-telugu"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            డాష్‌బోర్డ్ (Dashboard)
          </Button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-[#1a5d2c] font-telugu mb-2">
                🚁 డ్రోన్ బుకింగ్ (Drone Booking)
              </h2>
              <p className="text-gray-500">
                Book advanced drone spraying services for your crops.
              </p>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm"
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 font-telugu">బుకింగ్ విజయవంతమైంది!</h3>
                  <p className="text-green-700">Your drone service has been booked successfully.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
                  <CardTitle className="text-xl font-bold text-gray-800 font-telugu flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-[#4ade80]" />
                    వివరాలు నమోదు చేయండి (Enter Details)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Crop Selection */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium text-gray-700 font-telugu">పంట రకం (Crop Type)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {cropTypes.map((crop) => (
                          <div
                            key={crop.id}
                            onClick={() => handleFieldChange('crop_type', crop.id)}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 h-32 ${currentBooking.crop_type === crop.id
                                ? 'border-[#4ade80] bg-green-50 shadow-md scale-105'
                                : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'
                              }`}
                          >
                            <span className="text-4xl">{crop.icon}</span>
                            <span className={`font-bold font-telugu ${currentBooking.crop_type === crop.id ? 'text-[#1a5d2c]' : 'text-gray-600'}`}>
                              {crop.nameTe}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Acres Input */}
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-gray-700 font-telugu">ఎకరాలు (Acres)</Label>
                        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-12 w-12 rounded-xl hover:bg-white hover:shadow-sm text-2xl font-bold text-gray-500"
                            onClick={() => handleFieldChange('acres', Math.max(1, currentBooking.acres - 1))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={currentBooking.acres}
                            onChange={(e) => handleFieldChange('acres', parseInt(e.target.value) || 1)}
                            className="text-center text-2xl font-bold h-12 border-none bg-transparent focus-visible:ring-0 shadow-none"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-12 w-12 rounded-xl hover:bg-white hover:shadow-sm text-2xl font-bold text-gray-500"
                            onClick={() => handleFieldChange('acres', currentBooking.acres + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Date Input */}
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-gray-700 font-telugu">తేదీ (Date)</Label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="date"
                            value={currentBooking.service_date}
                            onChange={(e) => handleFieldChange('service_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="pl-12 h-16 text-lg rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-[#4ade80]"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-16 text-xl bg-[#1a5d2c] hover:bg-[#144a22] text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 transition-all hover:scale-[1.01] font-telugu"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Plane className="animate-pulse" /> ప్రాసెస్ చేస్తోంది...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Plane /> బుకింగ్ నిర్ధారించండి (Confirm Booking)
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm rounded-[2rem] bg-[#1a5d2c] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <CardHeader className="border-b border-white/10 pb-6 relative z-10">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 font-telugu">
                    <ShieldCheck className="h-6 w-6 text-[#4ade80]" />
                    బుకింగ్ సారాంశం
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-telugu">ఎంచుకున్న పంట</span>
                      <span className="font-bold text-lg flex items-center gap-2">
                        {selectedCrop ? (
                          <><span className="text-2xl">{selectedCrop.icon}</span> {selectedCrop.nameTe}</>
                        ) : (
                          <span className="text-white/50 text-sm">ఎంచుకోలేదు</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-telugu">విస్తీర్ణం</span>
                      <span className="font-bold text-lg">{currentBooking.acres} ఎకరాలు</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-telugu">ధర / ఎకరం</span>
                      <span className="font-bold text-lg">₹{currentBooking.rate_per_acre}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end">
                      <span className="text-white/90 font-bold font-telugu text-lg">మొత్తం చెల్లించాల్సినది</span>
                      <span className="text-4xl font-bold text-[#4ade80]">
                        ₹{currentBooking.total_cost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Droplets className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-600 font-telugu">సమర్థవంతమైన స్ప్రేయింగ్</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                  <div className="bg-orange-50 p-3 rounded-full">
                    <Wind className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-600 font-telugu">వేగవంతమైన సేవ</span>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 font-telugu flex items-center gap-2">
                <History className="h-6 w-6 text-gray-400" />
                నా బుకింగ్స్ (My Bookings)
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="rounded-full border-gray-200"
              >
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 font-telugu">ఇంకా బుకింగ్‌లు లేవు (No bookings yet)</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="border-0 shadow-sm rounded-3xl bg-white hover:shadow-md transition-all">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-bold">
                                {booking.crop_type.toUpperCase()}
                              </Badge>
                              {getStatusBadge(booking.booking_status)}
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                {booking.acres} Acres
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {new Date(booking.service_date).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Cost</span>
                              <span className="text-xl font-bold text-[#1a5d2c]">
                                ₹{booking.total_cost.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DroneBookingPage;
