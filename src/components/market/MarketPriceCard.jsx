import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketPriceCard = ({ market, district, variety, price, onAudioPlay }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass border-primary/10 hover:shadow-lg transition-shadow group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-primary font-poppins mb-1">
                {market}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground font-poppins">
                <MapPin className="h-3 w-3 mr-1" />
                {district}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
              onClick={() => onAudioPlay && onAudioPlay(`${market}, ${district}`)}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3 bg-white/50 rounded-lg p-3 border border-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-telugu">రకం (Variety):</span>
              <span className="text-sm font-bold text-foreground font-poppins">
                {variety}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-primary/5">
              <span className="text-sm text-muted-foreground font-telugu">ధర (Price/Qtl):</span>
              <span className="text-2xl font-bold text-primary font-poppins flex items-center">
                ₹{price.toLocaleString('en-IN')}
                <TrendingUp className="h-4 w-4 ml-1 text-primary/50" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketPriceCard;
