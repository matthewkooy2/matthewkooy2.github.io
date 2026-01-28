"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Cell = 0 | 1;

const COLS = 10;
const ROWS = 18;

// Tetriminos (4x4) in 4 rotations (0,1,2,3)
const SHAPES: Record<string, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  T: [
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
};

const PIECES = Object.keys(SHAPES);

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0 as Cell)
  );
}

function cloneBoard(b: Cell[][]): Cell[][] {
  return b.map((r) => r.slice()) as Cell[][];
}

function randPiece() {
  const type = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { type, rot: 0, x: Math.floor(COLS / 2) - 2, y: -1 };
}

function collides(
  board: Cell[][],
  piece: ReturnType<typeof randPiece>,
  dx = 0,
  dy = 0,
  drot = 0
) {
  const rot = (piece.rot + drot + 4) % 4;
  const shape = SHAPES[piece.type][rot];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!shape[r][c]) continue;
      const x = piece.x + c + dx;
      const y = piece.y + r + dy;
      if (x < 0 || x >= COLS) return true;
      if (y >= ROWS) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  }
  return false;
}

function merge(board: Cell[][], piece: ReturnType<typeof randPiece>) {
  const b = cloneBoard(board);
  const shape = SHAPES[piece.type][piece.rot];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!shape[r][c]) continue;
      const x = piece.x + c;
      const y = piece.y + r;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) b[y][x] = 1;
    }
  }
  return b;
}

function clearLines(board: Cell[][]) {
  let cleared = 0;
  const next: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every((v) => v === 1)) {
      cleared++;
    } else {
      next.push(board[r]);
    }
  }
  while (next.length < ROWS)
    next.unshift(Array.from({ length: COLS }, () => 0 as Cell));
  return { board: next, cleared };
}

export default function TetrisMini() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard());
  const [piece, setPiece] = useState(() => randPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  // Size canvas to the card nicely
  const cell = 14;
  const W = COLS * cell;
  const H = ROWS * cell;

  const overlay = useMemo(() => {
    const b = cloneBoard(board);
    const shape = SHAPES[piece.type][piece.rot];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!shape[r][c]) continue;
        const x = piece.x + c;
        const y = piece.y + r;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) b[y][x] = 1;
      }
    }
    return b;
  }, [board, piece]);

  function lockAndSpawn(
    currPiece: ReturnType<typeof randPiece>,
    currBoard: Cell[][]
  ) {
    const merged = merge(currBoard, currPiece);
    const { board: clearedBoard, cleared } = clearLines(merged);

    if (cleared) {
      setLines((L) => L + cleared);
      setScore((S) => S + [0, 100, 300, 500, 800][cleared]);
    }

    setBoard(clearedBoard);

    const next = randPiece();
    if (collides(clearedBoard, next, 0, 0, 0)) {
      setIsGameOver(true);
      return next;
    }
    return next;
  }

  function reset() {
    setBoard(emptyBoard());
    setPiece(randPiece());
    setScore(0);
    setLines(0);
    setIsPaused(false);
    setIsGameOver(false);
  }

  // Game loop: gravity tick
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const interval = window.setInterval(() => {
      setPiece((p) => {
        if (!collides(board, p, 0, 1, 0)) return { ...p, y: p.y + 1 };
        // lock piece
        return lockAndSpawn(p, board);
      });
    }, 450);

    return () => window.clearInterval(interval);
  }, [board, isPaused, isGameOver]);

  // Canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cell;
        const y = r * cell;

        if (overlay[r][c]) {
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.06)";
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }
    }
  }, [overlay, W, H, cell]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!hasFocus) return;

    const k = e.key;

    if (
      k === "ArrowLeft" ||
      k === "ArrowRight" ||
      k === "ArrowDown" ||
      k === "ArrowUp" ||
      k === " "
    ) {
      e.preventDefault();
    }

    if (k === "p" || k === "P") {
      setIsPaused((v) => !v);
      return;
    }
    if (k === "r" || k === "R") {
      reset();
      return;
    }

    if (isPaused || isGameOver) return;

    setPiece((p) => {
      if (k === "ArrowLeft" && !collides(board, p, -1, 0, 0))
        return { ...p, x: p.x - 1 };
      if (k === "ArrowRight" && !collides(board, p, 1, 0, 0))
        return { ...p, x: p.x + 1 };
      if (k === "ArrowDown" && !collides(board, p, 0, 1, 0))
        return { ...p, y: p.y + 1 };

      if (k === "ArrowUp") {
        if (!collides(board, p, 0, 0, 1))
          return { ...p, rot: (p.rot + 1) % 4 };
        if (!collides(board, p, -1, 0, 1))
          return { ...p, x: p.x - 1, rot: (p.rot + 1) % 4 };
        if (!collides(board, p, 1, 0, 1))
          return { ...p, x: p.x + 1, rot: (p.rot + 1) % 4 };
        return p;
      }

      if (k === " ") {
        // Hard drop, then lock immediately
        let y = p.y;
        while (!collides(board, p, 0, y - p.y + 1, 0)) y++;
        const dropped = { ...p, y };
        return lockAndSpawn(dropped, board);
      }

      return p;
    });
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      onMouseDown={() => containerRef.current?.focus()}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur outline-none"
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/25 via-fuchsia-500/15 to-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/18 via-indigo-500/12 to-transparent blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-50">Mini Tetris</p>
          <p className="mt-1 text-xs text-zinc-400">
            rotate(↑) drop(space) pause(P) reset(R)
          </p>
        </div>

        <div className="text-right text-xs text-zinc-300">
          <div>
            Score: <span className="font-semibold text-white">{score}</span>
          </div>
          <div>
            Lines: <span className="font-semibold text-white">{lines}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-xl border border-white/10 bg-black/30"
        />

        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/10 bg-black/55 text-center">
            <div>
              <div className="text-lg font-semibold text-white">
                {isGameOver ? "Game Over" : "Paused"}
              </div>
              <div className="mt-1 text-sm text-zinc-300">
                Press {isGameOver ? "R to restart" : "P to resume"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-4 flex gap-2">
        <button
          onClick={() => setIsPaused((v) => !v)}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white hover:bg-white/[0.10]"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={reset}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white hover:bg-white/[0.10]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
