import { useState } from 'react';
import { FiClipboard, FiCheck } from 'react-icons/fi';

interface ColorPaletteProps {
  colors: number[][];
  cssCode: string;
}

export default function ColorPalette({ colors, cssCode }: ColorPaletteProps) {
  const [copied, setCopied] = useState(false);
  const [copiedColorIndex, setCopiedColorIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const copyColorToClipboard = async (text: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColorIndex(index);
      setTimeout(() => setCopiedColorIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const rgbToHex = (rgb: number[]) => {
    return `#${rgb.map(v => 
      v.toString(16).padStart(2, '0')
    ).join('')}`.toUpperCase();
  };

  // Check if a color is light to determine text color
  const isLightColor = (color: number[]) => {
    const brightness = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255;
    return brightness > 0.65;
  };

  return (
    <div className="my-8">
      <div className="flex items-center mb-6 gap-3">
        <h4 className="text-lg font-semibold text-cyan-600 cyber-text">Color Palette</h4>
        <span className="text-sm text-gray-500">{colors.length} colors</span>
      </div>
      
      <div className="flex overflow-x-auto pb-6 gap-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {colors.map((color, index) => {
          const hexColor = rgbToHex(color);
          const isLight = isLightColor(color);
          return (
            <div 
              key={index}
              className="flex-shrink-0 group relative perspective"
            >
              <div 
                className="w-24 h-28 rounded-xl mb-3 shadow-md cursor-pointer transition-all 
                  transform hover:scale-105 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] relative overflow-hidden
                  cyber-border"
                style={{ backgroundColor: `rgb(${color.join(',')})` }}
                onClick={() => copyToClipboard(hexColor)}
              >
                {/* Top glass effect */}
                <div className="absolute inset-x-0 top-0 h-3 bg-white/10"></div>
                
                {/* Circuit pattern on corner */}
                <div className="absolute w-8 h-8 -top-3 -left-3 circuit-pulse opacity-30">
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500"></div>
                  <div className="absolute bottom-0 left-0 w-[1px] h-full bg-cyan-500"></div>
                </div>
                
                {/* Color info overlay at bottom */}
                <div className={`
                  absolute bottom-0 inset-x-0 p-2 pt-8
                  bg-gradient-to-t from-black to-transparent
                `}>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`
                        text-xs font-mono font-semibold mb-1
                        ${isLight ? 'text-gray-800' : 'text-gray-200'}
                      `}
                    >
                      {hexColor}
                    </div>
                  </div>
                </div>
                
                {/* Copy button */}
                <button
                  onClick={(e) => copyColorToClipboard(hexColor, index, e)}
                  className={`
                    absolute top-2 right-2 w-6 h-6 flex items-center justify-center
                    rounded-full bg-white/80 backdrop-blur-sm
                    opacity-0 group-hover:opacity-100 transition-opacity 
                    border border-gray-200 hover:border-cyan-300 shadow-sm
                    ${isLight ? 'text-gray-700' : 'text-gray-700'}
                  `}
                  aria-label="Copy color"
                >
                  <FiClipboard className="w-3 h-3" />
                </button>
              </div>
              
              {/* RGB value below the color */}
              <div className="text-center">
                <div className="font-mono text-xs text-gray-500 truncate">
                  rgb({color.join(', ')})
                </div>
              </div>
              
              {/* Bottom reflection effect */}
              <div 
                className="w-20 h-3 rounded-b-lg opacity-20 blur-[1px] mt-1 mx-auto scale-90"
                style={{ 
                  background: `rgb(${color.join(',')})`,
                  transform: 'rotateX(180deg) scaleY(0.3)'
                }}
              ></div>
              
              {/* Copied indicator */}
              {copiedColorIndex === index && (
                <div className="absolute inset-0 top-0 left-0 w-24 h-28 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                  <div className="text-cyan-600 flex flex-col items-center">
                    <FiCheck className="h-6 w-6 mb-1" />
                    <span className="text-xs">Copied!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {cssCode && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-cyan-600 cyber-text">CSS Gradient</h4>
            <button
              onClick={() => copyToClipboard(cssCode)}
              className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <FiClipboard className="w-4 h-4" />
              Copy CSS
            </button>
          </div>
          <div className="relative">
            <code 
              className="block w-full p-4 bg-gray-100 rounded-lg text-sm text-gray-700 font-mono overflow-x-auto border border-gray-200 shadow-inner"
              onClick={() => copyToClipboard(cssCode)}
            >
              {cssCode}
            </code>
            <button 
              onClick={() => copyToClipboard(cssCode)}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-md text-gray-500 hover:text-cyan-600 hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copied && <span className="absolute text-xs bg-white text-cyan-600 px-1.5 py-0.5 rounded -right-1 top-full mt-1 border border-gray-200 shadow-sm">Copied!</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}