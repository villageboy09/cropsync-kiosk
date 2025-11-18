import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Phone } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel';

const ProductCard = ({ product, onViewDetails, onInquire }) => {
  const { product_name_te, product_name_en, category, category_te, price, advertisers, image_url_1, image_url_2, image_url_3 } = product;

  const images = [image_url_1, image_url_2, image_url_3].filter(Boolean);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <ImageCarousel images={images} alt={product_name_te} />

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 font-telugu mb-1 line-clamp-2">
              {product_name_te}
            </h3>
            <p className="text-sm text-gray-600 font-poppins line-clamp-1">
              {product_name_en}
            </p>
          </div>
          <Badge className="bg-orange-500 text-white font-telugu whitespace-nowrap">
            {category_te || category}
          </Badge>
        </div>

        {advertisers && (
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Store className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="font-poppins truncate">{advertisers.advertiser_name}</span>
          </div>
        )}

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
          onClick={() => onViewDetails(product)}
        >
          Details
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 font-telugu"
          onClick={() => onInquire(product)}
        >
          <Phone className="mr-2 h-4 w-4" />
          విచారించండి
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
