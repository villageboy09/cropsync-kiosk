import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, ArrowLeft, Calendar, Minus, Plus, Plane, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
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
    { id: 'maize', name: 'Maize', nameTe: 'మక్క', icon: '🌽' },
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
      alert('Please fill all fields');
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
      pending: { variant: 'secondary', text: 'Pending' },
      confirmed: { variant: 'default', text: 'Confirmed' },
      completed: { variant: 'success', text: 'Completed' },
      cancelled: { variant: 'destructive', text: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const selectedCrop = cropTypes.find(c => c.id === currentBooking.crop_type);

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

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
            డ్రోన్ బుకింగ్
          </h2>
          <p className="text-muted-foreground">Drone Spraying Service</p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <Card className="mb-6 border-0 shadow-premium bg-primary/5 animate-fade-in-up">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground font-telugu">
                  బుకింగ్ విజయవంతమైంది!
                </p>
                <p className="text-sm text-muted-foreground">
                  Your booking has been confirmed
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <Card className="border-0 shadow-premium-md">
              <CardHeader>
                <CardTitle className="text-lg font-telugu">కొత్త బుకింగ్</CardTitle>
                <CardDescription>
                  Book drone spraying service for your crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Crop Type */}
                  <div className="space-y-3">
                    <Label className="font-telugu">పంట రకం</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {cropTypes.map((crop) => (
                        <Button
                          key={crop.id}
                          type="button"
                          variant={currentBooking.crop_type === crop.id ? 'default' : 'outline'}
                          className={`h-16 flex-col gap-1 ${
                            currentBooking.crop_type === crop.id ? '' : 'border-border/60'
                          }`}
                          onClick={() => handleFieldChange('crop_type', crop.id)}
                        >
                          <span className="text-xl">{crop.icon}</span>
                          <span className="font-telugu text-xs">{crop.nameTe}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Acres */}
                  <div className="space-y-3">
                    <Label className="font-telugu">ఎకరాలు</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleFieldChange('acres', Math.max(1, currentBooking.acres - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={currentBooking.acres}
                        onChange={(e) => handleFieldChange('acres', parseInt(e.target.value) || 1)}
                        className="text-center text-2xl font-bold h-12 flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleFieldChange('acres', currentBooking.acres + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Service Date */}
                  <div className="space-y-3">
                    <Label className="font-telugu">సేవ తేదీ</Label>
                    <Input
                      type="date"
                      value={currentBooking.service_date}
                      onChange={(e) => handleFieldChange('service_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    <Plane className="mr-2 h-5 w-5" />
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6 animate-fade-in-up animation-delay-100">
            <Card className="border-0 shadow-premium-md sticky top-24">
              <CardHeader>
                <CardTitle className="text-base font-telugu">సారాంశం</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCrop && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Crop</span>
                    <span className="font-medium">
                      {selectedCrop.icon} {selectedCrop.nameTe}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Acres</span>
                  <span className="text-xl font-bold text-primary">
                    {currentBooking.acres}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rate</span>
                  <span className="font-medium">
                    ₹{currentBooking.rate_per_acre.toLocaleString('en-IN')}/acre
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold font-telugu">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{currentBooking.total_cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                  <p>✓ Professional drone operator</p>
                  <p>✓ Advanced spraying equipment</p>
                  <p>✓ Eco-friendly chemicals</p>
                  <p>✓ 24/7 support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking History */}
        <div className="mt-8 animate-fade-in-up animation-delay-200">
          <Card className="border-0 shadow-premium-md">
            <CardHeader>
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setShowHistory(!showHistory)}
              >
                <CardTitle className="text-base font-telugu">బుకింగ్ చరిత్ర</CardTitle>
                {showHistory ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </CardHeader>
            {showHistory && (
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 font-telugu">
                    ఇంకా బుకింగ్‌లు లేవు
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">
                                {booking.crop_type} · {booking.acres} acres
                              </p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {booking.service_date}
                                </span>
                                <span className="font-semibold text-primary">
                                  ₹{booking.total_cost.toLocaleString('en-IN')}
                                </span>
                              </div>
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
