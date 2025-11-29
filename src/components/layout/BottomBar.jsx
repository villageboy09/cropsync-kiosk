import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Wifi, CloudSun } from 'lucide-react';

const BottomBar = () => {
    const [time, setTime] = useState(new Date());
    const { language } = useSelector((state) => state.ui);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString(language === 'te' ? 'te-IN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <footer className="h-12 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between text-sm text-muted-foreground z-50">
            <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">{formatTime(time)}</span>
                <span className="hidden sm:inline text-muted-foreground/50">|</span>
                <span className="hidden sm:inline">{formatDate(time)}</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <CloudSun className="h-4 w-4" />
                    <span>28°C Sunny</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span>Online</span>
                </div>
            </div>
        </footer>
    );
};

export default BottomBar;
