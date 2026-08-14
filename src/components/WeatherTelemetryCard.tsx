import React from 'react';

interface WeatherTelemetryCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  trend?: string;
  trendType?: 'neutral' | 'warning' | 'positive';
}

export const WeatherTelemetryCard: React.FC<WeatherTelemetryCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendType = 'neutral'
}) => {
  const getTrendColor = () => {
    switch (trendType) {
      case 'warning': return 'text-[#ff003c]';
      case 'positive': return 'text-[#00ff41]';
      default: return 'text-[#00f0ff]';
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 bg-[#0a1212] border-2 border-[#00f0ff]/30 relative group chamfered-card shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:border-[#a3e635] transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-6xl text-[#a3e635]">{icon}</span>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-1">
        <span className="material-symbols-outlined text-[#a3e635] text-sm">{icon}</span>
        <p className="text-gray-400 font-mono text-xs uppercase font-bold tracking-wider">{title}</p>
      </div>

      <div className="flex items-baseline gap-3 mt-1">
        <p className="text-white font-['Orbitron'] font-bold text-4xl">{value}</p>
        <p className="text-[#00f0ff] font-mono text-sm tracking-widest">{unit}</p>
      </div>

      {trend && (
        <p className={`font-mono text-xs flex items-center gap-1 mt-auto pt-3 border-t border-gray-800 tracking-widest ${getTrendColor()}`}>
          <span className="material-symbols-outlined text-sm">timeline</span> {trend}
        </p>
      )}
    </div>
  );
};
