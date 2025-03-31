import { useState, useEffect } from 'react';
import { FiRefreshCw, FiTrash2, FiSave, FiDownload, FiX } from 'react-icons/fi';

interface DraggableColor {
  id: string;
  color: string;
}

// Updated Draggable color component with delete button
function DraggableColorItem({ 
  id, 
  color, 
  onDragStart,
  onRemove
}: { 
  id: string, 
  color: string,
  onDragStart: (id: string, e: React.DragEvent<HTMLDivElement>) => void,
  onRemove: (id: string) => void
}) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dragging when clicking remove button
    onRemove(id);
  };

  return (
    <div
      id={id}
      draggable
      onDragStart={(e) => onDragStart(id, e)}
      className="w-16 h-16 rounded-full shadow-lg cursor-move flex items-center justify-center relative group hover:scale-105 transition-all duration-200"
      style={{ backgroundColor: color }}
    >
      {/* Remove button with improved feedback */}
      <button 
        onClick={handleRemoveClick}
        className="absolute -top-1 -right-1 bg-white text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 transform group-hover:rotate-90 hover:rotate-0"
        aria-label={`Remove ${color} color`}
      >
        <FiX size={14} />
      </button>

      <span 
        className="text-xs font-bold select-none"
        style={{ color: isLightColor(color) ? '#000' : '#fff' }}
      >
        {color}
      </span>
      
      {/* Drag indicator */}
      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-10 pointer-events-none flex items-center justify-center">
        <span className="text-white text-xs transform rotate-45">↔</span>
      </div>
    </div>
  );
}

export default function Playground() {
  const [colors, setColors] = useState<DraggableColor[]>([]);
  const [gradientPreview, setGradientPreview] = useState<string>('linear-gradient(to right, #ffffff, #ffffff)');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientDirection, setGradientDirection] = useState<string>('to right');
  const [paletteItems, setPaletteItems] = useState<DraggableColor[]>([]);
  const [gradientItems, setGradientItems] = useState<DraggableColor[]>([]);
  
  // Generate a random color
  const generateRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Add a new random color
  const addRandomColor = () => {
    const id = `color-${Date.now()}`;
    const newColor = {
      id,
      color: generateRandomColor()
    };
    
    setPaletteItems([...paletteItems, newColor]);
    setColors([...colors, newColor]);
  };

  // Add a color with a specific hex value
  const addColor = (hex: string) => {
    const id = `color-${Date.now()}`;
    const newColor = {
      id,
      color: hex
    };
    
    setPaletteItems([...paletteItems, newColor]);
    setColors([...colors, newColor]);
  };

  // Clear all colors
  const clearColors = () => {
    setPaletteItems([]);
    setGradientItems([]);
    setColors([]);
    updateGradient([]);
  };

  // Handle drag start
  const handleDragStart = (id: string, e: React.DragEvent<HTMLDivElement>) => {
    // Set the drag data to the color ID
    e.dataTransfer.setData('text/plain', id);
  };

  // Handle drop on gradient area
  const handleDropOnGradient = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    
    // If the item is already in the gradient, don't add it again
    if (!gradientItems.some(item => item.id === id)) {
      const colorItem = colors.find(c => c.id === id);
      if (colorItem) {
        // Add to gradient items and remove from palette
        const updatedGradientItems = [...gradientItems, colorItem];
        setGradientItems(updatedGradientItems);
        setPaletteItems(paletteItems.filter(item => item.id !== id));
        updateGradient(updatedGradientItems);
      }
    }
  };

  // Ensure the drop zone accepts drops
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  // Update the gradient based on colors in the gradient items
  const updateGradient = (items: DraggableColor[]) => {
    if (items.length === 0) {
      setGradientPreview('linear-gradient(to right, #ffffff, #ffffff)');
      return;
    }
    
    if (gradientType === 'linear') {
      const gradient = `linear-gradient(${gradientDirection}, ${items.map(c => c.color).join(', ')})`;
      setGradientPreview(gradient);
    } else {
      const gradient = `radial-gradient(circle, ${items.map(c => c.color).join(', ')})`;
      setGradientPreview(gradient);
    }
  };

  // Update gradient when type or direction changes
  useEffect(() => {
    updateGradient(gradientItems);
  }, [gradientType, gradientDirection]);

  // Generate random colors when dice is rolled
  const rollDice = () => {
    // Generate 3 random colors
    clearColors();
    
    const newColors = [];
    for (let i = 0; i < 3; i++) {
      const id = `color-${Date.now() + i}`;
      newColors.push({
        id,
        color: generateRandomColor()
      });
    }
    
    setPaletteItems(newColors);
    setColors(newColors);
  };

  // Copy gradient CSS to clipboard
  const copyGradientCSS = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${gradientPreview};`);
      alert('Gradient CSS copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Export gradient as image
  const exportGradient = () => {
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a gradient on the canvas
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    
    gradientItems.forEach((color, index) => {
      gradient.addColorStop(index / (gradientItems.length - 1 || 1), color.color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert canvas to an image and trigger download
    const link = document.createElement('a');
    link.download = 'gradient.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Add this new function to handle removing colors
  const handleRemoveColor = (id: string) => {
    // Check if the color is in the palette
    if (paletteItems.some(item => item.id === id)) {
      setPaletteItems(paletteItems.filter(item => item.id !== id));
      
      // Also remove from the main colors array
      setColors(colors.filter(c => c.id !== id));
    } 
    // Check if the color is in the gradient
    else if (gradientItems.some(item => item.id === id)) {
      const updatedGradientItems = gradientItems.filter(item => item.id !== id);
      setGradientItems(updatedGradientItems);
      
      // Update the gradient preview after removing the color
      updateGradient(updatedGradientItems);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 inline-block">
            Color Gradient Playground
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Create beautiful gradients by mixing and matching colors. Drag and drop to arrange, export when you're done.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Color Tools</h2>
              </div>
              
              {/* Random color generator */}
              <div className="p-5 border-b border-gray-100">
                <button 
                  onClick={rollDice}
                  className="w-full py-3 group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-center gap-3">
                    <FiRefreshCw className="group-hover:animate-spin" size={18} />
                    <span>Random</span>
                  </div>
                </button>
              </div>
              
              {/* Color palette */}
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-medium text-sm text-gray-700 mb-3">Quick Colors</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE', '#FFC0CB', '#000000', '#FFFFFF'].map((color) => (
                    <button
                      key={color}
                      onClick={() => addColor(color)}
                      className="aspect-square rounded-md shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 relative group"
                      style={{ backgroundColor: color }}
                      aria-label={`Add ${color} color`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* How to use */}
              <div className="p-5">
                <h3 className="font-medium text-gray-900 mb-3">How to Use</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Generate random colors or pick from the palette</li>
                  <li>Drag colors to the gradient preview area</li>
                  <li>Adjust gradient settings as needed</li>
                  <li>Copy CSS code or export as image</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Gradient Preview */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gradient Preview</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={copyGradientCSS}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <FiSave size={14} />
                    <span>Copy CSS</span>
                  </button>
                  <button 
                    onClick={exportGradient}
                    className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <FiDownload size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div
                  onDrop={handleDropOnGradient}
                  onDragOver={handleDragOver}
                  className="h-[300px] rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-inner"
                  style={{ background: gradientPreview }}
                >
                  {gradientItems.length === 0 && (
                    <div className="text-center p-6 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-sm border border-white border-opacity-50 transition-all duration-300">
                      <p className="text-gray-700">Drag colors here to create your gradient</p>
                    </div>
                  )}
                  
                  {/* Draggable gradient colors */}
                  <div className="absolute left-0 right-0 bottom-0 p-4 flex gap-2 flex-wrap">
                    {gradientItems.map((item) => (
                      <DraggableColorItem 
                        key={item.id} 
                        id={item.id} 
                        color={item.color} 
                        onDragStart={handleDragStart}
                        onRemove={handleRemoveColor}
                      />
                    ))}
                  </div>
                </div>
                
                {/* CSS code preview */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">CSS Code</span>
                    <button 
                      onClick={copyGradientCSS}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                  <div className="font-mono text-sm text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto border border-gray-200">
                    background: {gradientPreview};
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gradient Settings */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 md:col-span-1">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Gradient Settings</h2>
                </div>
                
                <div className="p-5 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setGradientType('linear');
                          updateGradient(gradientItems);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          gradientType === 'linear' 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Linear
                      </button>
                      <button
                        onClick={() => {
                          setGradientType('radial');
                          updateGradient(gradientItems);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          gradientType === 'radial' 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Radial
                      </button>
                    </div>
                  </div>
                  
                  {gradientType === 'linear' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          'to top', 'to right top', 'to right',
                          'to right bottom', 'to bottom', 'to left bottom',
                          'to left', 'to left top'
                        ].map(direction => (
                          <button
                            key={direction}
                            onClick={() => {
                              setGradientDirection(direction);
                              updateGradient(gradientItems);
                            }}
                            className={`p-2 rounded-lg text-xs transition-all duration-200 ${
                              gradientDirection === direction 
                                ? 'bg-blue-500 text-white shadow-sm' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {direction.replace('to ', '→ ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={clearColors}
                      className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiTrash2 size={14} />
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Color Palette */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 md:col-span-2">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Color Palette</h2>
                  <button
                    onClick={addRandomColor}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Random Color
                  </button>
                </div>
                
                <div className="p-5 min-h-[200px] relative">
                  {paletteItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Generate colors to get started
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4">
                    {paletteItems.map((item) => (
                      <DraggableColorItem 
                        key={item.id} 
                        id={item.id} 
                        color={item.color}
                        onDragStart={handleDragStart}
                        onRemove={handleRemoveColor}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness (Luminance)
  // See: https://www.w3.org/TR/AERT/#color-contrast
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is light (brightness > 128)
  return brightness > 128;
} 