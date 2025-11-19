import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Phone, ArrowRight, ShoppingBag } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onViewDetails, onInquire }) => {
  const { product_name_te, product_name_en, category, category_te, price, advertisers, image_url_1, image_url_2, image_url_3 } = product;

  const images = [image_url_1, image_url_2, image_url_3].filter(Boolean);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass overflow-hidden border-primary/10 h-full flex flex-col group">
        <div className="relative h-48 overflow-hidden">
          {images.length > 0 ? (
            <ImageCarousel images={images} alt={product_name_te} className="h-full w-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <ShoppingBag className="h-16 w-16 text-primary/30" />
            </div>
          )}
          <Badge className="absolute top-3 left-3 z-20 bg-white/90 text-primary hover:bg-white font-poppins backdrop-blur-sm shadow-sm">
            {category_te || category}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-4 flex-1">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-primary font-telugu leading-tight line-clamp-2">
              {product_name_te}
            </h3>
            <p className="text-xs text-muted-foreground font-poppins line-clamp-1">
              {product_name_en}
            </p>
          </div>

          {advertisers && (
            <div className="flex items-center text-sm text-muted-foreground bg-primary/5 p-2 rounded-lg">
              <Store className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <span className="font-poppins truncate text-xs">{advertisers.advertiser_name}</span>
            </div>
          )}

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
            onClick={() => onViewDetails(product)}
          >
            Details
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 font-telugu shadow-lg shadow-primary/20"
            onClick={() => onInquire(product)}
          >
            <Phone className="mr-2 h-4 w-4" />
            విచారించండి
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
