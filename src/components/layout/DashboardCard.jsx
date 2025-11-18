import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ 
  title, 
  titleTe, 
  image, 
  route, 
  borderColor = 'border-green-500',
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
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-l-8 ${borderColor} group`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            src={image} 
            alt={titleTe}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute bottom-4 right-4">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
              onClick={handleCardClick}
            >
              <Play className="h-6 w-6 text-white fill-white" />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 font-telugu mb-1">
                {titleTe}
              </h3>
              <p className="text-sm text-gray-600 font-poppins">
                {title}
              </p>
            </div>
            
            {/* Audio Button */}
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-orange-100"
              onClick={handleAudioClick}
            >
              <Volume2 className="h-5 w-5 text-orange-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
