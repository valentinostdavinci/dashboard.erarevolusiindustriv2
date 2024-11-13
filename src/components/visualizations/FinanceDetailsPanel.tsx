import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ExpenseItem {
  name: string;
  amount: number;
  description?: string;
  color?: string;
}

interface FinanceDetailsPanelProps {
  type: 'moneyIn' | 'moneyOut';
  isVisible: boolean;
  onClose: () => void;
}

const expenses: ExpenseItem[] = [
  { name: 'Bolt.new', amount: 49, description: 'Development platform subscription', color: '#4488ff' },
  { name: 'ChatGPT', amount: 20, description: 'AI assistant subscription', color: '#44aa88' },
  { name: 'Vercel', amount: 20, description: 'Hosting and deployment', color: '#000000' },
  { name: 'Formless', amount: 15, description: 'Form management service', color: '#ff4488' },
  { name: 'Notion', amount: 15, description: 'Team collaboration platform', color: '#000000' },
  { name: 'Zapier', amount: 30, description: 'Automation service', color: '#ff8844' },
];

const income: ExpenseItem[] = [
  { name: 'Product Sales', amount: 850, description: 'Direct product revenue', color: '#44ff88' },
  { name: 'Consulting', amount: 300, description: 'Technical consulting services', color: '#4488ff' },
  { name: 'Subscriptions', amount: 120, description: 'Monthly subscriber revenue', color: '#44aaff' },
];

export function FinanceDetailsPanel({ type, isVisible, onClose }: FinanceDetailsPanelProps) {
  const items = type === 'moneyIn' ? income : expenses;
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed right-6 top-6 w-[280px] z-50"
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-colors z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                boxShadow: '0 0 20px rgba(68, 255, 136, 0.1)',
                border: '1px solid rgba(68, 255, 136, 0.2)'
              }}
            >
              <X size={12} />
            </motion.button>

            <motion.div 
              className="mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h2 
                className="text-[#44ff88] text-sm font-bold mb-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ textShadow: '0 0 20px rgba(68, 255, 136, 0.5)' }}
              >
                {type === 'moneyIn' ? 'Revenue Sources' : 'Monthly Expenses'}
              </motion.h2>
              <motion.div 
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                ${total}k
                <span className="text-[10px] text-white/80 ml-2 font-medium">Total {type === 'moneyIn' ? 'Revenue' : 'Expenses'}</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="bg-white/5 backdrop-blur-md rounded-lg p-3"
                  style={{ 
                    boxShadow: `0 0 20px rgba(${item.color ? parseInt(item.color.slice(1,3),16) : 68}, ${item.color ? parseInt(item.color.slice(3,5),16) : 255}, ${item.color ? parseInt(item.color.slice(5,7),16) : 136}, 0.1)`,
                    border: `1px solid rgba(${item.color ? parseInt(item.color.slice(1,3),16) : 68}, ${item.color ? parseInt(item.color.slice(3,5),16) : 255}, ${item.color ? parseInt(item.color.slice(5,7),16) : 136}, 0.2)`
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{item.name}</span>
                    <span className="text-white/90 text-sm">${item.amount}k</span>
                  </div>
                  {item.description && (
                    <p className="text-white/60 text-xs">{item.description}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}