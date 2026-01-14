import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  iconColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  iconColor = 'bg-emerald-50 text-emerald-600'
}: StatCardProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('fr-FR')
    : value;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon size={24} />
        </div>
        {change && trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' && <TrendingUp size={16} />}
            {trend === 'down' && <TrendingDown size={16} />}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
    </div>
  );
}
