import React, { useState } from 'react';
import { Bot, Send, Sparkles, Code, Lightbulb, MessageCircle, Folder, FolderOpen, File, FileText, Image, Settings, Plus, Play, Save, Terminal as TerminalIcon, X } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import FileExplorer from '../FileExplorer';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface AIAssistantAppProps {
  currentFile: FileNode;
  onSave: (fileId: string, content: string) => void;
  onPreview: () => void;
}

const AIAssistantApp: React.FC<AIAssistantAppProps> = ({ currentFile, onSave, onPreview }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai' as const,
      content: 'مرحباً! أنا مساعدك الذكي في البرمجة. يمكنني مساعدتك في كتابة الكود وتطوير مشروعك. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [terminalCommands, setTerminalCommands] = useState<Array<{type: 'input' | 'output', content: string}>>([
    { type: 'output', content: 'مرحباً بك في Terminal المدمج' },
    { type: 'output', content: 'اكتب "help" لعرض الأوامر المتاحة' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [selectedFileId, setSelectedFileId] = useState(currentFile.id);

  // ملفات المشروع التجريبية
  const [projectFiles, setProjectFiles] = useState<FileNode[]>([
    {
      id: 'root',
      name: 'مشروعي',
      type: 'folder',
      children: [
        {
          id: 'index-html',
          name: 'index.html',
          type: 'file',
          content: currentFile.content
        },
        {
          id: 'style-css',
          name: 'style.css',
          type: 'file',
          content: `/* ملف CSS للمشروع */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* إضافة المزيد من الأنماط هنا */`
        },
        {
          id: 'script-js',
          name: 'script.js',
          type: 'file',
          content: `// ملف JavaScript للمشروع
console.log('مرحباً من JavaScript!');

// دالة مثال
function initApp() {
    console.log('تم تحميل التطبيق بنجاح!');
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);`
        },
        {
          id: 'assets',
          name: 'assets',
          type: 'folder',
          children: [
            {
              id: 'images',
              name: 'images',
              type: 'folder',
              children: []
            },
            {
              id: 'fonts',
              name: 'fonts',
              type: 'folder',
              children: []
            }
          ]
        }
      ]
    }
  ]);

  const quickActions = [
    { icon: <Code className="w-4 h-4" />, text: 'اكتب كود HTML', action: 'html' },
    { icon: <Sparkles className="w-4 h-4" />, text: 'أنشئ CSS جميل', action: 'css' },
    { icon: <Lightbulb className="w-4 h-4" />, text: 'اقترح فكرة مشروع', action: 'idea' },
    { icon: <MessageCircle className="w-4 h-4" />, text: 'اشرح مفهوم برمجي', action: 'explain' }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // محاكاة رد الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('html')) {
      return `إليك مثال على كود HTML بسيط:

\`\`\`html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>صفحتي</title>
</head>
<body>
    <h1>مرحباً بالعالم!</h1>
    <p>هذه أول صفحة لي</p>
</body>
</html>
\`\`\`

هل تريد شرح أي جزء من هذا الكود؟`;
    }
    
    if (lowerInput.includes('css')) {
      return `إليك بعض أنماط CSS جميلة:

\`\`\`css
.beautiful-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    color: white;
    transition: transform 0.3s ease;
}

.beautiful-card:hover {
    transform: translateY(-5px);
}
\`\`\`

هذا سيعطيك بطاقة جميلة مع تدرج لوني وتأثير حركي!`;
    }
    
    if (lowerInput.includes('مشروع') || lowerInput.includes('فكرة')) {
      return `إليك بعض أفكار المشاريع الرائعة:

🌟 **موقع شخصي**: اعرض أعمالك ومهاراتك
🛒 **متجر إلكتروني**: بيع المنتجات أونلاين  
📝 **تطبيق مهام**: نظم حياتك اليومية
🎮 **لعبة بسيطة**: مثل لعبة الذاكرة أو الثعبان
📊 **لوحة تحكم**: عرض البيانات بشكل جميل

أي فكرة تعجبك أكثر؟`;
    }
    
    return `شكراً لسؤالك! أنا هنا لمساعدتك في:

• كتابة وتطوير الكود
• شرح المفاهيم البرمجية  
• اقتراح حلول للمشاكل
• مراجعة وتحسين الكود
• إعطاء أفكار للمشاريع

ما الذي تحتاج مساعدة فيه تحديداً؟`;
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      html: 'اكتب لي كود HTML لصفحة ويب بسيطة',
      css: 'أنشئ لي أنماط CSS جميلة لبطاقة',
      idea: 'اقترح علي فكرة مشروع ويب مبتكرة',
      explain: 'اشرح لي مفهوم الـ Flexbox في CSS'
    };
    
    setInputMessage(actionMessages[action as keyof typeof actionMessages] || '');
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFileId(file.id);
  };

  const handleFileCreate = (parentId: string, name: string, type: 'file' | 'folder') => {
    // منطق إنشاء ملف جديد
    console.log('إنشاء', type, name, 'في', parentId);
  };

  const executeTerminalCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setTerminalCommands(prev => [...prev, { type: 'input', content: `$ ${cmd}` }]);

    let output = '';
    
    switch (trimmedCmd) {
      case 'help':
        output = `الأوامر المتاحة:
  help          - عرض هذه الرسالة
  clear         - مسح الشاشة
  ls            - عرض الملفات
  npm install   - تثبيت الحزم
  npm start     - تشغيل المشروع`;
        break;
        
      case 'clear':
        setTerminalCommands([]);
        return;
        
      case 'ls':
        output = `index.html    style.css    script.js    assets/`;
        break;
        
      case 'npm install':
        output = `جاري تثبيت الحزم...
✓ react@18.2.0
✓ typescript@4.9.5
تم تثبيت الحزم بنجاح!`;
        break;
        
      case 'npm start':
        output = `> dev-server@1.0.0 start
> vite

  Local:   http://localhost:3000/
  جاهز في 1.2 ثانية`;
        break;
        
      default:
        output = `الأمر غير موجود: ${cmd}
اكتب "help" لعرض الأوامر المتاحة`;
    }
    
    setTerminalCommands(prev => [...prev, { type: 'output', content: output }]);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        executeTerminalCommand(currentCommand);
      }
      setCurrentCommand('');
    }
  };

  const getCurrentFile = () => {
    const findFile = (files: FileNode[]): FileNode | null => {
      for (const file of files) {
        if (file.id === selectedFileId) return file;
        if (file.children) {
          const found = findFile(file.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findFile(projectFiles) || currentFile;
  };

  return (
    <div className="h-full flex bg-gray-900 text-white">
      {/* مستكشف الملفات - اليسار */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <FileExplorer
          files={projectFiles}
          onFileSelect={handleFileSelect}
          onFileCreate={handleFileCreate}
          selectedFileId={selectedFileId}
        />
      </div>

      {/* منطقة الكود الرئيسية - الوسط */}
      <div className="flex-1 flex flex-col">
        {/* محرر الكود */}
        <div className={`${isTerminalVisible ? 'h-2/3' : 'h-full'} transition-all duration-300`}>
          <CodeEditor
            file={getCurrentFile()}
            onSave={onSave}
            onPreview={onPreview}
          />
        </div>

        {/* Terminal - الأسفل */}
        {isTerminalVisible && (
          <div className="h-1/3 bg-gray-900 border-t border-gray-700">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-white text-sm">Terminal</span>
              </div>
              <button 
                onClick={() => setIsTerminalVisible(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="h-full overflow-y-auto p-4 space-y-1 font-mono text-sm">
              {terminalCommands.map((cmd, index) => (
                <div key={index} className={cmd.type === 'input' ? 'text-white' : 'text-green-400'}>
                  <pre className="whitespace-pre-wrap">{cmd.content}</pre>
                </div>
              ))}
              
              <div className="flex items-center gap-2 text-white">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  className="flex-1 bg-transparent outline-none text-white"
                  placeholder="اكتب أمراً..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* الدردشة مع المساعد الذكي - اليمين */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* رأس الدردشة */}
        <div className="bg-gray-700 border-b border-gray-600 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-full">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">المساعد الذكي</h3>
              <p className="text-xs text-gray-300">مساعدك في البرمجة</p>
            </div>
          </div>
        </div>

        {/* الإجراءات السريعة */}
        <div className="p-3 bg-gray-750 border-b border-gray-600">
          <p className="text-xs text-gray-400 mb-2">إجراءات سريعة:</p>
          <div className="grid grid-cols-2 gap-1">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
              >
                {action.icon}
                <span className="truncate">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* منطقة الرسائل */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100 border border-gray-600'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-purple-200' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* منطقة الإدخال */}
        <div className="p-3 bg-gray-750 border-t border-gray-600">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setIsTerminalVisible(!isTerminalVisible)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                isTerminalVisible 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
              }`}
            >
              <TerminalIcon className="w-3 h-3" />
              Terminal
            </button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-2 rounded transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantApp;