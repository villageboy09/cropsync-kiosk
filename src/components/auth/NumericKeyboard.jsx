import React from 'react';
import { Button } from '@/components/ui/button';
import { Delete, X } from 'lucide-react';

const NumericKeyboard = ({ onKeyPress, onClear, onBackspace, onLogin, disabled }) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-3">
        {numbers.map((num) => (
          <Button
            key={num}
            onClick={() => onKeyPress(num)}
            disabled={disabled}
            className="h-16 text-2xl font-semibold bg-white text-gray-900 hover:bg-gray-100 border-2 border-gray-300 shadow-md"
            variant="outline"
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onClear}
          disabled={disabled}
          className="h-14 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white"
        >
          <X className="mr-2 h-5 w-5" />
          Clear
        </Button>
        <Button
          onClick={onBackspace}
          disabled={disabled}
          className="h-14 text-lg font-semibold bg-pink-500 hover:bg-pink-600 text-white"
        >
          <Delete className="mr-2 h-5 w-5" />
          Backspace
        </Button>
      </div>

      {/* Login Button */}
      <Button
        onClick={onLogin}
        disabled={disabled}
        className="w-full h-16 text-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg"
      >
        లాగిన్ చేయండి (Login)
      </Button>
    </div>
  );
};

export default NumericKeyboard;
