import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pen, Palette, Search, Rocket,
  Sparkles, Coffee, FileText, Zap,
  BarChart3, Globe, Loader2
} from 'lucide-react';
import { Bot, BotStatus } from '../types';

// ============================================================================
// BOT AVATAR COMPONENTS - Each bot has unique visual personality
// ============================================================================

interface BotAvatarProps {
  bot: Bot;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isHovered?: boolean;
  isWorking?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
};

// WriteBot Avatar - Creative writer with floating quill and papers
export const WriteBotAvatar: React.FC<BotAvatarProps> = ({ bot, size = 'md', isHovered, isWorking }) => {
  const [banterIndex, setBanterIndex] = useState(0);
  
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setBanterIndex((prev) => (prev + 1) % bot.personality.banter.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, bot.personality.banter.length]);

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: bot.color }}
        animate={{
          opacity: isWorking ? [0.2, 0.4, 0.2] : 0.15,
          scale: isWorking ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: isWorking ? 0.5 : 2, repeat: Infinity }}
      />
      
      
      {/* Floating papers */}
      <AnimatePresence>
        {(isHovered || isWorking) && (
          <>
            <motion.div
              className="absolute -top-2 -right-2 text-emerald-400"
              initial={{ opacity: 0, y: 10, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                y: [-5, -15, -5],
                rotate: [0, 10, -5, 0],
                x: [0, 5, 0]
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="w-5 h-5" />
            </motion.div>
            <motion.div
              className="absolute -top-1 -left-3 text-emerald-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 0.8, 
                y: [-3, -12, -3],
                rotate: [0, -15, 5, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            >
              <FileText className="w-4 h-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main character body */}
      <motion.div
        className="relative z-10"
        animate={{
          y: isWorking ? [0, -5, 0] : [0, -3, 0],
          rotate: isWorking ? [0, 3, -3, 0] : 0
        }}
        transition={{ 
          duration: isWorking ? 0.3 : 2, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Bot head */}
        <div 
          className="rounded-2xl flex items-center justify-center shadow-lg"
          style={{ 
            backgroundColor: bot.color,
            width: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
            height: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
          }}
        >
          <motion.div
            animate={{
              rotate: isWorking ? [0, -10, 10, 0] : isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{ duration: isWorking ? 0.4 : 1, repeat: Infinity }}
          >
            <Pen className={`text-white ${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </motion.div>
        </div>

        {/* Coffee cup */}
        <motion.div
          className="absolute -bottom-1 -right-2 bg-amber-800 rounded-lg p-1"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <Coffee className="w-3 h-3 text-amber-100" />
          {(isHovered || isWorking) && (
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.6, 0], y: [-2, -8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-1 h-2 bg-gray-400 rounded-full" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Sparkles when working */}
      <AnimatePresence>
        {isWorking && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400"
                style={{
                  top: `${20 + i * 25}%`,
                  left: `${10 + i * 30}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// PixelBot Avatar - Artist with paintbrush and palette
export const PixelBotAvatar: React.FC<BotAvatarProps> = ({ bot, size = 'md', isHovered, isWorking }) => {
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Color swirl background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${bot.color}, #EC4899, #8B5CF6, ${bot.color})`,
        }}
        animate={{
          rotate: isWorking ? 360 : isHovered ? 180 : 0,
          opacity: isWorking ? 0.4 : 0.2,
        }}
        transition={{ 
          duration: isWorking ? 2 : 10, 
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Floating color blobs */}
      <AnimatePresence>
        {(isHovered || isWorking) && (
          <>
            {['#EC4899', '#8B5CF6', '#3B82F6'].map((color, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full blur-sm"
                style={{
                  backgroundColor: color,
                  width: size === 'sm' ? 8 : 16,
                  height: size === 'sm' ? 8 : 16,
                  top: `${20 + i * 20}%`,
                  right: `${10 + i * 15}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.8, 1.2, 0.8],
                  x: [0, 10, 0],
                  y: [0, -10, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main character */}
      <motion.div
        className="relative z-10"
        animate={{
          y: isWorking ? [0, -8, 0] : [0, -4, 0],
        }}
        transition={{ duration: isWorking ? 0.6 : 3, repeat: Infinity }}
      >
        <div 
          className="rounded-2xl flex items-center justify-center shadow-lg"
          style={{ 
            backgroundColor: bot.color,
            width: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
            height: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
          }}
        >
          <motion.div
            animate={{
              rotate: isWorking ? [0, -15, 15, 0] : 0,
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Palette className={`text-white ${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </motion.div>
        </div>

        {/* Paintbrush */}
        <motion.div
          className="absolute -bottom-2 -right-3"
          animate={{
            rotate: isWorking ? [0, -20, 20, 0] : isHovered ? [0, -10, 10, 0] : 0,
            y: isWorking ? [0, -5, 0] : 0,
          }}
          transition={{ duration: isWorking ? 0.4 : 1, repeat: Infinity }}
        >
          <div className="bg-amber-700 rounded-lg p-1.5 shadow-md">
            <div className="w-1 h-4 bg-amber-200 rounded-t" />
          </div>
          {isWorking && (
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -15, x: [0, 5, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-pink-400" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// KeyBot Avatar - Analyst with magnifying glass and data nodes
export const KeyBotAvatar: React.FC<BotAvatarProps> = ({ bot, size = 'md', isHovered, isWorking }) => {
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Grid background */}
      <div 
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${bot.color}33 1px, transparent 1px),
            linear-gradient(90deg, ${bot.color}33 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      />

      {/* Data nodes */}
      <AnimatePresence>
        {(isHovered || isWorking) && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  borderColor: bot.color,
                  width: size === 'sm' ? 6 : 12,
                  height: size === 'sm' ? 6 : 12,
                  top: `${15 + (i % 2) * 60}%`,
                  left: `${15 + Math.floor(i / 2) * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.1, 0.8],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="30%" y1="30%" x2="70%" y2="30%"
                stroke={bot.color}
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.line
                x1="30%" y1="70%" x2="70%" y2="70%"
                stroke={bot.color}
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
            </svg>
          </>
        )}
      </AnimatePresence>

      {/* Main character */}
      <motion.div
        className="relative z-10"
        animate={{
          y: isWorking ? [0, -4, 0] : [0, -2, 0],
        }}
        transition={{ duration: isWorking ? 0.4 : 2, repeat: Infinity }}
      >
        <div 
          className="rounded-2xl flex items-center justify-center shadow-lg"
          style={{ 
            backgroundColor: bot.color,
            width: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
            height: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
          }}
        >
          <motion.div
            animate={{
              scale: isWorking ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Search className={`text-white ${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </motion.div>
        </div>

        {/* Scanning effect */}
        {isWorking && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${bot.color}40, transparent)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>
    </div>
  );
};

// PressBot Avatar - Publisher with rocket and newspaper
export const PressBotAvatar: React.FC<BotAvatarProps> = ({ bot, size = 'md', isHovered, isWorking }) => {
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Launch pad glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${bot.color}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: isWorking ? [1, 1.3, 1] : isHovered ? [1, 1.1, 1] : 1,
          opacity: isWorking ? [0.5, 0.8, 0.5] : 0.3,
        }}
        transition={{ duration: isWorking ? 0.5 : 2, repeat: Infinity }}
      />

      {/* Rocket exhaust particles */}
      <AnimatePresence>
        {isWorking && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? '#F59E0B' : '#EF4444',
                  width: size === 'sm' ? 4 : 8,
                  height: size === 'sm' ? 4 : 8,
                  bottom: '10%',
                  left: '50%',
                  marginLeft: size === 'sm' ? -2 : -4,
                }}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ 
                  opacity: 0,
                  y: 30,
                  scale: 0.5,
                  x: (i - 2) * 10,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main character */}
      <motion.div
        className="relative z-10"
        animate={{
          y: isWorking ? [0, -20, 0] : [0, -3, 0],
        }}
        transition={{ duration: isWorking ? 0.8 : 2, repeat: Infinity }}
      >
        <div 
          className="rounded-2xl flex items-center justify-center shadow-lg"
          style={{ 
            backgroundColor: bot.color,
            width: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
            height: size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 100 : 140,
          }}
        >
          <motion.div
            animate={{
              y: isWorking ? [0, -5, 0] : 0,
              rotate: isWorking ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            <Rocket className={`text-white ${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </motion.div>
        </div>

        {/* Flying newspaper */}
        <AnimatePresence>
          {(isHovered || isWorking) && (
            <motion.div
              className="absolute -top-2 -right-4 bg-white rounded shadow-md p-1"
              initial={{ opacity: 0, x: 0, rotate: 0 }}
              animate={{ 
                opacity: 1,
                x: [0, 10, 5],
                y: [0, -5, -10],
                rotate: [0, 10, 5]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-4 h-5 bg-gray-200 rounded-sm" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Globe icon */}
      <motion.div
        className="absolute -bottom-1 -left-2 text-blue-400"
        animate={{
          rotate: 360,
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <Globe className="w-4 h-4" />
      </motion.div>
    </div>
  );
};

// Avatar selector component
export const BotAvatar: React.FC<BotAvatarProps> = (props) => {
  switch (props.bot.id) {
    case 'writebot':
      return <WriteBotAvatar {...props} />;
    case 'pixelbot':
      return <PixelBotAvatar {...props} />;
    case 'keybot':
      return <KeyBotAvatar {...props} />;
    case 'pressbot':
      return <PressBotAvatar {...props} />;
    default:
      return <WriteBotAvatar {...props} />;
  }
};

export default BotAvatar;
