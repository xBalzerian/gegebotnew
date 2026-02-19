import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Clock, CheckCircle, AlertCircle,
  ChevronRight, FileText, Zap, BarChart3,
  ArrowRight, Loader2, Plus
} from 'lucide-react';
import { Bot, Task, TaskTemplate, TASK_TEMPLATES } from '../types';
import { drawerVariants, staggerContainer, staggerItem, modalVariants } from '../types';
import BotAvatar from './BotAvatar';

// ============================================================================
// QUICK TASK DRAWER - Slide-up panel for one-click task assignment
// ============================================================================

interface QuickTaskDrawerProps {
  bot: Bot;
  isOpen: boolean;
  onClose: () => void;
  onAssignTask: (task: Partial<Task>) => void;
}

export const QuickTaskDrawer: React.FC<QuickTaskDrawerProps> = ({ 
  bot, 
  isOpen, 
  onClose, 
  onAssignTask 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customTask, setCustomTask] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const botTemplates = TASK_TEMPLATES.filter(t => t.botId === bot.id);

  const handleQuickAssign = (template: TaskTemplate) => {
    onAssignTask({
      type: 'template',
      title: template.name,
      description: template.description,
      priority: 'medium',
      status: 'pending',
    });
    onClose();
  };

  const handleCustomAssign = () => {
    if (customTask.trim()) {
      onAssignTask({
        type: 'custom',
        title: customTask,
        priority: 'medium',
        status: 'pending',
      });
      setCustomTask('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <BotAvatar bot={bot} size="sm" />
                <div>
                  <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                  <p className="text-gray-400">{bot.personality.greeting}</p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Quick Tasks Grid */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Quick Tasks
                </h4>
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {botTemplates.map((template) => (
                    <motion.button
                      key={template.id}
                      variants={staggerItem}
                      onClick={() => handleQuickAssign(template)}
                      className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-all group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles 
                          className="w-4 h-4 transition-colors"
                          style={{ color: bot.color }}
                        />
                        <span className="font-semibold text-white group-hover:text-gray-200">
                          {template.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Custom Task */}
              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Custom Task
                </h4>
                
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-xl text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Describe what you need...
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <textarea
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                      placeholder={`Tell ${bot.name} what you need...`}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-gray-500"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => setShowCustomInput(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        onClick={handleCustomAssign}
                        disabled={!customTask.trim()}
                        className="flex-1 px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ backgroundColor: bot.color }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Zap className="w-4 h-4" />
                        Assign Task
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// BOT DETAIL MODAL - Full information when clicking a bot
// ============================================================================

interface BotDetailModalProps {
  bot: Bot;
  isOpen: boolean;
  onClose: () => void;
  onAssignTask: (task: Partial<Task>) => void;
  recentTasks: Task[];
}

export const BotDetailModal: React.FC<BotDetailModalProps> = ({
  bot,
  isOpen,
  onClose,
  onAssignTask,
  recentTasks
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-gray-900 rounded-2xl z-50 overflow-hidden flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header with gradient */}
            <div 
              className="relative p-6 pb-8"
              style={{ 
                background: `linear-gradient(135deg, ${bot.color}20 0%, transparent 60%)` 
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="flex items-center gap-6">
                <BotAvatar bot={bot} size="lg" isHovered={true} />
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-white">{bot.name}</h2>
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${bot.color}30`,
                        color: bot.color
                      }}
                    >
                      {bot.status === 'working' ? 'Working' : 'Online'}
                    </span>
                  </div>
                  <p className="text-lg text-gray-300 mb-2">{bot.role}</p>
                  <p className="text-gray-400 max-w-md">{bot.description}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 px-6">
              {(['overview', 'history', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'text-white border-white' 
                      : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* What I Can Do */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">What I Can Do For You</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Write blog posts & articles',
                        'Create ad copy & marketing',
                        'Draft emails & newsletters',
                        'Product descriptions',
                        'Social media content',
                        'SEO-optimized content',
                      ].map((capability, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-2 text-gray-300"
                        >
                          <CheckCircle 
                            className="w-4 h-4 flex-shrink-0" 
                            style={{ color: bot.color }}
                          />
                          {capability}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {bot.stats.map((stat, i) => (
                        <div 
                          key={i}
                          className="p-4 bg-gray-800 rounded-xl"
                        >
                          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                          <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{ 
                      backgroundColor: `${bot.color}10`,
                      borderColor: `${bot.color}30`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles 
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: bot.color }}
                      />
                      <div>
                        <p className="font-medium text-white mb-1">Pro Tip</p>
                        <p className="text-gray-400 text-sm">
                          Give me specific details about your audience for best results! 
                          The more context you provide, the better I can tailor the content.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  
                  {recentTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No tasks yet. Assign your first task! 🚀</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentTasks.map((task) => (
                        <div 
                          key={task.id}
                          className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl"
                        >
                          {getStatusIcon(task.status)}
                          
                          <div className="flex-1">
                            <p className="font-medium text-white">{task.title}</p>
                            <p className="text-sm text-gray-500">
                              {task.assignedAt.toLocaleString()}
                            </p>
                          </div>
                          
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Bot Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Notifications</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                      </label>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Auto-assign similar tasks</span>
                        <input type="checkbox" className="w-5 h-5 rounded" />
                      </label>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-xl">
                      <label className="block text-gray-300 mb-2">Default Priority</label>
                      <select className="w-full p-2 bg-gray-700 rounded-lg text-white">
                        <option>Low</option>
                        <option selected>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 flex gap-3">
              <motion.button
                onClick={() => {
                  onAssignTask({ type: 'quick', title: 'New Task', priority: 'medium', status: 'pending' });
                  onClose();
                }}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: bot.color }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                Assign New Task
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default { QuickTaskDrawer, BotDetailModal };
