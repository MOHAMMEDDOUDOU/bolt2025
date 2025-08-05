import React, { useState } from 'react';
import { 
  Globe, 
  Code, 
  Image, 
  Palette, 
  Bot,
  Folder,
  Settings,
  Calculator,
  Music,
  Video,
  FileText,
  Terminal as TerminalIcon,
  Calendar,
  Mail,
  Camera,
  Gamepad2
} from 'lucide-react';

interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  component?: React.ComponentType<any>;
  color: string;
}

interface DesktopProps {
  onOpenApp: (appId: string) => void;
  openApps: string[];
}

const Desktop: React.FC<DesktopProps> = ({ onOpenApp, openApps }) => {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps: App[] = [
    {
      id: 'browser',
      name: 'المتصفح',
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      id: 'code-editor',
      name: 'محرر الكود',
      icon: <Code className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      id: 'ai-assistant',
      name: 'مساعد الذكاء الاصطناعي',
      icon: <Bot className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      id: 'image-viewer',
      name: 'عارض الصور',
      icon: <Image className="w-8 h-8" />,
      color: 'bg-pink-500'
    },
    {
      id: 'color-picker',
      name: 'منتقي الألوان',
      icon: <Palette className="w-8 h-8" />,
      color: 'bg-orange-500'
    },
    {
      id: 'file-manager',
      name: 'مدير الملفات',
      icon: <Folder className="w-8 h-8" />,
      color: 'bg-yellow-500'
    },
    {
      id: 'terminal',
      name: 'الطرفية',
      icon: <TerminalIcon className="w-8 h-8" />,
      color: 'bg-gray-800'
    },
    {
      id: 'calculator',
      name: 'الآلة الحاسبة',
      icon: <Calculator className="w-8 h-8" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'music-player',
      name: 'مشغل الموسيقى',
      icon: <Music className="w-8 h-8" />,
      color: 'bg-red-500'
    },
    {
      id: 'video-player',
      name: 'مشغل الفيديو',
      icon: <Video className="w-8 h-8" />,
      color: 'bg-cyan-500'
    },
    {
      id: 'text-editor',
      name: 'محرر النصوص',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-teal-500'
    },
    {
      id: 'calendar',
      name: 'التقويم',
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-emerald-500'
    },
    {
      id: 'mail',
      name: 'البريد الإلكتروني',
      icon: <Mail className="w-8 h-8" />,
      color: 'bg-blue-600'
    },
    {
      id: 'camera',
      name: 'الكاميرا',
      icon: <Camera className="w-8 h-8" />,
      color: 'bg-gray-600'
    },
    {
      id: 'games',
      name: 'الألعاب',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'bg-violet-500'
    },
    {
      id: 'settings',
      name: 'الإعدادات',
      icon: <Settings className="w-8 h-8" />,
      color: 'bg-slate-500'
    }
  ];

  return (
    <div 
      className="h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white bg-opacity-5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white bg-opacity-5 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* شبكة الأيقونات */}
      <div className="relative z-10 p-8 h-full">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 h-full content-start">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => onOpenApp(app.id)}
            >
              <div 
                className={`
                  ${app.color} p-4 rounded-2xl shadow-lg transform transition-all duration-200 
                  group-hover:scale-110 group-hover:shadow-2xl group-active:scale-95
                  ${openApps.includes(app.id) ? 'ring-4 ring-white ring-opacity-50' : ''}
                  backdrop-blur-sm bg-opacity-90
                `}
              >
                <div className="text-white">
                  {app.icon}
                </div>
              </div>
              <span className="text-white text-sm mt-2 text-center font-medium drop-shadow-lg">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* شريط المهام */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="flex items-center justify-between px-6 py-3">
          {/* قائمة ابدأ */}
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
              </div>
            </button>
            
            {/* التطبيقات المفتوحة */}
            <div className="flex gap-2">
              {openApps.map((appId) => {
                const app = apps.find(a => a.id === appId);
                if (!app) return null;
                
                return (
                  <button
                    key={appId}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg flex items-center gap-2 transition-all"
                    onClick={() => onOpenApp(appId)}
                  >
                    <div className={`${app.color} p-1 rounded`}>
                      <div className="text-white scale-75">
                        {app.icon}
                      </div>
                    </div>
                    <span className="text-white text-sm">{app.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* منطقة الإشعارات والوقت */}
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">متصل</span>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium">
                {time.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="text-xs opacity-75">
                {time.toLocaleDateString('ar-SA', { 
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;