import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatsCard = ({ label, labelTe, value, icon: Icon }) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {Icon && <Icon className="h-8 w-8 text-green-600" />}
        </div>
        <div className="text-3xl font-bold text-green-700 font-poppins mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-700 font-telugu">
          {labelTe}
        </div>
        <div className="text-xs text-gray-600 font-poppins">
          {label}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
