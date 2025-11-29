import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Key = ({ children, onClick, className, disabled }) => (
  <motion.button
    whileTap={{ scale: 0.75, backgroundColor: "rgba(0,0,0,0.1)" }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    onClick={onClick}
    disabled={disabled}
    className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium text-zinc-900 outline-none select-none ${className}`}
  >
    {children}
  </motion.button>
);

const CredKeyboard = ({ onKeyPress, onClear, onBackspace, onLogin, disabled }) => {
  const teluguNumbers = {
    '0': 'సున్నా', '1': 'ఒకటి', '2': 'రెండు', '3': 'మూడు', '4': 'నాలుగు',
    '5': 'ఐదు', '6': 'ఆరు', '7': 'ఏడు', '8': 'ఎనిమిది', '9': 'తొమ్మిది'
  };

  const speakNumber = (num) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(teluguNumbers[num]);
      utterance.lang = 'te-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePress = (num) => {
    speakNumber(num);
    onKeyPress(num);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Key key={num} onClick={() => handlePress(num.toString())} disabled={disabled}>
            {num}
          </Key>
        ))}

        <Key onClick={onClear} className="text-sm font-bold tracking-widest text-zinc-400 uppercase" disabled={disabled}>
          Clear
        </Key>

        <Key onClick={() => handlePress('0')} disabled={disabled}>
          0
        </Key>

        <Key onClick={onBackspace} disabled={disabled}>
          <ArrowLeft className="w-6 h-6 text-zinc-400" />
        </Key>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogin}
        disabled={disabled}
        className="w-full max-w-[280px] mt-4 h-14 bg-zinc-900 text-white rounded-full font-medium text-lg shadow-lg shadow-zinc-200 flex items-center justify-center gap-2"
      >
        <span>Login</span>
        <span className="opacity-50 text-sm font-normal">(లాగిన్)</span>
      </motion.button>
    </div>
  );
};

export default CredKeyboard;
