import React, { useState, useEffect, useRef } from 'react';

export default function PresenceIndicator() {
  const [presence, setPresence] = useState({
    activity: null,
    status: 'offline',
    lastUpdated: null
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('wss://discord-presence-production.up.railway.app');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to presence server');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPresence(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from presence server');
      setIsConnected(false);
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
      }, 5000);
    };

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getStatusColor = () => {
    switch (presence.status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = () => {
    if (!presence.activity) return '💤';
    
    switch (presence.activity.type) {
      case 'coding': return '💻';
      case 'browsing': return '🌐';
      case 'listening to music': return '🎵';
      case 'chatting': return '💬';
      case 'designing': return '🎨';
      default: return '⚡';
    }
  };

  return (
    <div className="inline-flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700">
      {/* Status Indicator */}
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}>
          {presence.status === 'online' && (
            <span className={`absolute inset-0 rounded-full ${getStatusColor()} animate-ping opacity-75`}></span>
          )}
        </div>
      </div>

      {/* Activity Info */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{getActivityIcon()}</span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {presence.activity ? (
              <>Currently {presence.activity.type}</>
            ) : (
              <>Offline</>
            )}
          </span>
          {presence.activity && presence.activity.application && (
            <span className="text-xs text-slate-400">
              {presence.activity.application}
            </span>
          )}
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Reconnecting..."></div>
      )}
    </div>
  );
}
