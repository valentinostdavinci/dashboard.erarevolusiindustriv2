import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { Canvas } from '@react-three/fiber';
import { FinanceVisualization } from './FinanceVisualization';
import { FinanceDetailsPanel } from './FinanceDetailsPanel';
import { useState } from 'react';

interface DataPoint {
  month: string;
  moneyIn: number;
  moneyOut: number;
  profit: number;
}

const mockData: DataPoint[] = [
  { month: 'Jan', moneyIn: 150000, moneyOut: 80000, profit: 70000 },
  { month: 'Feb', moneyIn: 180000, moneyOut: 95000, profit: 85000 },
  { month: 'Mar', moneyIn: 220000, moneyOut: 110000, profit: 110000 },
  { month: 'Apr', moneyIn: 190000, moneyOut: 100000, profit: 90000 },
  { month: 'May', moneyIn: 250000, moneyOut: 120000, profit: 130000 },
  { month: 'Jun', moneyIn: 280000, moneyOut: 140000, profit: 140000 },
];

const StatItem = ({ color, label, value, onClick }: { color: string; label: string; value: number; onClick?: () => void }) => (
  <motion.div 
    className="flex items-center space-x-2 cursor-pointer"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`w-2 h-2 rounded-sm`} style={{ backgroundColor: color }} />
    <div className="text-white text-xs font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{label}</div>
    <div className="text-white/90 ml-auto text-xs font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
      ${(value / 1000).toFixed(0)}k
    </div>
  </motion.div>
);

export function FinanceOverlay() {
  const { selectedUnit, setSelectedUnit } = useDashboardStore();
  const [detailsType, setDetailsType] = useState<'moneyIn' | 'moneyOut' | null>(null);
  const totalBalance = mockData.reduce((sum, d) => sum + d.profit, 0);
  const isVisible = selectedUnit === 'finance';

  const handleClose = () => setSelectedUnit(null);
  const handleDetailsClose = () => setDetailsType(null);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-6 top-6 w-[280px] z-50"
          >
            <motion.div 
              className="relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={handleClose}
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
                  Financial Overview
                </motion.h2>
                <motion.div 
                  className="text-xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  ${(totalBalance / 1000).toFixed(0)}k
                  <span className="text-[10px] text-white/80 ml-2 font-medium">Total Balance</span>
                </motion.div>
              </motion.div>

              <div className="h-[200px] relative mb-3">
                <Canvas
                  camera={{ position: [0, 4, 10], fov: 45 }}
                  gl={{ alpha: true, antialias: true }}
                >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <FinanceVisualization />
                </Canvas>
              </div>

              <motion.div 
                className="space-y-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <StatItem 
                  color="#4488ff" 
                  label="Money In" 
                  value={mockData.reduce((sum, d) => sum + d.moneyIn, 0)}
                  onClick={() => setDetailsType('moneyIn')}
                />
                <StatItem 
                  color="#ff4444" 
                  label="Money Out" 
                  value={mockData.reduce((sum, d) => sum + d.moneyOut, 0)}
                  onClick={() => setDetailsType('moneyOut')}
                />
                <StatItem 
                  color="#44ff88" 
                  label="Profit" 
                  value={mockData.reduce((sum, d) => sum + d.profit, 0)}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FinanceDetailsPanel
        type={detailsType || 'moneyOut'}
        isVisible={detailsType !== null}
        onClose={handleDetailsClose}
      />
    </>
  );
}