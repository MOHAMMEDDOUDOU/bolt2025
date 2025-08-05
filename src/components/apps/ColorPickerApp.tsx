import React, { useState } from 'react';
import { Copy, Palette, Eye, Save, Trash2, BadgeCent as Gradient, Download, Upload } from 'lucide-react';

const ColorPickerApp: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedGradient, setSelectedGradient] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientColors, setGradientColors] = useState([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ]);
  const [savedColors, setSavedColors] = useState([
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'
  ]);
  const [savedGradients, setSavedGradients] = useState([
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)',
    'radial-gradient(circle, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)'
  ]);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient'>('solid');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!colorHistory.includes(color)) {
      setColorHistory(prev => [color, ...prev.slice(0, 19)]);
    }
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    // يمكن إضافة إشعار هنا
  };

  const saveColor = () => {
    if (!savedColors.includes(selectedColor)) {
      setSavedColors(prev => [...prev, selectedColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    setSavedColors(prev => prev.filter(color => color !== colorToRemove));
  };

  const updateGradient = () => {
    const colorStops = gradientColors
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    const gradient = gradientType === 'linear' 
      ? `linear-gradient(${gradientAngle}deg, ${colorStops})`
      : `radial-gradient(circle, ${colorStops})`;
    
    setSelectedGradient(gradient);
  };

  const addGradientColor = () => {
    const newPosition = gradientColors.length > 0 
      ? Math.max(...gradientColors.map(c => c.position)) + 10
      : 50;
    
    setGradientColors(prev => [...prev, { color: selectedColor, position: Math.min(newPosition, 100) }]);
  };

  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 2) {
      setGradientColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const saveGradient = () => {
    if (!savedGradients.includes(selectedGradient)) {
      setSavedGradients(prev => [...prev, selectedGradient]);
    }
  };

  const exportPalette = () => {
    const palette = {
      colors: savedColors,
      gradients: savedGradients,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(palette, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(selectedColor);
  const hsl = hexToHsl(selectedColor);

  // تحديث التدرج عند تغيير المتغيرات
  React.useEffect(() => {
    updateGradient();
  }, [gradientType, gradientAngle, gradientColors]);

  const predefinedColors = [
    '#FF0000', '#FF4500', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F',
    '#00FF00', '#00FA9A', '#00FFFF', '#0080FF', '#0000FF', '#4169E1',
    '#8A2BE2', '#9400D3', '#FF00FF', '#FF1493', '#FF69B4', '#FFC0CB',
    '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF', '#8B4513'
  ];

  return (
    <div className="h-full bg-gray-50 flex">
      {/* اللوحة الرئيسية */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-600" />
            منتقي الألوان والتدرجات
          </h2>

          {/* تبويبات الألوان والتدرجات */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('solid')}
                className={`flex-1 px-6 py-3 text-sm font-medium ${
                  activeTab === 'solid' 
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                الألوان الصلبة
              </button>
              <button
                onClick={() => setActiveTab('gradient')}
                className={`flex-1 px-6 py-3 text-sm font-medium ${
                  activeTab === 'gradient' 
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                التدرجات
              </button>
            </div>
          </div>

          {/* منطقة اللون المحدد */}
          {activeTab === 'solid' ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-6">
                <div
                  className="w-32 h-32 rounded-lg border-4 border-gray-200 shadow-inner"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">اللون المحدد</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm text-gray-600">HEX:</span>
                      <input
                        type="text"
                        value={selectedColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => copyToClipboard(selectedColor)}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                        title="نسخ"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {rgb && (
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-sm text-gray-600">RGB:</span>
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm">
                          rgb({rgb.r}, {rgb.g}, {rgb.b})
                        </span>
                        <button
                          onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          title="نسخ"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {hsl && (
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-sm text-gray-600">HSL:</span>
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm">
                          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                        </span>
                        <button
                          onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          title="نسخ"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={saveColor}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      حفظ اللون
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-6">
                <div
                  className="w-32 h-32 rounded-lg border-4 border-gray-200 shadow-inner"
                  style={{ background: selectedGradient }}
                ></div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">التدرج المحدد</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm text-gray-600">النوع:</span>
                      <select
                        value={gradientType}
                        onChange={(e) => {
                          setGradientType(e.target.value as 'linear' | 'radial');
                          setTimeout(updateGradient, 0);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="linear">خطي</option>
                        <option value="radial">دائري</option>
                      </select>
                    </div>
                    
                    {gradientType === 'linear' && (
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-sm text-gray-600">الزاوية:</span>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={gradientAngle}
                          onChange={(e) => {
                            setGradientAngle(Number(e.target.value));
                            setTimeout(updateGradient, 0);
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12">{gradientAngle}°</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm text-gray-600">CSS:</span>
                      <input
                        type="text"
                        value={selectedGradient}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(selectedGradient)}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                        title="نسخ"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={saveGradient}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التدرج
                    </button>
                  </div>
                </div>
              </div>
              
              {/* ألوان التدرج */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">ألوان التدرج</h4>
                <div className="space-y-2">
                  {gradientColors.map((colorStop, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorStop.color}
                        onChange={(e) => {
                          const newColors = [...gradientColors];
                          newColors[index].color = e.target.value;
                          setGradientColors(newColors);
                          setTimeout(updateGradient, 0);
                        }}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={colorStop.position}
                        onChange={(e) => {
                          const newColors = [...gradientColors];
                          newColors[index].position = Number(e.target.value);
                          setGradientColors(newColors);
                          setTimeout(updateGradient, 0);
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-12">{colorStop.position}%</span>
                      {gradientColors.length > 2 && (
                        <button
                          onClick={() => removeGradientColor(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addGradientColor}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:text-purple-700 border border-purple-300 hover:border-purple-400 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة لون
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* منتقي الألوان */}
          {activeTab === 'solid' && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">اختر لوناً</h3>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-32 border-none cursor-pointer"
              />
            </div>
          )}

          {/* الألوان المحددة مسبقاً */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ألوان شائعة</h3>
            <div className="grid grid-cols-12 gap-2">
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* الشريط الجانبي */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        {/* أزرار التصدير والاستيراد */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={exportPalette}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              استيراد
              <input type="file" accept=".json" className="hidden" />
            </label>
          </div>
        </div>

        {/* الألوان المحفوظة */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">الألوان المحفوظة</h3>
          <div className="grid grid-cols-4 gap-2">
            {savedColors.map((color, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => handleColorChange(color)}
                  className="w-full h-12 rounded border-2 border-gray-300 hover:border-gray-800 transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <button
                  onClick={() => removeColor(color)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* التدرجات المحفوظة */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">التدرجات المحفوظة</h3>
          <div className="space-y-2">
            {savedGradients.map((gradient, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => setSelectedGradient(gradient)}
                  className="w-full h-12 rounded border-2 border-gray-300 hover:border-gray-800 transition-all"
                  style={{ background: gradient }}
                  title={gradient}
                />
                <button
                  onClick={() => setSavedGradients(prev => prev.filter((_, i) => i !== index))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* تاريخ الألوان */}
        {colorHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">التاريخ</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {colorHistory.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{color}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPickerApp;