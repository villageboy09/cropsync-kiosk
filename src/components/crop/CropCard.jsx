import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sprout, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';

export function CropCard({ crop, onView, onEdit, onDelete }) {
  const language = useSelector((state) => state.ui.language);
  
  const getText = (en, te) => language === 'te' ? te : en;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {language === 'te' ? crop.name_te : crop.name}
              </CardTitle>
              <CardDescription>
                {language === 'te' ? crop.category_te : crop.category}
              </CardDescription>
            </div>
          </div>
          <Badge variant={crop.status === 'active' ? 'default' : 'secondary'}>
            {getText(crop.status, crop.status_te)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {crop.image_url && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src={crop.image_url} 
              alt={crop.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {getText('Season:', 'సీజన్:')} {language === 'te' ? crop.season_te : crop.season}
            </span>
          </div>
          
          {crop.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{crop.location}</span>
            </div>
          )}
          
          {crop.yield_estimate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                {getText('Yield:', 'దిగుబడి:')} {crop.yield_estimate}
              </span>
            </div>
          )}
        </div>
        
        {crop.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {language === 'te' ? crop.description_te : crop.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={() => onView?.(crop)}
        >
          {getText('View Details', 'వివరాలు చూడండి')}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onEdit?.(crop)}
        >
          <span className="sr-only">{getText('Edit', 'సవరించు')}</span>
          ✏️
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDelete?.(crop)}
        >
          <span className="sr-only">{getText('Delete', 'తొలగించు')}</span>
          🗑️
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CropCard;
