
import React, { useState, useRef, useCallback, useEffect } from 'react';
import JSXGraphBoard, { BoardHandles } from './components/JSXGraphBoard';
import Sidebar from './components/Sidebar';
import { Point, HistoryItem } from './types';
import { useLanguage } from './i18n';

const App: React.FC = () => {
  const { language, translated } = useLanguage();
  const [isPointCreationMode, setIsPointCreationMode] = useState<boolean>(false);
  const [isCircleMode, setIsCircleMode] = useState<boolean>(false);
  const [circlePointIds, setCirclePointIds] = useState<string[]>([]);
  const [circlePointCoords, setCirclePointCoords] = useState<Point[]>([]);

  const [isLineMode, setIsLineMode] = useState<boolean>(false);
  const [linePointIds, setLinePointIds] = useState<string[]>([]);
  const [linePointCoords, setLinePointCoords] = useState<Point[]>([]);
  
  const [xScale, setXScale] = useState<number>(1);
  const [yScale, setYScale] = useState<number>(1);
  const [polynomial, setPolynomial] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#38bdf8'); // Default: sky-400

  const boardRef = useRef<BoardHandles>(null);
  const isPointCreationModeRef = useRef(isPointCreationMode);
  const isCircleModeRef = useRef(isCircleMode);
  const isLineModeRef = useRef(isLineMode);
  
  useEffect(() => {
    isPointCreationModeRef.current = isPointCreationMode;
  }, [isPointCreationMode]);

  useEffect(() => {
    isCircleModeRef.current = isCircleMode;
  }, [isCircleMode]);

  useEffect(() => {
    isLineModeRef.current = isLineMode;
  }, [isLineMode]);

  useEffect(() => {
    setHistory(currentHistory => 
      currentHistory.map(item => {
        if (!item.data) return item; // Guard against items without data
        
        let newName = item.name;
        switch (item.type) {
          case 'point':
            if (item.data.coords) {
              newName = translated('history.item.point', item.data.coords.x.toFixed(2), item.data.coords.y.toFixed(2));
            }
            break;
          case 'line':
            newName = translated('history.item.line');
            break;
          case 'circle':
            newName = translated('history.item.circle');
            break;
          case 'function':
            if (item.data.polynomial) {
              newName = translated('history.item.function', item.data.polynomial);
            }
            break;
        }
        return { ...item, name: newName };
      })
    );
  }, [language, translated]);

  const handlePointCreated = useCallback(
    (coords: Point, pointObject: any) => {
      if (isCircleModeRef.current) {
        setCirclePointIds((prevIds) => [...prevIds, pointObject.id]);
        setCirclePointCoords((prevCoords) => [...prevCoords, coords]);
      } else if (isLineModeRef.current) {
        setLinePointIds((prevIds) => [...prevIds, pointObject.id]);
        setLinePointCoords((prevCoords) => [...prevCoords, coords]);
      } else if (isPointCreationModeRef.current) {
        const name = translated('history.item.point', coords.x.toFixed(2), coords.y.toFixed(2));
        const newHistoryItem: HistoryItem = { id: pointObject.id, type: 'point', name, data: { coords }, color: selectedColor };
        setHistory(prev => [...prev, newHistoryItem]);
        setIsPointCreationMode(false); // Return to selection mode
      }
    },
    [translated, selectedColor]
  );

  useEffect(() => {
    if (circlePointIds.length === 3) {
      if (boardRef.current) {
        const circle = boardRef.current.drawCircle(circlePointIds);
        if (circle) {
          const name = translated('history.item.circle');
          const pointIds = (circle as any).constructionPoints.map((p: any) => p.id);
          const newHistoryItem: HistoryItem = { id: circle.id, type: 'circle', name, pointIds, data: {}, color: selectedColor };
          setHistory(prev => [...prev, newHistoryItem]);
        }
      }
      setIsCircleMode(false);
      setCirclePointIds([]);
      setCirclePointCoords([]);
    }
  }, [circlePointIds, translated, selectedColor]);

  useEffect(() => {
    if (linePointIds.length === 2) {
      if (boardRef.current) {
        const line = boardRef.current.drawLine(linePointIds);
        if(line) {
          const name = translated('history.item.line');
          const pointIds = (line as any).constructionPoints.map((p: any) => p.id);
          const newHistoryItem: HistoryItem = { id: line.id, type: 'line', name, pointIds, data: {}, color: selectedColor };
          setHistory(prev => [...prev, newHistoryItem]);
        }
      }
      setIsLineMode(false);
      setLinePointIds([]);
      setLinePointCoords([]);
    }
  }, [linePointIds, translated, selectedColor]);
  
  const handleCreatePointClick = () => {
    setIsPointCreationMode(true);
    setIsLineMode(false);
    setLinePointIds([]);
    setLinePointCoords([]);
    setIsCircleMode(false);
    setCirclePointIds([]);
    setCirclePointCoords([]);
  };

  const handleDrawLineClick = () => {
    setIsLineMode(true);
    setLinePointIds([]);
    setLinePointCoords([]);
    setIsCircleMode(false);
    setCirclePointIds([]);
    setCirclePointCoords([]);
    setIsPointCreationMode(false);
  };

  const handleDrawCircleClick = () => {
    setIsCircleMode(true);
    setCirclePointIds([]);
    setCirclePointCoords([]);
    setIsLineMode(false);
    setLinePointIds([]);
    setLinePointCoords([]);
    setIsPointCreationMode(false);
  };

  const handleClearBoard = () => {
    if (boardRef.current) {
      boardRef.current.clearBoard();
      setIsCircleMode(false);
      setCirclePointIds([]);
      setCirclePointCoords([]);
      setIsLineMode(false);
      setLinePointIds([]);
      setLinePointCoords([]);
      setIsPointCreationMode(false);
      setPolynomial('');
      setHistory([]);
    }
  };
  
  const handleXScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setXScale(parseFloat(e.target.value));
  };

  const handleYScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYScale(parseFloat(e.target.value));
  };
  
  const handleResetScale = () => {
    setXScale(1);
    setYScale(1);
  };
  
  const handlePolynomialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolynomial(e.target.value);
  };

  const handlePlotPolynomial = () => {
    if (polynomial.trim() && boardRef.current) {
      const funcGraph = boardRef.current.plotFunction(polynomial);
      if (funcGraph) {
        const name = translated('history.item.function', polynomial);
        const newHistoryItem: HistoryItem = { id: funcGraph.id, type: 'function', name, data: { polynomial }, color: selectedColor };
        setHistory(prev => [...prev, newHistoryItem]);
        setPolynomial('');
      }
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    if (boardRef.current) {
        const itemToRemove = history.find(item => item.id === id);
        boardRef.current.removeObject(id, itemToRemove?.pointIds);
        setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleHighlightHistoryItem = (id: string) => {
    if (boardRef.current) {
        boardRef.current.highlightObject(id);
    }
  }

  const handleUnhighlightHistoryItem = (id: string) => {
      if (boardRef.current) {
          boardRef.current.unhighlightObject(id);
      }
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  }

  const getPromptText = () => {
    if (isCircleMode) {
      return translated('prompt.selectPointForCircle', circlePointCoords.length + 1);
    }
    if (isLineMode) {
      return translated('prompt.selectPointForLine', linePointCoords.length + 1);
    }
    if (isPointCreationMode) {
      return translated('prompt.createPoint');
    }
    return translated('prompt.default');
  }

  return (
    <div className="flex h-screen w-full bg-gray-800 text-gray-100 font-sans">
      <Sidebar
        isPointCreationMode={isPointCreationMode}
        isLineMode={isLineMode}
        isCircleMode={isCircleMode}
        onCreatePoint={handleCreatePointClick}
        onDrawLine={handleDrawLineClick}
        onDrawCircle={handleDrawCircleClick}
        onClearBoard={handleClearBoard}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        polynomial={polynomial}
        onPolynomialChange={handlePolynomialChange}
        onPlotPolynomial={handlePlotPolynomial}
        xScale={xScale}
        yScale={yScale}
        onXScaleChange={handleXScaleChange}
        onYScaleChange={handleYScaleChange}
        onResetScale={handleResetScale}
        history={history}
        onDeleteItem={handleDeleteHistoryItem}
        onHighlightItem={handleHighlightHistoryItem}
        onUnhighlightItem={handleUnhighlightHistoryItem}
        promptText={getPromptText()}
      />
      <main className="flex-grow p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-inner overflow-hidden">
          <JSXGraphBoard
            ref={boardRef}
            onPointCreated={handlePointCreated}
            xScale={xScale}
            yScale={yScale}
            allowPointCreation={isPointCreationMode || isLineMode || isCircleMode}
            selectedColor={selectedColor}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
