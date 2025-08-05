import React, { useState } from 'react';
import CodeEditor from '../CodeEditor';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
}

const CodeEditorApp: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<FileNode>({
    id: 'welcome',
    name: 'welcome.html',
    type: 'file',
    content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في محرر الكود</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: #e0e0e0;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #4CAF50;
            text-align: center;
            margin-bottom: 30px;
        }
        .code-block {
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }
        .highlight {
            color: #FFD700;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💻 مرحباً بك في محرر الكود</h1>
        
        <p>هذا محرر كود متقدم يدعم:</p>
        
        <div class="code-block">
            <span class="highlight">// JavaScript</span><br>
            function sayHello(name) {<br>
            &nbsp;&nbsp;return \`مرحباً \${name}!\`;<br>
            }
        </div>
        
        <div class="code-block">
            <span class="highlight">/* CSS */</span><br>
            .beautiful-design {<br>
            &nbsp;&nbsp;background: linear-gradient(45deg, #ff6b6b, #4ecdc4);<br>
            &nbsp;&nbsp;border-radius: 10px;<br>
            }
        </div>
        
        <p>ابدأ بكتابة الكود وشاهد السحر يحدث! ✨</p>
    </div>
</body>
</html>`
  });

  const handleSave = (fileId: string, content: string) => {
    setCurrentFile(prev => ({ ...prev, content }));
    console.log('تم حفظ الملف:', fileId);
  };

  const handlePreview = () => {
    console.log('معاينة الملف');
  };

  return (
    <div className="h-full">
      <CodeEditor
        file={currentFile}
        onSave={handleSave}
        onPreview={handlePreview}
      />
    </div>
  );
};

export default CodeEditorApp;