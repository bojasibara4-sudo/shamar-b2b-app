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
      <div className="bg-white rounded-shamar-lg border border-gray-200 shadow-shamar-soft p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h3>
        <p className="text-sm text-gray-500 text-center py-8 font-medium">{emptyMessage}</p>
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
    <div className="bg-white rounded-shamar-lg border border-gray-200 shadow-shamar-soft p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary-500 rounded-full block" />
        Activité récente
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0 group">
            <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0 text-primary-600">
              <span className="text-xs font-bold">
                {activity.userInitials || getInitials(activity.title)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 transition-colors">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
