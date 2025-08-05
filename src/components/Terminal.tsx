import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';

interface TerminalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isVisible, onClose }) => {
  const [commands, setCommands] = useState<Array<{type: 'input' | 'output', content: string}>>([
    { type: 'output', content: 'مرحباً بك في Terminal المدمج' },
    { type: 'output', content: 'اكتب "help" لعرض الأوامر المتاحة' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // إضافة الأمر إلى التاريخ
    setCommandHistory(prev => [...prev, cmd]);
    
    // إضافة الأمر المدخل إلى القائمة
    setCommands(prev => [...prev, { type: 'input', content: `$ ${cmd}` }]);

    let output = '';
    
    switch (trimmedCmd) {
      case 'help':
        output = `الأوامر المتاحة:
  help          - عرض هذه الرسالة
  clear         - مسح الشاشة
  ls            - عرض الملفات
  pwd           - عرض المسار الحالي
  date          - عرض التاريخ والوقت
  whoami        - عرض معلومات المستخدم
  echo [text]   - طباعة النص
  mkdir [name]  - إنشاء مجلد
  touch [name]  - إنشاء ملف
  cat [file]    - عرض محتوى الملف
  npm install   - تثبيت الحزم
  npm start     - تشغيل المشروع
  git status    - حالة Git`;
        break;
        
      case 'clear':
        setCommands([]);
        return;
        
      case 'ls':
        output = `index.html    style.css    script.js    package.json
src/          public/      node_modules/    .git/`;
        break;
        
      case 'pwd':
        output = '/home/user/web-project';
        break;
        
      case 'date':
        output = new Date().toLocaleString('ar-SA');
        break;
        
      case 'whoami':
        output = 'web-developer';
        break;
        
      case 'npm install':
        output = `جاري تثبيت الحزم...
✓ react@18.2.0
✓ typescript@4.9.5
✓ vite@4.3.9
تم تثبيت 847 حزمة في 23.4 ثانية`;
        break;
        
      case 'npm start':
        output = `> dev-server@1.0.0 start
> vite

  Local:   http://localhost:3000/
  Network: http://192.168.1.100:3000/
  
  جاهز في 1.2 ثانية`;
        break;
        
      case 'git status':
        output = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/App.tsx
  modified:   src/styles.css
  
Untracked files:
  src/components/NewComponent.tsx`;
        break;
        
      default:
        if (trimmedCmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else if (trimmedCmd.startsWith('mkdir ')) {
          const folderName = cmd.substring(6);
          output = `تم إنشاء المجلد: ${folderName}`;
        } else if (trimmedCmd.startsWith('touch ')) {
          const fileName = cmd.substring(6);
          output = `تم إنشاء الملف: ${fileName}`;
        } else if (trimmedCmd.startsWith('cat ')) {
          const fileName = cmd.substring(4);
          output = `محتوى الملف ${fileName}:
<!DOCTYPE html>
<html>
<head>
    <title>مثال</title>
</head>
<body>
    <h1>مرحباً بالعالم!</h1>
</body>
</html>`;
        } else {
          output = `الأمر غير موجود: ${cmd}
اكتب "help" لعرض الأوامر المتاحة`;
        }
    }
    
    setCommands(prev => [...prev, { type: 'output', content: output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        executeCommand(currentCommand);
      }
      setCurrentCommand('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-80 bg-gray-900 text-green-400 font-mono text-sm border-t border-gray-700 z-40">
      {/* شريط العنوان */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-white text-sm">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-700 rounded">
            <Minus className="w-3 h-3 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Square className="w-3 h-3 text-gray-400" />
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* محتوى Terminal */}
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto p-4 space-y-1"
      >
        {commands.map((cmd, index) => (
          <div key={index} className={cmd.type === 'input' ? 'text-white' : 'text-green-400'}>
            <pre className="whitespace-pre-wrap font-mono">{cmd.content}</pre>
          </div>
        ))}
        
        {/* سطر الإدخال */}
        <div className="flex items-center gap-2 text-white">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white"
            placeholder="اكتب أمراً..."
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;