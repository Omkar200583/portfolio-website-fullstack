import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all duration-300 transform active:scale-95";
  const variants = {
    primary: "bg-cyber-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:bg-cyan-400",
    secondary: "bg-transparent border-2 border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-white",
    outline: "border border-gray-600 text-gray-300 hover:border-white hover:text-white"
  };

  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;