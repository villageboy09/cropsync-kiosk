import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

const SeedCard = ({ seed, onViewDetails, onBuy }) => {
  const { variety_name_te, variety_name_en, crop_name, image_url, price, region, sowing_period } = seed;

  return (
    <Card className="overflow-hidden border-0 shadow-premium-md hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-40 bg-secondary">
        {image_url ? (
          <img
            src={image_url}
            alt={variety_name_te}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🌱</span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
          {crop_name}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground font-telugu">
            {variety_name_te}
          </h3>
          <p className="text-sm text-muted-foreground">
            {variety_name_en}
          </p>
        </div>

        <div className="space-y-1.5 text-xs">
          {sowing_period && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
              <span>{sowing_period}</span>
            </div>
          )}

          {region && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
              <span>{region}</span>
            </div>
          )}
        </div>

        {price && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Price</span>
              <span className="text-lg font-bold text-primary">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails(seed)}
        >
          Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onBuy(seed)}
        >
          <span className="font-telugu">కొనండి</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SeedCard;
