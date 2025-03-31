import React, { useState, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { debounce } from 'lodash';
import { LuUpload, LuCode, LuPalette, LuEye, LuSettings, LuPaintbrush, LuSearch, LuInfo, LuX } from 'react-icons/lu';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Setup Monaco Editor workers
// This needs to be called before Monaco is loaded
self.MonacoEnvironment = {
  getWorkerUrl: function (label) {
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js';
    }
    return './editor.worker.js';
  }
};

// ================ TYPES ================

type CodeFile = {
  id: string;
  filename: string;
  content: string;
};

// type ColorToken = {
//   id: string;
//   type: 'tailwind' | 'hex' | 'rgb' | 'hsl' | 'named'; 
//   value: string;
//   displayValue: string;
//   fileId: string;
//   line: number;
//   column: number;
// };

// type ComponentNode = {
//   id: string;
//   name: string;
//   type: 'element' | 'component';
//   fileId: string;
//   startLine: number;
//   endLine: number;
//   props: Map<string, string>;
//   children: ComponentNode[];
//   colorTokens: ColorToken[];
// };

// ================ COMPONENTS ================

// Main Component
const ColorDesignStudio: React.FC = () => {
  // State
  const [files, setFiles] = useState<CodeFile[]>([getDefaultFile()]);
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [code, setCode] = useState<string>(files[0].content);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split');
  
  // Refs
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  // Create a module scope that includes React and common libraries
  const moduleScope = {
    React,
    // Add any other libraries you commonly use in your components
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
  };

  // Helper to prepare code for the live preview
  const prepareCodeForLivePreview = (sourceCode: string): string => {
    // Convert require statements to import statements or remove them
    let processedCode = sourceCode
      // Remove require statements
      .replace(/const\s+(\w+)\s*=\s*require\s*\(['"](.+?)['"]\);?/g, '// Import for $1 from $2 is provided')
      // Remove import statements, we'll handle dependencies via scope
      .replace(/import\s+(.+?)\s+from\s+['"](.+?)['"];?/g, '// Import for $1 from $2 is provided');

    // Make sure there's a render function
    if (!processedCode.includes('render(')) {
      // Try to find the component name
      const componentMatch = processedCode.match(/const\s+(\w+)\s*=\s*\(\)\s*=>/);
      if (componentMatch) {
        const componentName = componentMatch[1];
        processedCode += `\n\nrender(<${componentName} />);`;
      } else {
        // Default fallback render
        processedCode += `\n\nrender(() => <div>Preview not available</div>);`;
      }
    }
    
    return processedCode;
  };

  // Update code when file changes
  useEffect(() => {
    const activeFile = files.find(f => f.id === activeFileId);
    if (activeFile) {
      setCode(activeFile.content);
    }
  }, [activeFileId, files]);
  
  return (
    <div className="relative h-screen flex flex-col bg-slate-950 text-slate-100 ">
      <Header
        files={files}
        activeFileId={activeFileId}
        onFileChange={setActiveFileId}
        onFileUpload={handleFileUpload}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-slate-800`}>
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <LuCode className="text-indigo-400" size={16} />
                <span className="text-sm font-medium">Code Editor</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <span className="text-xs px-2 py-1 bg-slate-800 rounded">
                  {files.find(f => f.id === activeFileId)?.filename}
                </span>
              </div>
            </div>
            <CodeEditor
              file={files.find(f => f.id === activeFileId)!}
              onContentChange={handleCodeChange}
              editorRef={editorRef}
            />
            <ColorPaletteSimple 
              code={code}
              onColorChange={handleColorChangeSimple}
            />
          </div>
        )}
        
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <LuEye className="text-indigo-400" size={16} />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors">
                  <LuPaintbrush size={16} />
                </button>
                <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors">
                  <LuSettings size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 p-6 overflow-auto border-b border-slate-800">
              <LiveProvider 
                code={prepareCodeForLivePreview(code)} 
                noInline={true} 
                scope={moduleScope}
              >
                <LiveError className="text-red-500 p-4 bg-red-100 bg-opacity-30 dark:bg-red-900 dark:bg-opacity-20 rounded mb-4" />
                <LivePreview className="min-h-full" />
              </LiveProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Helper functions
  function handleCodeChange(newContent: string) {
    // Update the file content
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content: newContent } 
          : file
      )
    );
    
    // Update the code for the live preview
    setCode(newContent);
  }
  
  function handleFileUpload(newFiles: FileList) {
    // Read and add files
    Array.from(newFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const newFile: CodeFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            filename: file.name,
            content
          };
          
          setFiles(prev => [...prev, newFile]);
          setActiveFileId(newFile.id);
          setCode(content);
        }
      };
      reader.readAsText(file);
    });
  }
  
  function handleColorChangeSimple(oldColor: string, newColor: string) {
    // Simple direct replacement in the code
    const newCode = code.replace(new RegExp(oldColor, 'g'), newColor);
    
    // Update the editor and state
    if (editorRef.current) {
      editorRef.current.setValue(newCode);
    }
    
    // Update the file content
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content: newCode } 
          : file
      )
    );
    
    // Update the live preview
    setCode(newCode);
  }
};

// Modified Header component with navigation
const Header: React.FC<{
  files: CodeFile[],
  activeFileId: string,
  onFileChange: (id: string) => void,
  onFileUpload: (files: FileList) => void,
  viewMode: 'split' | 'preview' | 'code',
  setViewMode: (mode: 'split' | 'preview' | 'code') => void
}> = ({ files, activeFileId, onFileChange, onFileUpload, viewMode, setViewMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  return (
    <header className="bg-slate-900 px-6 py-3 border-b border-slate-800 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Logo/Home link */}
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => navigate('/')}
          >
            <h1 className="m-0 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-cyan-600">
              ColorDorm<span className="text-cyan-500 animate-pulse">_</span>
            </h1>
          </div>
          
          {/* Navigation links */}
          <button 
            onClick={() => navigate('/main-color')}
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            Main Color
          </button>
          <button 
            onClick={() => navigate('/home')}
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            Gallery
          </button>
          <button 
            onClick={() => navigate('/playground')}
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            Playground
          </button>
          <span className="text-slate-300 text-sm font-semibold">Copilot</span>
        </div>
        
        {/* Center section */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-800 rounded-lg p-1 mr-3">
            <button 
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'code' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Code
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'split' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preview
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md text-sm font-medium border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={activeFileId}
              onChange={(e) => onFileChange(e.target.value)}
            >
              {files.map(file => (
                <option key={file.id} value={file.id}>
                  {file.filename}
                </option>
              ))}
            </select>
            
            <label className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors flex items-center space-x-2 shadow-sm">
              <LuUpload size={16} />
              <span>Upload Files</span>
              <input 
                type="file" 
                accept=".jsx,.tsx,.js,.ts,.html,.css" 
                multiple 
                onChange={(e) => e.target.files && onFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Right section - user features */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div 
              className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm text-slate-200">
                {user?.username || 'User'}
              </span>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// Component for the code editor
const CodeEditor: React.FC<{
  file: CodeFile,
  onContentChange: (content: string) => void,
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
}> = ({ file, onContentChange, editorRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      // Set up editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: file.content,
        language: getLanguageFromFilename(file.filename),
        theme: 'vs-dark',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        automaticLayout: true,
        wordWrap: 'on',
        renderLineHighlight: 'all',
        padding: { top: 16 },
        roundedSelection: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
      });
      
      // Set up change handler
      editorRef.current.onDidChangeModelContent(debounce(() => {
        if (editorRef.current) {
          onContentChange(editorRef.current.getValue());
        }
      }, 300));
    }
    
    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);
  
  // Update content when file changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== file.content) {
        editorRef.current.setValue(file.content);
      }
    }
  }, [file]);
  
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute top-2 right-3 z-10 flex space-x-1 opacity-50 hover:opacity-100 transition-opacity">
        <button className="p-1.5 bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors">
          <LuSearch size={14} />
        </button>
        <button className="p-1.5 bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors">
          <LuInfo size={14} />
        </button>
      </div>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

// Simplified Color Palette that works directly with code
const ColorPaletteSimple: React.FC<{
  code: string,
  onColorChange: (oldColor: string, newColor: string) => void
}> = ({ code, onColorChange }) => {
  // Extract colors from code
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Extract colors whenever code changes
  useEffect(() => {
    const extractedColors = extractColors(code);
    setColors(extractedColors);
  }, [code]);
  
  // Helper to extract colors from code
  function extractColors(code: string): string[] {
    const uniqueColors = new Set<string>();
    
    // Extract Tailwind color classes
    const tailwindPattern = /(bg|text|border|from|to|via)-(transparent|current|black|white|gray|red|orange|yellow|green|teal|blue|indigo|purple|pink)-([0-9]+)/g;
    const tailwindMatches = code.match(tailwindPattern) || [];
    tailwindMatches.forEach(match => uniqueColors.add(match));
    
    // Extract hex colors
    const hexPattern = /#([0-9a-fA-F]{3,8})\b/g;
    const hexMatches = code.match(hexPattern) || [];
    hexMatches.forEach(match => uniqueColors.add(match));
    
    // Extract rgb/rgba colors
    const rgbPattern = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)/g;
    const rgbMatches = code.match(rgbPattern) || [];
    rgbMatches.forEach(match => uniqueColors.add(match));
    
    return Array.from(uniqueColors);
  }
  
  // Function to handle color change in real-time
  const handleColorChange = (oldColor: string, newColor: string) => {
    onColorChange(oldColor, newColor);
    setSelectedColor(null);
  };
  
  return (
    <div className="bg-slate-900 p-5 border-t border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <LuPalette className="text-indigo-400" size={18} />
          <h2 className="font-semibold text-slate-200">Color Palette</h2>
        </div>
        
        {selectedColor && (
          <div className="flex items-center space-x-3 bg-slate-800 p-2.5 rounded-md shadow-sm border border-slate-700">
            <span className="text-sm font-medium text-slate-300">Editing:</span>
            <div 
              className="w-5 h-5 rounded-md shadow-inner" 
              style={{ 
                backgroundColor: selectedColor.startsWith('#') ? selectedColor : 
                  (selectedColor.match(/(bg|text|border)-([a-z]+)-([0-9]+)/) ? 
                    getTailwindColor(selectedColor) : '#ccc')
              }}
            />
            <span className="text-sm text-slate-300">{selectedColor}</span>
            
            {selectedColor.match(/(bg|text|border)-([a-z]+)-([0-9]+)/) ? (
              <select
                className="bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedColor}
                onChange={(e) => handleColorChange(selectedColor, e.target.value)}
              >
                <option value="bg-blue-500">bg-blue-500</option>
                <option value="bg-green-500">bg-green-500</option>
                <option value="bg-red-500">bg-red-500</option>
                <option value="bg-yellow-500">bg-yellow-500</option>
                <option value="bg-purple-500">bg-purple-500</option>
                <option value="bg-indigo-500">bg-indigo-500</option>
                <option value="bg-pink-500">bg-pink-500</option>
              </select>
            ) : (
              <input 
                type="color"
                value={selectedColor.startsWith('#') ? selectedColor : '#000000'}
                onChange={(e) => handleColorChange(selectedColor, e.target.value)}
                className="h-8 w-10 rounded-md cursor-pointer border-0"
              />
            )}
            
            <button 
              className="bg-slate-700 hover:bg-slate-600 p-1.5 rounded-md hover:text-white text-slate-400 transition-colors"
              onClick={() => setSelectedColor(null)}
              aria-label="Cancel"
            >
              <LuX size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-slate-800 rounded-md p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Detected Colors</h3>
        {colors.length === 0 ? (
          <div className="text-center text-slate-500 py-2">
            No colors detected in the code
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <div 
                key={color}
                className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-all hover:scale-105 backdrop-blur-sm ${
                  selectedColor === color 
                    ? 'bg-indigo-600 bg-opacity-30 ring-2 ring-indigo-500' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                onClick={() => setSelectedColor(color)}
              >
                <div 
                  className="w-4 h-4 rounded-md shadow-sm" 
                  style={{ 
                    backgroundColor: color.startsWith('#') ? color : 
                      (color.match(/(bg|text|border)-([a-z]+)-([0-9]+)/) ? 
                        getTailwindColor(color) : '#ccc')
                  }}
                />
                <span className="text-xs font-medium text-slate-300">{color}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Click on any color to edit it directly in your code
        </div>
      </div>
    </div>
  );
};

// ================ HELPER FUNCTIONS ================

// Default file generator
function getDefaultFile(): CodeFile {
  return {
    id: 'default-file',
    filename: 'App.tsx',
    content: `
// React is automatically provided in the preview environment
// No need to import it explicitly

const App = () => {
  return (
    <div className="bg-blue-500 p-4 rounded-lg shadow-md">
      <h1 className="text-white text-2xl font-bold mb-4">Hello World</h1>
      <button 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        style={{ border: '1px solid #ccc', color: '#fff' }}
      >
        Click Me
      </button>
    </div>
  );
};

// Render the App component in the preview
render(<App />);
    `.trim()
  };
}

// Get language ID from filename
function getLanguageFromFilename(filename: string): string {
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.html')) return 'html';
  return 'typescript';
}

// Tailwind color lookup
function getTailwindColor(className: string): string {
  const tailwindColors: Record<string, Record<string, string>> = {
    blue: {
      '500': '#3b82f6',
      '700': '#1d4ed8',
    },
    green: {
      '500': '#10b981',
      '700': '#047857',
    },
    red: {
      '500': '#ef4444',
      '700': '#b91c1c',
    },
    yellow: {
      '500': '#eab308',
      '700': '#a16207',
    },
    purple: {
      '500': '#8b5cf6',
      '700': '#6d28d9',
    },
    gray: {
      '500': '#6b7280',
      '700': '#374151',
    },
    white: { '': '#ffffff' },
    black: { '': '#000000' },
  };
  
  const match = className.match(/(bg|text|border)-([a-z]+)(?:-([0-9]+))?/);
  if (match) {
    const [_, color, shade = ''] = match;
    return tailwindColors[color]?.[shade] || '#ccc';
  }
  
  return '#ccc';
}

export default ColorDesignStudio;