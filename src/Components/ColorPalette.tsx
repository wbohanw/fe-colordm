import { useState } from 'react';

interface ColorPaletteProps {
  colors: number[][];
  cssCode: string;
}

export default function ColorPalette({ colors, cssCode }: ColorPaletteProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="color-palette">
      <div className="color-swatches">
        {colors.map((color, index) => {
          const hex = `#${((1 << 24) | (color[0] << 16) | (color[1] << 8) | color[2])
            .toString(16)
            .slice(1)}`;
          
          return (
            <div 
              key={index}
              className="color-swatch"
              style={{ backgroundColor: `rgb(${color.join(',')})` }}
            >
              <span>{hex}</span>
            </div>
          );
        })}
      </div>
      
      <div className="css-code">
        <pre>{cssCode}</pre>
        <button onClick={() => copyToClipboard(cssCode)}>
          {copied ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
}