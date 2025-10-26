import React, { useState, useEffect, useRef } from 'react';

interface Activity {
  name: string;
  type: number;
  details?: string;
  state?: string;
  assets?: {
    largeImage?: string;
    large_image?: string;
    largeText?: string;
    large_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
}

interface PresenceData {
  activity: Activity | null;
  status: string;
  lastUpdated: Date | null;
}

export default function PresenceIndicator() {
  const [presence, setPresence] = useState<PresenceData>({
    activity: null,
    status: 'offline',
    lastUpdated: null
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

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
    <div className="bg-gradient-to-tl from-primary to-secondary p-4 flex flex-col rounded-lg border-1 border-accent shadow-2xl shadow-background h-full">
      <h2 className="text-center font-semibold text-4xl">
        Currently Doing
      </h2>
      <p className="text-center text-xl mb-1.5">
        Below are the activities I am currently doing.
      </p>
      <div className="w-full h-px bg-accent my-2"></div>
      
      {presence.activity ? (
        <div className="flex min-[450px]:flex-row flex-col gap-4 items-center px-1 select-none">
          <img 
            alt="" 
            className="max-w-28 max-h-28 rounded-lg" 
            src={presence.activity.assets?.largeImage || presence.activity.assets?.large_image} 
          />
          <div className="flex flex-col overflow-x-hidden w-full min-[450px]:text-left text-center">
            <h1 className="text-lg font-bold leading-7">
              {presence.activity.details || presence.activity.name}
            </h1>
            <p className="text-lg font-medium leading-6 text-nowrap truncate">
              {presence.activity.state}
            </p>
            <p className="text-lg font-medium leading-6 text-nowrap truncate">
              {presence.activity.assets?.largeText || presence.activity.assets?.large_text}
            </p>
            {presence.activity.timestamps && (
              <div className="flex flex-row gap-2 justify-between mt-1 items-center">
                <p className="whitespace-normal text-sm">
                  {presence.activity.timestamps.start ? 
                    new Date((Date.now() - new Date(presence.activity.timestamps.start).getTime())).toISOString().slice(14, 19) : 
                    '0:00'
                  }
                </p>
                <div className="w-full rounded-full h-2 bg-secondary overflow-x-hidden">
                  <div 
                    style={{ 
                      width: presence.activity.timestamps.start && presence.activity.timestamps.end ? 
                        `${((Date.now() - new Date(presence.activity.timestamps.start).getTime()) / (new Date(presence.activity.timestamps.end).getTime() - new Date(presence.activity.timestamps.start).getTime())) * 100}%` : 
                        '0%' 
                    }} 
                    className="h-2 rounded-full bg-white"
                  ></div>
                </div>
                <p className="whitespace-normal text-sm">
                  {presence.activity.timestamps.end ? 
                    new Date((new Date(presence.activity.timestamps.end).getTime() - new Date(presence.activity.timestamps.start).getTime())).toISOString().slice(14, 19) : 
                    '0:00'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">💤</div>
            <p className="text-xl text-gray-400">Offline</p>
          </div>
        </div>
      )}
    </div>
  );
}
