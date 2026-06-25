// ═══════════════════════════════════════════════════════════════
//  VOICE ASSISTANT — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setTranscript("Listening... (Simulation)");
      setTimeout(() => {
        setTranscript("Navigate to Projects");
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
      setTranscript("");
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex flex-col items-center gap-2">
        {transcript && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0A0A0A]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#D4AF37]/15 text-sm text-[#D4AF37] mb-2"
          >
            {transcript}
          </motion.div>
        )}
        
        <button 
          onClick={toggleListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 cursor-pointer ${
            isListening 
            ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-[#171717] border-[#D4AF37]/15 text-[#A3A3A3] hover:border-[#D4AF37] hover:text-[#D4AF37]'
          }`}
        >
          {isListening ? <MicOff /> : <Mic />}
        </button>
      </div>
    </div>
  );
};

export default VoiceAssistant;