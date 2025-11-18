import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

const MarketPriceCard = ({ market, district, variety, price, onAudioPlay }) => {
  return (
    <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 font-poppins">
              {market}
            </h3>
            <p className="text-sm text-gray-600 font-poppins">
              {district}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-orange-100"
            onClick={() => onAudioPlay && onAudioPlay(`${market}, ${district}`)}
          >
            <Volume2 className="h-4 w-4 text-orange-600" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-telugu">రకం:</span>
            <span className="text-sm font-medium text-gray-900 font-poppins">
              {variety}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-telugu">ధర (₹/క్వింటల్):</span>
            <span className="text-2xl font-bold text-green-600 font-poppins">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPriceCard;
