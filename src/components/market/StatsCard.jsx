import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatsCard = ({ label, labelTe, value, icon: Icon }) => {
  return (
    <Card className="glass border-primary/10 hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
          </div>
        </div>
        <div className="text-3xl font-bold text-primary font-poppins mb-1 tracking-tight">
          {value}
        </div>
        <div className="text-sm font-medium text-foreground/80 font-telugu">
          {labelTe}
        </div>
        <div className="text-xs text-muted-foreground font-poppins">
          {label}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
