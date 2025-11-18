import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({
  title,
  titleTe,
  image,
  route,
  icon: Icon,
  accentColor = 'bg-primary',
  onAudioPlay
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
    <Card
      className="group relative overflow-hidden cursor-pointer bg-card border-0 shadow-premium-md hover:shadow-premium-xl transition-all duration-300 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden bg-secondary">
        <img
          src={image}
          alt={titleTe}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Icon Badge */}
        {Icon && (
          <div className={`absolute top-4 left-4 p-2.5 ${accentColor} rounded-xl shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}

        {/* Audio Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={handleAudioClick}
        >
          <Volume2 className="h-4 w-4 text-accent" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground font-telugu truncate">
              {titleTe}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {title}
            </p>
          </div>

          {/* Arrow */}
          <div className="ml-3 flex-shrink-0">
            <div className="p-2 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors duration-200">
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
