import React from 'react';
import { Card, cn } from './ui';
import { motion } from 'framer-motion';

export const ChartCard = ({ title, subtitle, children, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={className}
        >
            <Card className="h-full flex flex-col overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                </div>
                <div className="flex-1 min-h-[250px] w-full relative">
                    {children}
                </div>
            </Card>
        </motion.div>
    );
};
