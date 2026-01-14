import React from 'react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  userInitials?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  emptyMessage?: string;
}

export default function ActivityFeed({ activities, emptyMessage = 'Aucune activité récente' }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h3>
        <p className="text-sm text-gray-500 text-center py-8">{emptyMessage}</p>
      </div>
    );
  }

  const getInitials = (text: string): string => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-gray-600">
                {activity.userInitials || getInitials(activity.title)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
