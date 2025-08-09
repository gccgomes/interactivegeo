

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Point } from '../types';
import { useLanguage } from '../i18n';

// JSXGraph is loaded from a script tag in index.html, so we access it via the window object.
// We declare a global interface to provide some type information.
declare global {
  interface Window {
    JXG: any;
    Math: any;
  }
}

interface JSXGraphBoardProps {
  onPointCreated: (coords: Point, pointObject: any) => void;
  xScale: number;
  yScale: number;
  allowPointCreation: boolean;
  selectedColor: string;
}

export interface BoardHandles {
  clearBoard: () => void;
  drawCircle: (pointIds: string[]) => any | null;
  drawLine: (pointIds: string[]) => any | null;
  plotFunction: (expression: string) => any | null;
  removeObject: (id: string, pointIds?: string[]) => void;
  highlightObject: (id: string) => void;
  unhighlightObject: (id: string) => void;
}

const BOARD_ID = 'jxgbox';
// We'll base our proportions on the Y-axis radius.
const INITIAL_Y_RADIUS = 10; 
// The initial X radius is now dynamic, so we'll just have a default for the ref.
const INITIAL_X_RADIUS = 10;

const JSXGraphBoard = forwardRef<BoardHandles, JSXGraphBoardProps>(({ onPointCreated, xScale, yScale, allowPointCreation, selectedColor }, ref) => {
  const { translated } = useLanguage();
  const boardRef = useRef<any>(null); // To hold the JSXGraph board instance
  // Ref to store the proportional X radius based on container aspect ratio
  const proportionalXRadiusRef = useRef<number>(INITIAL_X_RADIUS);
  // Ref to store current scales for use in the resize handler, avoiding stale closures
  const scaleRef = useRef({ x: xScale, y: yScale });
  
  const onPointCreatedRef = useRef(onPointCreated);
  useEffect(() => {
    onPointCreatedRef.current = onPointCreated;
  }, [onPointCreated]);
  
  const allowCreationRef = useRef(allowPointCreation);
  
  // Ref to hold the selectedColor for use inside callbacks that shouldn't depend on it.
  const selectedColorRef = useRef(selectedColor);
  useEffect(() => {
      selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    scaleRef.current = { x: xScale, y: yScale };
  }, [xScale, yScale]);
  
  useEffect(() => {
    allowCreationRef.current = allowPointCreation;
  }, [allowPointCreation]);

  // Effect to apply scaling when sliders are moved
  useEffect(() => {
    if (boardRef.current) {
        const currentBBox = boardRef.current.getBoundingBox();
        const centerX = (currentBBox[0] + currentBBox[2]) / 2;
        const centerY = (currentBBox[1] + currentBBox[3]) / 2;

        const newXRadius = proportionalXRadiusRef.current / xScale;
        const newYRadius = INITIAL_Y_RADIUS / yScale;

        const newBoundingBox = [
            centerX - newXRadius,
            centerY + newYRadius,
            centerX + newXRadius,
            centerY - newYRadius
        ];
        boardRef.current.setBoundingBox(newBoundingBox, false);
    }
  }, [xScale, yScale]);

  const initBoard = useCallback(() => {
    const JXG = window.JXG;
    if (!JXG) {
      console.error("JSXGraph library not found.");
      return;
    }
    
    const container = document.getElementById(BOARD_ID);
    if (!container || container.clientHeight === 0) {
        return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspectRatio = width / height;
    const xRadius = INITIAL_Y_RADIUS * aspectRatio;
    proportionalXRadiusRef.current = xRadius;

    if (boardRef.current && boardRef.current.jc) {
        JXG.JSXGraph.freeBoard(boardRef.current);
    }

    const board = JXG.JSXGraph.initBoard(BOARD_ID, {
      boundingbox: [-xRadius, INITIAL_Y_RADIUS, xRadius, -INITIAL_Y_RADIUS],
      axis: true,
      grid: true,
      showCopyright: false,
      showNavigation: true,
      pan: {
        enabled: true,
        needShift: false, 
      },
      zoom: {
        factorX: 1.25,
        factorY: 1.25,
        wheel: true,
        needShift: false,
      },
    });

    board.on('up', (e: MouseEvent) => {
      if (allowCreationRef.current && !e.shiftKey) {
        const coords = board.getUsrCoordsOfMouse(e);
        const point = board.create('point', [coords[0], coords[1]], {
          name: '',
          size: 2,
          face: 'o',
          color: selectedColorRef.current
        });
        onPointCreatedRef.current({ x: coords[0], y: coords[1] }, point);
      }
    });

    boardRef.current = board;
  }, []); // Dependency array is now empty to prevent re-initialization

  useImperativeHandle(ref, () => ({
    clearBoard() {
      initBoard();
    },
    drawCircle(pointIds: string[]) {
      if (boardRef.current && pointIds.length === 3) {
          const points = pointIds.map(id => boardRef.current.objects[id]).filter(Boolean);
          if (points.length < 3) return null; // Defensive check in case a point was deleted

          const circle = boardRef.current.create('circumcircle', points, {
              strokeColor: selectedColor,
              strokeWidth: 2,
              fillColor: selectedColor,
              fillOpacity: 0.2
          });
          // Tag the circle with its construction points for proper removal.
          (circle as any).constructionPoints = points;
          return circle;
      }
      return null;
    },
    drawLine(pointIds: string[]) {
      if (boardRef.current && pointIds.length === 2) {
          const points = pointIds.map(id => boardRef.current.objects[id]).filter(Boolean);
          if (points.length < 2) return null; // Defensive check

          const line = boardRef.current.create('line', points, {
              strokeColor: selectedColor,
              strokeWidth: 2,
          });
          // Tag the line with its construction points for proper removal.
          (line as any).constructionPoints = points;
          return line;
      }
      return null;
    },
    plotFunction(expression: string) {
      if (boardRef.current) {
        let processedExpression = expression.trim();
        try {
          if (!processedExpression) return null;
          
          processedExpression = processedExpression.toLowerCase();

          const constants: { [key: string]: number } = {
            'e': Math.E,
            'pi': Math.PI,
            'π': Math.PI,
            'phi': (1 + Math.sqrt(5)) / 2, // Golden Ratio
            'φ': (1 + Math.sqrt(5)) / 2,
          };

          for (const [name, value] of Object.entries(constants)) {
            // Use word boundary \b to only match standalone constants (e.g. 'e' but not 'exp')
            const regex = new RegExp(`\\b${name}\\b`, 'g');
            processedExpression = processedExpression.replace(regex, `(${value.toString()})`);
          }

          const superMap: { [key:string]: string } = {
            '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
            '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9'
          };
          processedExpression = processedExpression.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, match => superMap[match]);

          processedExpression = processedExpression.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
          processedExpression = processedExpression.replace(/(\))([a-zA-Z(])/g, '$1*$2');
          
          const funcGraph = boardRef.current.create('functiongraph', [processedExpression], {
            strokeColor: selectedColor,
            strokeWidth: 2,
          });
          return funcGraph;
        } catch (error) {
          console.error("Error plotting function:", error);
          alert(translated('plotter.error.alert', expression, processedExpression));
          return null;
        }
      }
      return null;
    },
    removeObject(id: string, pointIds?: string[]) {
        if (boardRef.current && id) {
            const mainObject = boardRef.current.objects[id];
            const allObjectsToRemove: any[] = [];

            if (mainObject) {
                allObjectsToRemove.push(mainObject);
            }
    
            if (pointIds && pointIds.length > 0) {
                pointIds.forEach(pid => {
                    const point = boardRef.current.objects[pid];
                    if (point) {
                        allObjectsToRemove.push(point);
                    }
                });
            } else if (mainObject && (mainObject as any).constructionPoints) {
                 allObjectsToRemove.push(...(mainObject as any).constructionPoints);
            }
    
            if (allObjectsToRemove.length > 0) {
                const uniqueObjects = [...new Set(allObjectsToRemove)];
                boardRef.current.removeObject(uniqueObjects, false);
            }
        }
    },
    highlightObject(id: string) {
        if (boardRef.current && id) {
            const obj = boardRef.current.objects[id];
            if (obj) {
                obj.setAttribute({
                    highlight: true,
                    highlightStrokeColor: '#fbbf24', // amber-400
                });
            }
        }
    },
    unhighlightObject(id: string) {
        if (boardRef.current && id) {
            const obj = boardRef.current.objects[id];
            if (obj) {
                obj.setAttribute({
                    highlight: false
                });
            }
        }
    }
  }), [translated, initBoard, selectedColor]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        initBoard();
    }, 0);

    const handleResize = () => {
        const container = document.getElementById(BOARD_ID);
        if(boardRef.current && container) {
            boardRef.current.resizeContainer(
                container.clientWidth,
                container.clientHeight
            );
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (height > 0) {
              const aspectRatio = width / height;
              proportionalXRadiusRef.current = INITIAL_Y_RADIUS * aspectRatio;
              
              const { x: currentXScale, y: currentYScale } = scaleRef.current;
              
              const currentBBox = boardRef.current.getBoundingBox();
              const centerX = (currentBBox[0] + currentBBox[2]) / 2;
              const centerY = (currentBBox[1] + currentBBox[3]) / 2;

              const newXRadius = proportionalXRadiusRef.current / currentXScale;
              const newYRadius = INITIAL_Y_RADIUS / currentYScale;
              
              const newBoundingBox = [
                  centerX - newXRadius,
                  centerY + newYRadius,
                  centerX + newXRadius,
                  centerY - newYRadius
              ];
              boardRef.current.setBoundingBox(newBoundingBox, false);
            }
        }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (boardRef.current) {
        window.JXG.JSXGraph.freeBoard(boardRef.current);
      }
    };
  }, [initBoard]);

  return (
    <div id={BOARD_ID} className="jxgbox w-full h-full" />
  );
});

export default JSXGraphBoard;