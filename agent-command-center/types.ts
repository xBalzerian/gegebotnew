import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pen, Image, Search, Globe, 
  Zap, Clock, CheckCircle, AlertCircle,
  ChevronRight, Sparkles, Coffee, Palette,
  Rocket, FileText, BarChart3, Settings,
  History, Plus, X, Loader2
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type BotStatus = 'idle' | 'working' | 'completed' | 'error' | 'offline';

export interface Bot {
  id: string;
  name: string;
  role: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  stats: {
    label: string;
    value: string;
  }[];
  status: BotStatus;
  currentTask?: Task;
  personality: {
    greeting: string;
    workingPhrase: string;
    completePhrase: string;
    banter: string[];
  };
}

export interface Task {
  id: string;
  type: 'quick' | 'custom' | 'template';
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedAt: Date;
  completedAt?: Date;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  botId: string;
  config: Record<string, any>;
}

// ============================================================================
// BOT DATA
// ============================================================================

export const BOTS: Bot[] = [
  {
    id: 'writebot',
    name: 'WriteBot',
    role: 'Content Writer',
    description: 'Creative wordsmith specializing in blogs, copy, and compelling narratives',
    color: '#10B981', // emerald
    icon: <Pen className="w-6 h-6" />,
    stats: [
      { label: 'Articles', value: '247' },
      { label: 'SEO Score', value: '98%' },
    ],
    status: 'idle',
    personality: {
      greeting: "Hey there! Ready to craft some amazing content? ☕",
      workingPhrase: "Words are flowing... creativity engaged! ✍️",
      completePhrase: "Another masterpiece delivered! 🎉",
      banter: [
        "Coffee's brewing, creativity flowing ☕",
        "Plot twist incoming... 📝",
        "The muse is with me today ✨",
        "Typing at the speed of thought ⚡"
      ]
    }
  },
  {
    id: 'pixelbot',
    name: 'PixelBot',
    role: 'Image Generation',
    description: 'Digital artist creating stunning visuals from your imagination',
    color: '#8B5CF6', // violet
    icon: <Palette className="w-6 h-6" />,
    stats: [
      { label: 'Images', value: '1.2k' },
      { label: 'Avg Gen', value: '4s' },
    ],
    status: 'idle',
    personality: {
      greeting: "Hello! Let's paint something beautiful together! 🎨",
      workingPhrase: "Mixing colors, crafting pixels... 🖌️",
      completePhrase: "Your vision, visualized! 🖼️",
      banter: [
        "Mixing the perfect palette... 🎨",
        "Inspiration strikes! 💡",
        "Colors dancing on canvas... ✨",
        "Pixel perfection in progress 🔮"
      ]
    }
  },
  {
    id: 'keybot',
    name: 'KeyBot',
    role: 'Keyword Mapper',
    description: 'SEO strategist mapping the path to search dominance',
    color: '#F59E0B', // amber
    icon: <Search className="w-6 h-6" />,
    stats: [
      { label: 'Keywords', value: '8.5k' },
      { label: 'Accuracy', value: '92%' },
    ],
    status: 'idle',
    personality: {
      greeting: "Greetings. I'm ready to analyze and optimize. 🔍",
      workingPhrase: "Processing data patterns... calculating... 📊",
      completePhrase: "Analysis complete. Insights ready. 📈",
      banter: [
        "Analyzing patterns... fascinating 📊",
        "Data never lies... usually 📉",
        "Connecting the dots... 🔗",
        "SEO secrets unlocked 🔓"
      ]
    }
  },
  {
    id: 'pressbot',
    name: 'PressBot',
    role: 'WordPress Autopost',
    description: 'Publishing powerhouse getting your content live instantly',
    color: '#3B82F6', // blue
    icon: <Rocket className="w-6 h-6" />,
    stats: [
      { label: 'Posts', value: '432' },
      { label: 'Sites', value: '12' },
    ],
    status: 'idle',
    personality: {
      greeting: "Ready to launch! Your content is going live! 🚀",
      workingPhrase: "Publishing in 3... 2... 1... 🚀",
      completePhrase: "Live and published! World, meet your content! 🌍",
      banter: [
        "Ready to launch! 🚀",
        "Publishing perfection... 📰",
        "Going live momentarily... ⏰",
        "Content deployment engaged! 🎯"
      ]
    }
  },
];

// ============================================================================
// TASK TEMPLATES
// ============================================================================

export const TASK_TEMPLATES: TaskTemplate[] = [
  // WriteBot Templates
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'SEO-optimized article (800-1500 words)',
    botId: 'writebot',
    config: { type: 'blog', wordCount: 1000 }
  },
  {
    id: 'ad-copy',
    name: 'Ad Copy',
    description: '3 variants of compelling ad copy',
    botId: 'writebot',
    config: { type: 'ads', variants: 3 }
  },
  {
    id: 'product-desc',
    name: 'Product Description',
    description: 'Engaging product copy for e-commerce',
    botId: 'writebot',
    config: { type: 'product' }
  },
  // PixelBot Templates
  {
    id: 'hero-image',
    name: 'Hero Image',
    description: 'Website header/banner image',
    botId: 'pixelbot',
    config: { type: 'hero', size: '1920x1080' }
  },
  {
    id: 'social-set',
    name: 'Social Media Set',
    description: 'Images for Instagram, Twitter, LinkedIn',
    botId: 'pixelbot',
    config: { type: 'social', platforms: ['instagram', 'twitter', 'linkedin'] }
  },
  // KeyBot Templates
  {
    id: 'keyword-research',
    name: 'Keyword Research',
    description: 'Deep analysis of keyword opportunities',
    botId: 'keybot',
    config: { type: 'research', depth: 'comprehensive' }
  },
  {
    id: 'content-cluster',
    name: 'Content Cluster Map',
    description: 'Topic cluster strategy for SEO',
    botId: 'keybot',
    config: { type: 'cluster' }
  },
  // PressBot Templates
  {
    id: 'publish-post',
    name: 'Publish Post',
    description: 'Publish article to WordPress',
    botId: 'pressbot',
    config: { type: 'post' }
  },
  {
    id: 'schedule-post',
    name: 'Schedule Post',
    description: 'Schedule content for later',
    botId: 'pressbot',
    config: { type: 'schedule' }
  },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

export const botCardVariants = {
  idle: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const avatarFloatVariants = {
  idle: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  working: {
    y: [0, -12, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

export const particleVariants = {
  idle: {
    opacity: 0.3,
    scale: 0.8,
  },
  working: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 1,
      repeat: Infinity,
    }
  }
};

export const statusPulseVariants = {
  idle: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity }
  },
  working: {
    scale: [1, 1.3, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 0.8, repeat: Infinity }
  }
};

export const drawerVariants = {
  hidden: {
    y: '100%',
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};
