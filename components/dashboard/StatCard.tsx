import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconColor?: string;
  link?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  iconColor,
  link,
  variant = 'default'
}: StatCardProps) {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('fr-FR')
    : value;

  const variantColors = {
    default: 'bg-emerald-50 text-emerald-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  const iconBgColor = iconColor || variantColors[variant];

  const content = (
    <div className={`bg-white rounded-shamar-lg border border-gray-200 shadow-shamar-soft p-6 hover:shadow-shamar-medium hover:border-primary-200 transition-all duration-200 group ${link ? 'cursor-pointer' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          {icon}
        </div>
        {change && trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
            {trend === 'up' && <TrendingUp size={16} />}
            {trend === 'down' && <TrendingDown size={16} />}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{formattedValue}</p>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block">
        {content}
      </a>
    );
  }

  return content;
}
