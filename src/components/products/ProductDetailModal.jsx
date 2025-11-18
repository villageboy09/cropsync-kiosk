import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Phone, Mail, MapPin, Play } from 'lucide-react';
import ImageCarousel from '@/components/common/ImageCarousel';

const ProductDetailModal = ({ product, isOpen, onClose, onInquire }) => {
  if (!product) return null;

  const images = [product.image_url_1, product.image_url_2, product.image_url_3].filter(Boolean);

  const handleInquire = () => {
    onInquire(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-telugu">{product.product_name_te}</DialogTitle>
          <DialogDescription className="font-poppins">{product.product_name_en}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Images/Video */}
          <div className="space-y-4">
            {product.video_url ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full"
                    poster={images[0]}
                  >
                    <source src={product.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {images.length > 0 && <ImageCarousel images={images} alt={product.product_name_te} />}
              </div>
            ) : (
              <ImageCarousel images={images} alt={product.product_name_te} />
            )}

            <Badge className="bg-orange-500 text-white font-telugu text-sm">
              {product.category_te || product.category}
            </Badge>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            {/* Price */}
            {product.price && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-telugu">ధర:</span>
                    <span className="text-3xl font-bold text-green-700 font-poppins">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {product.description_te && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 font-telugu">వివరణ:</h4>
                <p className="text-sm text-gray-700 font-telugu leading-relaxed">
                  {product.description_te}
                </p>
              </div>
            )}

            {product.description_en && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 font-poppins">Description:</h4>
                <p className="text-sm text-gray-700 font-poppins leading-relaxed">
                  {product.description_en}
                </p>
              </div>
            )}

            {/* Vendor Information */}
            {product.advertisers && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 font-telugu flex items-center gap-2">
                    <Store className="h-5 w-5 text-green-600" />
                    విక్రేత సమాచారం
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Store className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 font-poppins">
                          {product.advertisers.advertiser_name}
                        </p>
                      </div>
                    </div>

                    {product.advertisers.contact_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <a 
                          href={`tel:${product.advertisers.contact_number}`}
                          className="text-green-600 hover:underline font-poppins"
                        >
                          {product.advertisers.contact_number}
                        </a>
                      </div>
                    )}

                    {product.advertisers.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <a 
                          href={`mailto:${product.advertisers.email}`}
                          className="text-green-600 hover:underline font-poppins"
                        >
                          {product.advertisers.email}
                        </a>
                      </div>
                    )}

                    {product.advertisers.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 font-poppins">
                          {product.advertisers.address}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-poppins">
            Close
          </Button>
          <Button 
            onClick={handleInquire}
            className="bg-green-600 hover:bg-green-700 font-telugu"
          >
            <Phone className="mr-2 h-4 w-4" />
            విక్రేతను సంప్రదించండి
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
