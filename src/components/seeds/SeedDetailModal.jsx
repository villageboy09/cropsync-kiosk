import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus, Play } from 'lucide-react';

const SeedDetailModal = ({ seed, isOpen, onClose, onOrder }) => {
  const [quantity, setQuantity] = useState(1);

  if (!seed) return null;

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleOrder = () => {
    onOrder({ seed, quantity });
    onClose();
  };

  const totalPrice = seed.price ? seed.price * quantity : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-telugu">{seed.variety_name_te}</DialogTitle>
          <DialogDescription className="font-poppins">{seed.variety_name_en}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Video/Image */}
          <div className="space-y-4">
            {seed.testimonial_video_url ? (
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video 
                  controls 
                  className="w-full h-full"
                  poster={seed.image_url}
                >
                  <source src={seed.testimonial_video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : seed.image_url ? (
              <div className="relative aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden">
                <img 
                  src={seed.image_url} 
                  alt={seed.variety_name_te}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <span className="text-9xl">🌱</span>
              </div>
            )}

            <Badge className="bg-green-600 text-white font-poppins text-sm">
              {seed.crop_name}
            </Badge>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 space-y-3">
                {seed.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-telugu">ధర:</span>
                    <span className="text-2xl font-bold text-green-700 font-poppins">
                      ₹{seed.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                
                {seed.sowing_period && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-telugu">విత్తన కాలం:</span>
                    <span className="text-sm font-medium text-gray-900 font-poppins">
                      {seed.sowing_period}
                    </span>
                  </div>
                )}

                {seed.region && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-telugu">ప్రాంతం:</span>
                    <span className="text-sm font-medium text-gray-900 font-poppins">
                      {seed.region}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {seed.details_te && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 font-telugu">వివరాలు:</h4>
                <p className="text-sm text-gray-700 font-telugu leading-relaxed">
                  {seed.details_te}
                </p>
              </div>
            )}

            {seed.details_en && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 font-poppins">Details:</h4>
                <p className="text-sm text-gray-700 font-poppins leading-relaxed">
                  {seed.details_en}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label className="font-telugu">పరిమాణం (కిలోలు):</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center font-poppins"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            {seed.price && (
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 font-telugu">
                    మొత్తం ధర:
                  </span>
                  <span className="text-3xl font-bold text-green-600 font-poppins">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-poppins">
            Cancel
          </Button>
          <Button 
            onClick={handleOrder}
            className="bg-green-600 hover:bg-green-700 font-telugu"
          >
            ఇప్పుడు ఆర్డర్ చేయండి
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeedDetailModal;
