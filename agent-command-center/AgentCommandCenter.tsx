import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Activity, Clock, CheckCircle, 
  AlertCircle, Zap, FileText, BarChart3
} from 'lucide-react';
import { BOTS, Bot, Task, BotStatus } from './types';
import { botCardVariants, staggerContainer, staggerItem } from './types';
import { BotAvatar } from './components/BotAvatar';
import { QuickTaskDrawer, BotDetailModal } from './components/TaskAssignment';

// ============================================================================
// BOT CARD COMPONENT
// ============================================================================

interface BotCardProps {
  bot: Bot;
  onClick: () => void;
  onQuickAssign: () => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const BotCard: React.FC<BotCardProps> = ({ 
  bot, 
  onClick, 
  onQuickAssign,
  isHovered,
  onHover,
  onLeave
}) => {
  const [currentBanter, setCurrentBanter] = useState(0);

  // Rotate through banter phrases when hovered
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentBanter((prev) => (prev + 1) % bot.personality.banter.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isHovered, bot.personality.banter.length]);

  const getStatusColor = (status: BotStatus) => {
    switch (status) {
      case 'idle': return '#10B981';
      case 'working': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'error': return '#EF4444';
      case 'offline': return '#6B7280';
      default: return '#10B981';
    }
  };

  const getStatusLabel = (status: BotStatus) => {
    switch (status) {
      case 'idle': return 'IDLE';
      case 'working': return 'WORKING';
      case 'completed': return 'DONE';
      case 'error': return 'ERROR';
      case 'offline': return 'OFFLINE';
      default: return 'IDLE';
    }
  };

  return (
    <motion.div
      className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 cursor-pointer overflow-hidden"
      variants={botCardVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      onClick={onClick}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${bot.color}15 0%, transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Status indicator ring */}
      <div className="absolute top-4 right-4">
        <motion.div
          className="px-2 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${getStatusColor(bot.status)}20`,
            color: getStatusColor(bot.status),
            border: `1px solid ${getStatusColor(bot.status)}40`,
          }}
          animate={{
            boxShadow: bot.status === 'working' 
              ? ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 8px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
              : 'none'
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {getStatusLabel(bot.status)}
        </motion.div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-0.5">{bot.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{bot.role}</p>
      </div>

      {/* Avatar */}
      <div className="flex justify-center py-4">
        <BotAvatar 
          bot={bot} 
          size="md" 
          isHovered={isHovered}
          isWorking={bot.status === 'working'}
        />
      </div>

      {/* Banter / Status message */}
      <div className="h-8 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={isHovered ? currentBanter : 'default'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-center"
            style={{ color: bot.color }}
          >
            {isHovered 
              ? bot.personality.banter[currentBanter]
              : bot.status === 'working' 
                ? bot.personality.workingPhrase
                : bot.status === 'completed'
                  ? bot.personality.completePhrase
                  : 'Ready for tasks'
            }
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {bot.stats.map((stat, i) => (
          <motion.div
            key={i}
            className="p-3 bg-gray-900/50 rounded-xl text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p 
              className="text-xl font-bold"
              style={{ color: bot.color }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Assign Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onQuickAssign();
        }}
        className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden group"
        style={{ backgroundColor: bot.color }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Button shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        
        <Zap className="w-4 h-4 relative z-10" />
        <span className="relative z-10">
          {bot.status === 'working' ? 'View Progress' : `Assign ${bot.role.split(' ')[0]} Task`}
        </span>
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// ACTIVITY LOG COMPONENT
// ============================================================================

const ActivityLog: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'writebot': return <FileText className="w-4 h-4" />;
      case 'pixelbot': return <Sparkles className="w-4 h-4" />;
      case 'keybot': return <BarChart3 className="w-4 h-4" />;
      case 'pressbot': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Activity Log</h3>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <motion.div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={`p-2 rounded-lg ${
                task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-700 text-gray-400'
              }`}>
                {task.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                 task.status === 'in-progress' ? <Clock className="w-4 h-4" /> :
                 task.status === 'failed' ? <AlertCircle className="w-4 h-4" /> :
                 getIcon(task.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.assignedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN AGENT COMMAND CENTER
// ============================================================================

const AgentCommandCenter: React.FC = () => {
  const [bots, setBots] = useState<Bot[]>(BOTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hoveredBot, setHoveredBot] = useState<string | null>(null);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [quickAssignBot, setQuickAssignBot] = useState<Bot | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Simulate bot status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBots(prev => prev.map(bot => {
        if (bot.status === 'working' && Math.random() > 0.7) {
          return { ...bot, status: 'completed' };
        }
        if (bot.status === 'completed' && Math.random() > 0.5) {
          return { ...bot, status: 'idle' };
        }
        return bot;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignTask = (botId: string, taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      type: taskData.type || 'custom',
      title: taskData.title || 'New Task',
      description: taskData.description,
      priority: taskData.priority || 'medium',
      status: 'in-progress',
      assignedAt: new Date(),
      ...taskData,
    };

    setTasks(prev => [newTask, ...prev]);
    
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { ...bot, status: 'working', currentTask: newTask }
        : bot
    ));
  };

  const onlineCount = bots.filter(b => b.status !== 'offline').length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Command Center</h1>
              <p className="text-gray-400">Manage your AI workforce</p>
            </div>
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">{onlineCount} Agents Online</span>
            </div>
            
            {bots.map(bot => (
              <div 
                key={bot.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full text-sm"
              >
                <span style={{ color: bot.color }}>{bot.icon}</span>
                <span className="text-gray-400">{bot.role.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Bot Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {bots.map((bot) => (
          <motion.div key={bot.id} variants={staggerItem}>
            <BotCard
              bot={bot}
              onClick={() => {
                setSelectedBot(bot);
                setShowDetailModal(true);
              }}
              onQuickAssign={() => setQuickAssignBot(bot)}
              isHovered={hoveredBot === bot.id}
              onHover={() => setHoveredBot(bot.id)}
              onLeave={() => setHoveredBot(null)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Log */}
      <ActivityLog tasks={tasks} />

      {/* Modals */}
      <QuickTaskDrawer
        bot={quickAssignBot || BOTS[0]}
        isOpen={!!quickAssignBot}
        onClose={() => setQuickAssignBot(null)}
        onAssignTask={(task) => {
          if (quickAssignBot) {
            handleAssignTask(quickAssignBot.id, task);
          }
        }}
      />

      <BotDetailModal
        bot={selectedBot || BOTS[0]}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBot(null);
        }}
        onAssignTask={(task) => {
          if (selectedBot) {
            handleAssignTask(selectedBot.id, task);
          }
        }}
        recentTasks={tasks.filter(t => 
          selectedBot && t.type === selectedBot.id
        )}
      />
    </div>
  );
};

export default AgentCommandCenter;
