import React, { useState } from 'react';
import { Copy, Palette, Eye, Save, Trash2 } from 'lucide-react';

const ColorPickerApp: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [savedColors, setSavedColors] = useState([
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'
  ]);
  const [colorHistory, setColorHistory] = useState<string[]>([]);

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
            منتقي الألوان
          </h2>

          {/* منطقة اللون المحدد */}
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

          {/* منتقي الألوان */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">اختر لوناً</h3>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-32 border-none cursor-pointer"
            />
          </div>

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