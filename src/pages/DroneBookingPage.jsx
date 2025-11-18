import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, ArrowLeft, Calendar, DollarSign, Plane, CheckCircle2 } from 'lucide-react';
import { 
  updateBookingField, 
  resetCurrentBooking, 
  createBooking,
  fetchUserBookings,
  clearBookingSuccess 
} from '@/store/slices/droneSlice';
import { format } from 'date-fns';

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
      pending: { color: 'bg-yellow-500', text: 'పెండింగ్' },
      confirmed: { color: 'bg-blue-500', text: 'ధృవీకరించబడింది' },
      completed: { color: 'bg-green-500', text: 'పూర్తయింది' },
      cancelled: { color: 'bg-red-500', text: 'రద్దు చేయబడింది' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const selectedCrop = cropTypes.find(c => c.id === currentBooking.crop_type);

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
            🚁 డ్రోన్ బుకింగ్
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            Drone Spraying Service
          </p>
          <p className="text-sm text-gray-500 font-telugu mt-2">
            మీ పంటలకు డ్రోన్ స్ప్రేయింగ్ సేవను బుక్ చేయండి
          </p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="max-w-2xl mx-auto mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900 font-telugu">
                    బుకింగ్ విజయవంతమైంది!
                  </p>
                  <p className="text-sm text-green-700 font-poppins">
                    Your booking has been confirmed. We'll contact you soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-telugu">కొత్త బుకింగ్</CardTitle>
                <CardDescription className="font-poppins">
                  Fill in the details to book drone spraying service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Crop Type Selection */}
                  <div className="space-y-2">
                    <Label className="font-telugu">పంట రకం ఎంచుకోండి:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {cropTypes.map((crop) => (
                        <Button
                          key={crop.id}
                          type="button"
                          variant={currentBooking.crop_type === crop.id ? 'default' : 'outline'}
                          className={`h-20 ${
                            currentBooking.crop_type === crop.id
                              ? 'bg-green-600 hover:bg-green-700'
                              : ''
                          }`}
                          onClick={() => handleFieldChange('crop_type', crop.id)}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-1">{crop.icon}</div>
                            <div className="font-telugu">{crop.nameTe}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Acres Input */}
                  <div className="space-y-2">
                    <Label htmlFor="acres" className="font-telugu">
                      ఎకరాల సంఖ్య:
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
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
                        className="text-center text-2xl font-bold h-14 font-poppins"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleFieldChange('acres', currentBooking.acres + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Service Date */}
                  <div className="space-y-2">
                    <Label htmlFor="service_date" className="font-telugu">
                      సేవ తేదీ:
                    </Label>
                    <Input
                      id="service_date"
                      type="date"
                      value={currentBooking.service_date}
                      onChange={(e) => handleFieldChange('service_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12 font-poppins"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 font-telugu"
                  >
                    <Plane className="mr-2 h-5 w-5" />
                    {loading ? 'బుకింగ్ చేస్తోంది...' : 'బుకింగ్ ధృవీకరించండి'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-telugu">బుకింగ్ సారాంశం</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCrop && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-telugu">పంట:</span>
                    <span className="font-medium font-poppins">
                      {selectedCrop.icon} {selectedCrop.nameTe}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-telugu">ఎకరాలు:</span>
                  <span className="text-xl font-bold text-green-600 font-poppins">
                    {currentBooking.acres} acres
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-telugu">ధర/ఎకరం:</span>
                  <span className="font-medium font-poppins">
                    ₹{currentBooking.rate_per_acre.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 font-telugu">
                      మొత్తం ధర:
                    </span>
                    <span className="text-3xl font-bold text-green-600 font-poppins">
                      ₹{currentBooking.total_cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2 text-xs text-gray-600 font-telugu">
                  <p>✓ ప్రొఫెషనల్ డ్రోన్ ఆపరేటర్</p>
                  <p>✓ అధునాతన స్ప్రేయింగ్ పరికరాలు</p>
                  <p>✓ పర్యావరణ అనుకూల రసాయనాలు</p>
                  <p>✓ 24/7 కస్టమర్ మద్దతు</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking History */}
        <div className="max-w-7xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-telugu">బుకింగ్ చరిత్ర</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                  className="font-poppins"
                >
                  {showHistory ? 'Hide' : 'Show'} History
                </Button>
              </div>
            </CardHeader>
            {showHistory && (
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 font-telugu">
                    ఇంకా బుకింగ్‌లు లేవు
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-semibold font-poppins">
                                {booking.crop_type} - {booking.acres} acres
                              </p>
                              <p className="text-sm text-gray-600 font-poppins">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {booking.service_date}
                              </p>
                              <p className="text-sm font-semibold text-green-600 font-poppins">
                                <DollarSign className="inline h-3 w-3" />
                                ₹{booking.total_cost.toLocaleString('en-IN')}
                              </p>
                            </div>
                            {getStatusBadge(booking.booking_status)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DroneBookingPage;
