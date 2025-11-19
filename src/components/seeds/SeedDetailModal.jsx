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
import { X, Plus, Minus, Play, ShoppingCart, Sprout } from 'lucide-react';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-3xl font-bold font-telugu text-primary mb-1">
                {seed.variety_name_te}
              </DialogTitle>
              <DialogDescription className="font-poppins text-lg text-muted-foreground">
                {seed.variety_name_en}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1 border-primary/30 text-primary">
              {seed.crop_name}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Left: Video/Image */}
          <div className="space-y-4">
            {seed.testimonial_video_url ? (
              <div className="relative aspect-video bg-black/90 rounded-xl overflow-hidden shadow-lg border border-primary/20 group">
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
              <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl overflow-hidden shadow-lg border border-primary/20">
                <img
                  src={seed.image_url}
                  alt={seed.variety_name_te}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Sprout className="h-24 w-24 text-primary/30" />
              </div>
            )}

            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-4 space-y-3">
                {seed.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-telugu">ధర (Price):</span>
                    <span className="text-2xl font-bold text-primary font-poppins">
                      ₹{seed.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {seed.sowing_period && (
                  <div className="flex justify-between items-center border-t border-primary/10 pt-2">
                    <span className="text-sm text-muted-foreground font-telugu">విత్తన కాలం (Sowing Period):</span>
                    <span className="text-sm font-medium font-poppins">
                      {seed.sowing_period}
                    </span>
                  </div>
                )}

                {seed.region && (
                  <div className="flex justify-between items-center border-t border-primary/10 pt-2">
                    <span className="text-sm text-muted-foreground font-telugu">ప్రాంతం (Region):</span>
                    <span className="text-sm font-medium font-poppins">
                      {seed.region}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-4">
              {seed.details_te && (
                <div className="space-y-2">
                  <h4 className="font-bold text-lg text-primary font-telugu">వివరాలు (Details):</h4>
                  <p className="text-base text-foreground/80 font-telugu leading-relaxed bg-white/50 p-4 rounded-lg border border-primary/10">
                    {seed.details_te}
                  </p>
                </div>
              )}

              {seed.details_en && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                    {seed.details_en}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <Label className="font-telugu text-lg">పరిమాణం (Quantity in Kg):</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-primary/20 rounded-lg bg-white/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center font-poppins border-none bg-transparent focus-visible:ring-0 text-lg font-bold"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm text-muted-foreground block">Total</span>
                  <span className="text-2xl font-bold text-primary font-poppins">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-3 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="font-poppins border-primary/20">
            Cancel
          </Button>
          <Button
            onClick={handleOrder}
            className="bg-primary hover:bg-primary/90 font-telugu text-lg px-8 shadow-lg shadow-primary/20"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            ఇప్పుడు ఆర్డర్ చేయండి (Order Now)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeedDetailModal;
