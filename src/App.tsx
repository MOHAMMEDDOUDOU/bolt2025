import React, { useState } from 'react';
import { Globe, Code, Palette, Image, Bot, Terminal as TerminalIcon } from 'lucide-react';
import BrowserPreview from './components/BrowserPreview';
import CodeEditor from './components/CodeEditor';
import ColorPickerApp from './components/apps/ColorPickerApp';
import ImageViewerApp from './components/apps/ImageViewerApp';
import AIAssistantApp from './components/apps/AIAssistantApp';
import Terminal from './components/Terminal';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
}

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

function App() {
  const [activeTab, setActiveTab] = useState('browser');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileNode>({
    id: 'index',
    name: 'index.html',
    type: 'file',
    content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في بيئة التطوير</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
            text-align: center;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: fadeInUp 1s ease-out;
        }
        p {
            font-size: 1.3rem;
            line-height: 1.8;
            margin-bottom: 2rem;
            animation: fadeInUp 1s ease-out 0.2s both;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        .feature {
            background: rgba(255,255,255,0.15);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeInUp 1s ease-out 0.4s both;
        }
        .feature:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #FFD700;
        }
        .cta-button {
            display: inline-block;
            margin-top: 30px;
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            border-radius: 30px;
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
            animation: fadeInUp 1s ease-out 0.6s both;
        }
        .cta-button:hover {
            background: white;
            color: #667eea;
            transform: scale(1.05);
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .code-snippet {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            text-align: left;
            margin: 20px 0;
            border-left: 4px solid #FFD700;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 بيئة تطوير المواقع المتكاملة</h1>
        <p>مرحباً بك في بيئة التطوير الأكثر تطوراً لإنشاء مواقع الويب الحديثة</p>
        
        <div class="features">
            <div class="feature">
                <h3>🌐 متصفح مدمج</h3>
                <p>معاينة مباشرة لمشروعك مع أدوات تطوير متقدمة</p>
            </div>
            <div class="feature">
                <h3>💻 محرر كود ذكي</h3>
                <p>محرر نصوص متقدم مع تمييز الأكواد والإكمال التلقائي</p>
            </div>
            <div class="feature">
                <h3>🎨 أدوات التصميم</h3>
                <p>منتقي ألوان متقدم وأدوات تصميم احترافية</p>
            </div>
            <div class="feature">
                <h3>🖼️ إدارة الوسائط</h3>
                <p>عارض ومحرر الصور مع أدوات التحسين</p>
            </div>
            <div class="feature">
                <h3>🤖 مساعد ذكي</h3>
                <p>مساعد ذكاء اصطناعي لكتابة وتحسين الكود</p>
            </div>
            <div class="feature">
                <h3>⚡ أداء عالي</h3>
                <p>بيئة سريعة ومتجاوبة مع أحدث التقنيات</p>
            </div>
        </div>

        <div class="code-snippet">
            <div style="color: #FFD700;">// مثال على الكود</div>
            <div style="color: #98FB98;">function createAwesomeWebsite() {</div>
            <div style="color: #87CEEB;">&nbsp;&nbsp;return "موقع رائع مع هذه البيئة!";</div>
            <div style="color: #98FB98;">}</div>
        </div>

        <a href="#" class="cta-button" onclick="alert('ابدأ بإنشاء مشروعك الجديد!')">ابدأ الآن</a>
    </div>

    <script>
        // تأثيرات تفاعلية
        document.addEventListener('mousemove', function(e) {
            const cursor = document.createElement('div');
            cursor.style.position = 'fixed';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.width = '4px';
            cursor.style.height = '4px';
            cursor.style.background = 'rgba(255,255,255,0.6)';
            cursor.style.borderRadius = '50%';
            cursor.style.pointerEvents = 'none';
            cursor.style.zIndex = '9999';
            document.body.appendChild(cursor);
            
            setTimeout(() => {
                cursor.remove();
            }, 1000);
        });

        console.log('🎉 مرحباً بك في بيئة التطوير المتكاملة!');
    </script>
</body>
</html>`
  });

  const handleSave = (fileId: string, content: string) => {
    setCurrentFile(prev => ({ ...prev, content }));
    console.log('تم حفظ الملف:', fileId);
  };

  const handlePreview = () => {
    setActiveTab('browser');
  };

  const tabs: Tab[] = [
    {
      id: 'browser',
      name: 'المتصفح',
      icon: <Globe className="w-4 h-4" />,
      component: (
        <BrowserPreview 
          htmlContent={currentFile.content || ''}
          isFullscreen={false}
          onToggleFullscreen={() => {}}
        />
      )
    },
    {
      id: 'ai-assistant',
      name: 'بيئة التطوير الذكية',
      icon: <Bot className="w-4 h-4" />,
      component: (
        <AIAssistantApp 
          currentFile={currentFile}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      )
    },
    {
      id: 'color-picker',
      name: 'نظام الألوان',
      icon: <Palette className="w-4 h-4" />,
      component: <ColorPickerApp />
    },
    {
      id: 'image-viewer',
      name: 'نظام الصور',
      icon: <Image className="w-4 h-4" />,
      component: <ImageViewerApp />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* شريط التبويبات العلوي */}
      <div className="bg-gray-800 border-b border-gray-700 flex items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }
              `}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* أزرار إضافية */}
        <div className="flex-1 flex justify-end items-center px-4 gap-2">
          <button
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className={`
              flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors
              ${isTerminalVisible 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </button>
        </div>
      </div>

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 relative">
        {activeTabData && (
          <div className="h-full">
            {activeTabData.component}
          </div>
        )}
      </div>

      {/* Terminal المنبثق */}
      <Terminal 
        isVisible={isTerminalVisible} 
        onClose={() => setIsTerminalVisible(false)} 
      />
    </div>
  );
}

export default App;