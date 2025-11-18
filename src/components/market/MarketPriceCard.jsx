import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const MarketPriceCard = ({ market, district, variety, price, onAudioPlay }) => {
  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">
              {market}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {district}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Variety</span>
            <span className="text-sm font-medium">
              {variety}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground font-telugu">ధర/క్వింటల్</span>
            <span className="text-xl font-bold text-primary">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPriceCard;
