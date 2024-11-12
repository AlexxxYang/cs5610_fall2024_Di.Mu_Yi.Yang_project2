import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GameContext = createContext();
const STORAGE_KEY = 'minesweeper_game_state';

const GameProvider = (props) => {
  const location = useLocation();
  const [boardSize, setBoardSize] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);
  const [minesCount, setMinesCount] = useState(0);
  const [gameBoardState, setGameBoardState] = useState({});
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [revealedSquares, setRevealedSquares] = useState(0);
  const [totalEmptySquares, setTotalEmptySquares] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flaggedCells, setFlaggedCells] = useState(new Set());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const calculateBoardDimensions = (difficulty) => {
    const isMobile = windowWidth < 768;
    
    switch(difficulty) {
      case 'medium':
        return {
          width: isMobile ? 12 : 16,
          height: isMobile ? 20 : 16,
          mines: 40
        };
      case 'hard':
        return {
          width: isMobile ? 12 : 30,
          height: isMobile ? 25 : 16,
          mines: 99
        };
      case 'easy':
      default:
        return {
          width: 8,
          height: 8,
          mines: 10
        };
    }
  };


  const serializeGameState = () => {
    return {
      boardSize,
      boardHeight,
      minesCount,
      gameBoardState,
      isGameOver,
      playerWon,
      revealedSquares,
      totalEmptySquares,
      isFirstClick,
      flaggedCells: Array.from(flaggedCells),
      difficulty: location.pathname.split('/').pop(),
      lastUpdated: new Date().getTime()
    };
  };


  const deserializeGameState = (savedState) => {
    if (!savedState) return null;
    
    return {
      ...savedState,
      flaggedCells: new Set(savedState.flaggedCells)
    };
  };


  const saveGameState = () => {
    if (isGameOver) return;
    const gameState = serializeGameState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  };

 
  const loadGameState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return null;
    
    const parsedState = deserializeGameState(JSON.parse(savedState));
    const currentDifficulty = location.pathname.split('/').pop();
    
  
    if (parsedState.difficulty === currentDifficulty && 
        (new Date().getTime() - parsedState.lastUpdated) < 24 * 60 * 60 * 1000) {
      return parsedState;
    }
    return null;
  };

  const clearSavedGame = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const calculateAdjacentMines = (row, col, gameState, width, height) => {
    let count = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < height && 
          newCol >= 0 && newCol < width && 
          gameState[`${newRow}-${newCol}`].containsMine) {
        count++;
      }
    }
    return count;
  };

  const getAdjacentCells = (row, col) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    return directions
      .map(([dx, dy]) => [row + dx, col + dy])
      .filter(([newRow, newCol]) => 
        newRow >= 0 && newRow < boardHeight && 
        newCol >= 0 && newCol < boardSize
      );
  };

  const placeMines = (gameState, width, height, mines, avoidRow = -1, avoidCol = -1) => {
   
    if (avoidRow !== -1 && avoidCol !== -1) {
      for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
          gameState[`${i}-${j}`].containsMine = false;
          gameState[`${i}-${j}`].adjacentMines = 0;
        }
      }
    }

    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * height);
      const col = Math.floor(Math.random() * width);
      
    
      if ((row === avoidRow && col === avoidCol) || 
          gameState[`${row}-${col}`].containsMine) {
        continue;
      }
      
      gameState[`${row}-${col}`].containsMine = true;
      minesPlaced++;
    }

    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!gameState[`${i}-${j}`].containsMine) {
          gameState[`${i}-${j}`].adjacentMines = calculateAdjacentMines(i, j, gameState, width, height);
        }
      }
    }
  };

  const initializeGame = (difficulty) => {
    const savedState = loadGameState();
    
    if (savedState) {
      setBoardSize(savedState.boardSize);
      setBoardHeight(savedState.boardHeight);
      setMinesCount(savedState.minesCount);
      setGameBoardState(savedState.gameBoardState);
      setIsGameOver(savedState.isGameOver);
      setPlayerWon(savedState.playerWon);
      setRevealedSquares(savedState.revealedSquares);
      setTotalEmptySquares(savedState.totalEmptySquares);
      setIsFirstClick(savedState.isFirstClick);
      setFlaggedCells(savedState.flaggedCells);
      return;
    }


    const { width, height, mines } = calculateBoardDimensions(difficulty);

    setBoardSize(width);
    setBoardHeight(height);
    setMinesCount(mines);
    setTotalEmptySquares((width * height) - mines);
    setIsGameOver(false);
    setPlayerWon(false);
    setRevealedSquares(0);
    setIsFirstClick(true);
    setFlaggedCells(new Set());

    const gameState = {};
    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        gameState[`${i}-${j}`] = {
          containsMine: false,
          adjacentMines: 0,
          revealed: false
        };
      }
    }

    placeMines(gameState, width, height, mines);
    setGameBoardState(gameState);
  };

  const revealEmptyCells = (row, col, newState, newlyRevealed = new Set()) => {
    const key = `${row}-${col}`;
    
    if (newState[key].revealed || newState[key].containsMine) {
      return newlyRevealed;
    }

    newState[key].revealed = true;
    newlyRevealed.add(key);

    if (newState[key].adjacentMines === 0) {
      const adjacentCells = getAdjacentCells(row, col);
      for (const [newRow, newCol] of adjacentCells) {
        if (!newState[`${newRow}-${newCol}`].revealed) {
          revealEmptyCells(newRow, newCol, newState, newlyRevealed);
        }
      }
    }

    return newlyRevealed;
  };

  const revealSquare = (row, col) => {
    if (isGameOver || gameBoardState[`${row}-${col}`].revealed) return;

    const newState = { ...gameBoardState };
    
    if (isFirstClick) {
      setIsFirstClick(false);
     
      if (newState[`${row}-${col}`].containsMine) {
        placeMines(newState, boardSize, boardHeight, minesCount, row, col);
      }
    }

    if (newState[`${row}-${col}`].containsMine) {
     
      newState[`${row}-${col}`].revealed = true;
      setGameBoardState(newState);
      setIsGameOver(true);
      clearSavedGame();
      return;
    }

    const newlyRevealed = revealEmptyCells(row, col, newState);
    setGameBoardState(newState);

    const newRevealedCount = revealedSquares + newlyRevealed.size;
    setRevealedSquares(newRevealedCount);

  
    if (newRevealedCount === totalEmptySquares) {
      setPlayerWon(true);
      setIsGameOver(true);
      clearSavedGame();
    }
  };

  const toggleFlag = (row, col) => {
    if (isGameOver) return;
    
    const cellKey = `${row}-${col}`;
    const newFlaggedCells = new Set(flaggedCells);
    
    if (newFlaggedCells.has(cellKey)) {
      newFlaggedCells.delete(cellKey);
    } else if (!gameBoardState[cellKey].revealed) {
      newFlaggedCells.add(cellKey);
    }
    
    setFlaggedCells(newFlaggedCells);
  };

  const resetGame = () => {
    clearSavedGame();
    const difficulty = location.pathname.split('/').pop();
    initializeGame(difficulty);
  };

 
  useEffect(() => {
    if (Object.keys(gameBoardState).length > 0) {
      saveGameState();
    }
  }, [gameBoardState, flaggedCells, isGameOver, playerWon]);

 
  useEffect(() => {
    const difficulty = location.pathname.split('/').pop();
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
      initializeGame(difficulty);
    }
  }, [location]);

  
  useEffect(() => {
    const difficulty = location.pathname.split('/').pop();
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
   
      if (isFirstClick || isGameOver) {
        initializeGame(difficulty);
      }
    }
  }, [windowWidth]);

  return (
    <GameContext.Provider value={{
      gameBoardState,
      isGameOver,
      playerWon,
      revealSquare,
      resetGame,
      boardSize,
      boardHeight,
      minesCount,
      flaggedCells,
      toggleFlag,
      windowWidth
    }}>
      {props.children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
export default GameProvider;