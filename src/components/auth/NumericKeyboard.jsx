import React from 'react';
import { Button } from '@/components/ui/button';
import { Delete, RotateCcw, ArrowRight } from 'lucide-react';

const NumericKeyboard = ({ onKeyPress, onClear, onBackspace, onLogin, disabled }) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {numbers.map((num) => (
          <Button
            key={num}
            onClick={() => onKeyPress(num)}
            disabled={disabled}
            variant="outline"
            className="h-14 text-xl font-semibold bg-white hover:bg-secondary border border-border/60 shadow-sm hover:shadow transition-all duration-200"
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          onClick={onClear}
          disabled={disabled}
          variant="secondary"
          className="h-12 text-sm font-medium"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button
          onClick={onBackspace}
          disabled={disabled}
          variant="secondary"
          className="h-12 text-sm font-medium"
        >
          <Delete className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Login Button */}
      <Button
        onClick={onLogin}
        disabled={disabled}
        size="xl"
        className="w-full h-14 text-base font-semibold"
      >
        <span className="font-telugu">లాగిన్</span>
        <span className="mx-2">·</span>
        <span>Login</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default NumericKeyboard;
