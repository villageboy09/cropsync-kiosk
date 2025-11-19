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
import { Store, Phone, Mail, MapPin, Play, ShoppingBag } from 'lucide-react';
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass border-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-3xl font-bold font-telugu text-primary mb-1">
                {product.product_name_te}
              </DialogTitle>
              <DialogDescription className="font-poppins text-lg text-muted-foreground">
                {product.product_name_en}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1 border-primary/30 text-primary">
              {product.category_te || product.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Left: Images/Video */}
          <div className="space-y-4">
            {product.video_url ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black/90 rounded-xl overflow-hidden shadow-lg border border-primary/20">
                  <video
                    controls
                    className="w-full h-full"
                    poster={images[0]}
                  >
                    <source src={product.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {images.length > 0 && <ImageCarousel images={images} alt={product.product_name_te} className="rounded-xl border border-primary/10" />}
              </div>
            ) : images.length > 0 ? (
              <div className="rounded-xl overflow-hidden shadow-lg border border-primary/20">
                <ImageCarousel images={images} alt={product.product_name_te} />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <ShoppingBag className="h-24 w-24 text-primary/30" />
              </div>
            )}

            {/* Price Card */}
            {product.price && (
              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-telugu">ధర (Price):</span>
                    <span className="text-3xl font-bold text-primary font-poppins">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-4">
              {product.description_te && (
                <div className="space-y-2">
                  <h4 className="font-bold text-lg text-primary font-telugu">వివరణ (Description):</h4>
                  <p className="text-base text-foreground/80 font-telugu leading-relaxed bg-white/50 p-4 rounded-lg border border-primary/10">
                    {product.description_te}
                  </p>
                </div>
              )}

              {product.description_en && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                    {product.description_en}
                  </p>
                </div>
              )}
            </div>

            {/* Vendor Information */}
            {product.advertisers && (
              <Card className="bg-white/50 border-primary/10">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-bold text-lg text-primary font-telugu flex items-center gap-2 border-b border-primary/10 pb-2">
                    <Store className="h-5 w-5" />
                    విక్రేత సమాచారం (Vendor Info)
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground font-poppins text-base">
                          {product.advertisers.advertiser_name}
                        </p>
                        <p className="text-xs text-muted-foreground">Verified Seller</p>
                      </div>
                    </div>

                    {product.advertisers.contact_number && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <a
                          href={`tel:${product.advertisers.contact_number}`}
                          className="text-primary hover:underline font-poppins font-medium"
                        >
                          {product.advertisers.contact_number}
                        </a>
                      </div>
                    )}

                    {product.advertisers.email && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <a
                          href={`mailto:${product.advertisers.email}`}
                          className="text-primary hover:underline font-poppins"
                        >
                          {product.advertisers.email}
                        </a>
                      </div>
                    )}

                    {product.advertisers.address && (
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-muted-foreground font-poppins">
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

        <DialogFooter className="mt-6 gap-3 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="font-poppins border-primary/20">
            Close
          </Button>
          <Button
            onClick={handleInquire}
            className="bg-primary hover:bg-primary/90 font-telugu text-lg px-8 shadow-lg shadow-primary/20"
          >
            <Phone className="mr-2 h-5 w-5" />
            విక్రేతను సంప్రదించండి (Contact Seller)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
