import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from './GameProvider';
import './Cell.css';

export default function Cell({ row, column }) {
  const { 
    gameBoardState, 
    isGameOver, 
    revealSquare, 
    flaggedCells,
    toggleFlag 
  } = useContext(GameContext);

  
  const [isShiftHeld, setIsShiftHeld] = useState(false);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setIsShiftHeld(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setIsShiftHeld(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

   
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleClick = (e) => {
    const cellKey = `${row}-${column}`;
    if (isGameOver || gameBoardState[cellKey].revealed) return;
    
    
    if (e.shiftKey || isShiftHeld) {
      if (!gameBoardState[cellKey].revealed) {
        toggleFlag(row, column);
      }
      return;
    }

  
    if (!flaggedCells.has(cellKey)) {
      revealSquare(row, column);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault(); 
    if (!isGameOver && !gameBoardState[`${row}-${column}`].revealed) {
      toggleFlag(row, column);
    }
  };

  const cellData = gameBoardState[`${row}-${column}`] || {};
  const isRevealed = cellData.revealed;
  const isFlagged = flaggedCells.has(`${row}-${column}`);

  const getCellContent = () => {
    if (isRevealed) {
      if (cellData.containsMine) {
        return '💣';
      }
      return cellData.adjacentMines > 0 ? cellData.adjacentMines : '';
    }
    if (isFlagged) {
      return '🚩';
    }
    return '';
  };

  const content = getCellContent();

  return (
    <div
      className={`square ${isRevealed ? 'revealed' : ''} ${isFlagged ? 'flagged' : ''}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      data-mines={isRevealed && !cellData.containsMine ? cellData.adjacentMines : ''}
    >
      {content}
    </div>
  );
}