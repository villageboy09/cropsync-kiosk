import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowRight, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const SeedCard = ({ seed, onViewDetails, onBuy }) => {
  const { variety_name_te, variety_name_en, crop_name, image_url, price, region, sowing_period } = seed;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass overflow-hidden border-primary/10 h-full flex flex-col group">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          {image_url ? (
            <img
              src={image_url}
              alt={variety_name_te}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
              <Sprout className="h-16 w-16 text-green-600/50" />
            </div>
          )}
          <Badge className="absolute top-3 left-3 z-20 bg-white/90 text-primary hover:bg-white font-poppins backdrop-blur-sm">
            {crop_name}
          </Badge>
          <div className="absolute bottom-3 left-3 right-3 z-20">
            <h3 className="text-lg font-bold text-white font-telugu leading-tight mb-0.5">
              {variety_name_te}
            </h3>
            <p className="text-xs text-gray-200 font-poppins truncate">
              {variety_name_en}
            </p>
          </div>
        </div>

        <CardContent className="p-4 space-y-4 flex-1">
          <div className="space-y-2 text-sm">
            {sowing_period && (
              <div className="flex items-center text-muted-foreground bg-primary/5 p-2 rounded-lg">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="font-poppins text-xs">{sowing_period}</span>
              </div>
            )}

            {region && (
              <div className="flex items-center text-muted-foreground bg-primary/5 p-2 rounded-lg">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="font-poppins text-xs truncate">{region}</span>
              </div>
            )}
          </div>

          {price && (
            <div className="flex items-end justify-between pt-2">
              <span className="text-sm text-muted-foreground font-telugu">ధర (Price):</span>
              <span className="text-2xl font-bold text-primary font-poppins">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-3">
          <Button
            variant="outline"
            className="flex-1 font-poppins border-primary/20 hover:bg-primary/5 hover:text-primary"
            onClick={() => onViewDetails(seed)}
          >
            Details
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 font-telugu shadow-lg shadow-primary/20"
            onClick={() => onBuy(seed)}
          >
            కొనండి <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SeedCard;
