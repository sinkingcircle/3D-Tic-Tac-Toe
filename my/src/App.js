import { useState, useRef, useEffect } from "react";
import './App.css';

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button 
      className={`square ${isWinner ? 'winner' : ''}`} 
      onClick={onSquareClick} 
      style={{transform: `translateZ(${value ? '15px' : '5px'})`}}
    >
      {value}
    </button>
  );
}

function Board({ xRotation, zRotation }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];
  
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(square => square)) {
    status = "Draw!";
  } else {
    status = `Current turn: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board" style={{transform: `rotateX(${xRotation}deg) rotateZ(${zRotation}deg)`}}>
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            isWinner={winningLine.includes(i)}
          />
        ))}
      </div>
      <button className="reset-button" onClick={handleReset}>Reset Game</button>
    </div>
  );
}

function DraggableControls({ xRotation, setXRotation, zRotation, setZRotation }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const controlsRef = useRef(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      controls.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('controls-header')) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition(prevPosition => ({
        x: prevPosition.x + e.movementX,
        y: prevPosition.y + e.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="controls"
      ref={controlsRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="controls-header">Controls (Drag to move)</div>
      <div className="control">
        <label htmlFor="x-rotation">X Rotation: {xRotation}°</label>
        <input
          type="range"
          id="x-rotation"
          min="0"
          max="90"
          value={xRotation}
          onChange={(e) => setXRotation(Number(e.target.value))}
        />
      </div>
      <div className="control">
        <label htmlFor="z-rotation">Z Rotation: {zRotation}°</label>
        <input
          type="range"
          id="z-rotation"
          min="-45"
          max="45"
          value={zRotation}
          onChange={(e) => setZRotation(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default function Game() {
  const [xRotation, setXRotation] = useState(30);
  const [zRotation, setZRotation] = useState(-10);

  return (
    <div className="game">
      <h1>3D Tic-Tac-Toe</h1>
        <p> By Vikranth Jagdish </p>
      <div className="game-container">
        <div className="board-container">
          <Board xRotation={xRotation} zRotation={zRotation} />
        </div>
        <DraggableControls 
          xRotation={xRotation} 
          setXRotation={setXRotation} 
          zRotation={zRotation} 
          setZRotation={setZRotation}
        />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }
  return null;
}
