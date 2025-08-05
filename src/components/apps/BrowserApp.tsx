import React from 'react';
import BrowserPreview from '../BrowserPreview';

const BrowserApp: React.FC = () => {
  const defaultHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في المتصفح</title>
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
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 مرحباً بك في المتصفح المدمج</h1>
        <p>هذا متصفح مدمج داخل بيئة التطوير الخاصة بك</p>
        
        <div class="features">
            <div class="feature">
                <h3>🚀 سريع</h3>
                <p>تصفح سريع ومتجاوب</p>
            </div>
            <div class="feature">
                <h3>🔒 آمن</h3>
                <p>تصفح آمن ومحمي</p>
            </div>
            <div class="feature">
                <h3>🎨 جميل</h3>
                <p>واجهة أنيقة وحديثة</p>
            </div>
        </div>
    </div>
</body>
</html>`;

  return (
    <div className="h-full">
      <BrowserPreview 
        htmlContent={defaultHtml}
        isFullscreen={false}
        onToggleFullscreen={() => {}}
      />
    </div>
  );
};

export default BrowserApp;