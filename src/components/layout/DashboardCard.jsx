import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardCard = ({
  title,
  titleTe,
  image,
  route,
  borderColor = 'border-primary',
  onAudioPlay,
  index = 0
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (route) {
      navigate(route);
    }
  };

  const handleAudioClick = (e) => {
    e.stopPropagation();
    if (onAudioPlay) {
      onAudioPlay();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className={`relative overflow-hidden cursor-pointer group h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm`}
        onClick={handleCardClick}
      >
        <div className={`absolute top-0 left-0 w-1 h-full ${borderColor.replace('border-', 'bg-')} opacity-80`} />

        <CardContent className="p-0 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src={image}
              alt={titleTe}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Play Button Overlay */}
            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                onClick={handleCardClick}
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </Button>
            </div>

            {/* Title Overlay (Mobile/Compact) */}
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="text-xl font-bold text-white font-telugu drop-shadow-md">
                {titleTe}
              </h3>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-poppins uppercase tracking-wider mb-1">
                  {title}
                </p>
              </div>

              {/* Audio Button */}
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary -mt-1 -mr-2"
                onClick={handleAudioClick}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Click to view details</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCard;
