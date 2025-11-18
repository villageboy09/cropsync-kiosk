import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, MapPin } from 'lucide-react';

const SeedCard = ({ seed, onViewDetails, onBuy }) => {
  const { variety_name_te, variety_name_en, crop_name, image_url, price, region, sowing_period } = seed;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200">
        {image_url ? (
          <img 
            src={image_url} 
            alt={variety_name_te}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🌱</span>
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-green-600 text-white font-poppins">
          {crop_name}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-telugu mb-1">
            {variety_name_te}
          </h3>
          <p className="text-sm text-gray-600 font-poppins">
            {variety_name_en}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          {sowing_period && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-poppins">{sowing_period}</span>
            </div>
          )}
          
          {region && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-poppins">{region}</span>
            </div>
          )}
        </div>

        {price && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-telugu">ధర:</span>
              <span className="text-2xl font-bold text-green-600 font-poppins">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          className="flex-1 font-poppins"
          onClick={() => onViewDetails(seed)}
        >
          Details
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 font-telugu"
          onClick={() => onBuy(seed)}
        >
          కొనండి
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SeedCard;
