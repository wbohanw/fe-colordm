import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface ColorInfo {
  name: string;
  hex: string;
  textColor: 'light' | 'dark';
}

interface ColorVariant {
  percent: number;
  hex: string;
}

export default function MainColor() {
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [variants, setVariants] = useState<ColorVariant[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Define the main colors in the wheel
  const mainColors: ColorInfo[] = [
    { name: 'Red', hex: '#FF0000', textColor: 'light' },
    { name: 'Red-Orange', hex: '#FF4500', textColor: 'light' },
    { name: 'Orange', hex: '#FFA500', textColor: 'dark' },
    { name: 'Yellow-Orange', hex: '#FFD700', textColor: 'dark' },
    { name: 'Yellow', hex: '#FFFF00', textColor: 'dark' },
    { name: 'Yellow-Green', hex: '#9ACD32', textColor: 'dark' },
    { name: 'Green', hex: '#008000', textColor: 'light' },
    { name: 'Blue-Green', hex: '#008B8B', textColor: 'light' },
    { name: 'Blue', hex: '#0000FF', textColor: 'light' },
    { name: 'Blue-Purple', hex: '#4B0082', textColor: 'light' },
    { name: 'Purple', hex: '#800080', textColor: 'light' },
    { name: 'Red-Purple', hex: '#C71585', textColor: 'light' },
  ];

  // Generate color variants (lighter and darker shades)
  const generateVariants = (hexColor: string) => {
    const result: ColorVariant[] = [];
    
    // Helper to adjust the lightness
    const adjustLightness = (hex: string, percent: number): string => {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Adjust lightness
      if (percent < 0) {
        // Darker: multiply each component by a factor (0-1)
        const factor = 1 + percent / 100;
        r = Math.round(r * factor);
        g = Math.round(g * factor);
        b = Math.round(b * factor);
      } else {
        // Lighter: add a percentage of the distance to 255
        r = Math.round(r + ((255 - r) * percent / 100));
        g = Math.round(g + ((255 - g) * percent / 100));
        b = Math.round(b + ((255 - b) * percent / 100));
      }
      
      // Ensure values are in range 0-255
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    };
    
    // Create 9 variants: 4 lighter, original, 4 darker
    for (let i = -80; i <= 80; i += 20) {
      if (i !== 0) {
        const variant = {
          percent: i,
          hex: adjustLightness(hexColor, i)
        };
        result.push(variant);
      } else {
        // Add the original color
        result.push({
          percent: 0,
          hex: hexColor
        });
      }
    }
    
    // Sort from darkest to lightest
    return result.sort((a, b) => b.percent - a.percent);
  };

  const handleColorClick = (color: ColorInfo) => {
    setSelectedColor(color);
    setVariants(generateVariants(color.hex));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(text);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 inline-block">
        Color Explorer
      </h1>
      <p className="text-gray-600 mb-12">Click on a color to see its variants from light to dark</p>
      
      {/* Color Wheel */}
      <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Color Wheel</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mainColors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color)}
              className={`relative h-24 rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95 
                ${selectedColor?.name === color.name ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name} color`}
            >
              <span 
                className={`absolute bottom-2 left-2 font-medium text-sm ${color.textColor === 'light' ? 'text-white' : 'text-gray-900'}`}
              >
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Color Variants */}
      {selectedColor && (
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedColor.name} Variants</h2>
              <p className="text-gray-500">Click on any shade to copy its hex code</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <button 
                onClick={() => copyToClipboard(selectedColor.hex)}
                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                {copiedColor === selectedColor.hex ? <FiCheck size={16} /> : <FiCopy size={16} />}
                {copiedColor === selectedColor.hex ? "Copied!" : "Copy Main Color"}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4">
            {variants.map((variant) => (
              <button
                key={variant.hex}
                onClick={() => copyToClipboard(variant.hex)}
                className="group relative h-32 rounded-xl shadow-sm hover:shadow-md transition-transform transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: variant.hex }}
                aria-label={`Copy ${variant.hex} color code`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-10 rounded-xl">
                  <span className={`font-medium text-sm ${variant.percent > 0 ? 'text-gray-900' : variant.percent < -40 ? 'text-white' : variant.percent === 0 ? (selectedColor.textColor === 'light' ? 'text-white' : 'text-gray-900') : 'text-gray-900'}`}>
                    {variant.hex}
                  </span>
                  {variant.percent !== 0 && (
                    <span className={`text-xs ${variant.percent > 0 ? 'text-gray-800' : variant.percent < -40 ? 'text-gray-300' : 'text-gray-800'}`}>
                      {variant.percent > 0 ? `+${variant.percent}%` : `${variant.percent}%`}
                    </span>
                  )}
                  {variant.percent === 0 && (
                    <span className={`text-xs ${selectedColor.textColor === 'light' ? 'text-gray-300' : 'text-gray-800'}`}>
                      Base Color
                    </span>
                  )}
                </div>
                
                {copiedColor === variant.hex && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-xl">
                    <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <FiCheck size={12} />
                      Copied!
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Color Combination Ideas */}
          <div className="mt-12 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Color Combination Ideas</h3>
            
            {/* Color Theory Combinations */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Color Theory</h4>
              <div className="flex flex-wrap gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedColor.hex }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Complementary</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedColor.hex }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 4) % 12].hex }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 8) % 12].hex }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Triadic</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedColor.hex }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 2) % 12].hex }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 10) % 12].hex }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Analogous</p>
                </div>
              </div>
            </div>
            
            {/* Practical UI Examples */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">UI Applications</h4>
              
              {/* Example 1: Buttons */}
              <div className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="font-medium text-sm text-gray-800 mb-4">Button Examples</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Complementary Button */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Complementary</p>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: selectedColor.hex,
                        color: selectedColor.textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex,
                        color: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      Secondary Button
                    </button>
                    <button 
                      className="w-full py-2 px-4 rounded-lg font-medium border transition-colors"
                      style={{ 
                        borderColor: selectedColor.hex,
                        color: selectedColor.hex,
                        backgroundColor: 'transparent'
                      }}
                    >
                      Outline Button
                    </button>
                  </div>
                  
                  {/* Triadic Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Triadic</p>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: selectedColor.hex,
                        color: selectedColor.textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 4) % 12].hex,
                        color: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 4) % 12].textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      Secondary Button
                    </button>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 8) % 12].hex,
                        color: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 8) % 12].textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      Tertiary Button
                    </button>
                  </div>
                  
                  {/* Monochromatic Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Monochromatic</p>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: selectedColor.hex,
                        color: selectedColor.textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: variants.find(v => v.percent === -40)?.hex || selectedColor.hex,
                        color: 'white'
                      }}
                    >
                      Dark Variant
                    </button>
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors"
                      style={{ 
                        backgroundColor: variants.find(v => v.percent === 60)?.hex || selectedColor.hex,
                        color: 'black'
                      }}
                    >
                      Light Variant
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Example 2: Cards and Backgrounds */}
              <div className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="font-medium text-sm text-gray-800 mb-4">Cards & Backgrounds</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Complementary Card */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Complementary Background & Border</p>
                    <div 
                      className="rounded-xl p-4 shadow-sm border"
                      style={{ 
                        backgroundColor: variants.find(v => v.percent === 80)?.hex || '#f8f9fa',
                        borderColor: selectedColor.hex
                      }}
                    >
                      <h6 
                        className="font-medium mb-1"
                        style={{ color: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex }}
                      >
                        Card Title
                      </h6>
                      <p className="text-sm text-gray-600">
                        This card uses a light variant of your selected color as background with a complementary accent.
                      </p>
                      <div className="flex justify-end mt-3">
                        <button
                          className="text-sm py-1 px-3 rounded"
                          style={{ 
                            backgroundColor: selectedColor.hex,
                            color: selectedColor.textColor === 'light' ? 'white' : 'black'
                          }}
                        >
                          Action
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analogous Card */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Analogous Gradient Background</p>
                    <div 
                      className="rounded-xl p-4 shadow-sm border border-gray-200"
                      style={{ 
                        background: `linear-gradient(to right, ${selectedColor.hex}, ${mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 2) % 12].hex})`,
                        color: selectedColor.textColor === 'light' ? 'white' : 'black'
                      }}
                    >
                      <h6 className="font-medium mb-1">Gradient Card</h6>
                      <p className="text-sm opacity-90">
                        This card uses an analogous gradient as background for a smooth color transition effect.
                      </p>
                      <div className="flex justify-end mt-3">
                        <button
                          className="text-sm py-1 px-3 rounded"
                          style={{ 
                            backgroundColor: 'white',
                            color: selectedColor.hex
                          }}
                        >
                          Action
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Example 3: Form Elements */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h5 className="font-medium text-sm text-gray-800 mb-4">Form Elements</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Primary Color Forms */}
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Primary Color Focus State</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: selectedColor.hex }}>
                          Text Input
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                          style={{ 
                            borderColor: 'rgb(209, 213, 219)', 
                            '--tw-ring-color': selectedColor.hex,
                            '--tw-ring-shadow': `0 0 0 3px ${selectedColor.hex}20`
                          } as any}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: selectedColor.hex }}>
                          Checkbox
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded"
                            style={{ 
                              accentColor: selectedColor.hex
                            } as any}
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-600">Subscribe to newsletter</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Complementary Color Forms */}
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Complementary Color Focus State</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex }}>
                          Email Input
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="example@mail.com"
                            className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                            style={{ 
                              borderColor: 'rgb(209, 213, 219)', 
                              '--tw-ring-color': mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex,
                              '--tw-ring-shadow': `0 0 0 3px ${mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex}20`
                            } as any}
                          />
                          <div 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="white">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ color: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex }}>
                          Radio Selection
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="radio-group"
                              className="h-4 w-4"
                              style={{ 
                                accentColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex
                              } as any}
                              defaultChecked
                            />
                            <span className="ml-2 text-sm text-gray-600">Option One</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="radio-group"
                              className="h-4 w-4"
                              style={{ 
                                accentColor: mainColors[(mainColors.findIndex(c => c.name === selectedColor.name) + 6) % 12].hex
                              } as any}
                            />
                            <span className="ml-2 text-sm text-gray-600">Option Two</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 