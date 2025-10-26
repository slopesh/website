import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
  activities: Activity[];
  status: string;
  lastUpdated: Date | null;
}

export default function PresenceIndicator() {
  const [presence, setPresence] = useState<PresenceData>({
    activities: [],
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
      try {
        const data = JSON.parse(event.data);
        console.log('Received presence data:', data);
        
        // Handle Aiden's exact data format
        if (data.activities && Array.isArray(data.activities)) {
          setPresence({
            activities: data.activities,
            status: data.status || 'offline',
            lastUpdated: new Date()
          });
        } else if (data.activity) {
          setPresence({
            activities: [data.activity],
            status: data.status || 'offline',
            lastUpdated: new Date()
          });
        } else {
          setPresence({
            activities: [],
            status: 'offline',
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        console.error('Error parsing presence data:', error);
      }
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
    if (!presence.activities.length) return '💤';
    
    switch (presence.activities[0].name) {
      case 'Spotify': return '🎵';
      case 'Visual Studio Code': return '💻';
      case 'Chrome': return '🌐';
      case 'Discord': return '💬';
      case 'Figma': return '🎨';
      default: return '⚡';
    }
  };

  // Debug logging
  console.log('Presence state:', presence);
  console.log('Activities count:', presence.activities.length);

  // Don't render if no activity
  if (!presence.activities.length) {
    console.log('No activities, hiding presence indicator');
    return null;
  }

  const activity = presence.activities[0];

  return (
    <motion.li
      className="min-[940px]:col-span-1 col-span-2"
      initial={{ transform: 'translateY(30px)', opacity: 0 }}
      whileInView={{ transform: 'translateY(0px)', opacity: 100 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.39, 0.21, 0.12, 0.96], }}
      viewport={{ amount: 0.1, once: true }}
    >
      <div className="bg-gradient-to-tl from-primary to-secondary p-4 flex flex-col rounded-lg border-1 border-accent shadow-2xl shadow-background h-full">
        <h2 className="text-center font-semibold text-4xl">
          Currently Doing
        </h2>
        <p className="text-center text-xl mb-1.5">
          Below are the activities I am currently doing.
        </p>
        <div className="w-full h-px bg-accent my-2"></div>
        
        <div className="flex min-[450px]:flex-row flex-col gap-4 items-center px-1 select-none">
          <img 
            alt="" 
            className="max-w-28 max-h-28 rounded-lg" 
            src={activity.assets?.largeImage || activity.assets?.large_image} 
          />
          <div className="flex flex-col overflow-x-hidden w-full min-[450px]:text-left text-center">
            <h1 className="text-lg font-bold leading-7">
              {activity.details || activity.name}
            </h1>
            <p className="text-lg font-medium leading-6 text-nowrap truncate">
              {activity.state}
            </p>
            <p className="text-lg font-medium leading-6 text-nowrap truncate">
              {activity.assets?.largeText || activity.assets?.large_text}
            </p>
            {activity.timestamps && (
              <div className="flex flex-row gap-2 justify-between mt-1 items-center">
                <p className="whitespace-normal text-sm">
                  {activity.timestamps.start ? 
                    new Date((Date.now() - new Date(activity.timestamps.start).getTime())).toISOString().slice(14, 19) : 
                    '0:00'
                  }
                </p>
                <div className="w-full rounded-full h-2 bg-secondary overflow-x-hidden">
                  <div 
                    style={{ 
                      width: activity.timestamps.start && activity.timestamps.end ? 
                        `${((Date.now() - new Date(activity.timestamps.start).getTime()) / (new Date(activity.timestamps.end).getTime() - new Date(activity.timestamps.start).getTime())) * 100}%` : 
                        '0%' 
                    }} 
                    className="h-2 rounded-full bg-white"
                  ></div>
                </div>
                <p className="whitespace-normal text-sm">
                  {activity.timestamps.end && activity.timestamps.start ? 
                    new Date((new Date(activity.timestamps.end).getTime() - new Date(activity.timestamps.start).getTime())).toISOString().slice(14, 19) : 
                    '0:00'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}
