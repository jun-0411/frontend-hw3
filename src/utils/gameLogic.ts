/**
 * 2048 게임에서, Map을 특정 방향으로 이동했을 때 결과를 반환하는 함수입니다.
 * @param map 2048 맵. 빈 공간은 null 입니다.
 * @param direction 이동 방향
 * @returns 이동 방향에 따른 결과와 이동되었는지 여부
 */
import type { Cell, Direction, DirectionDegreeMap, Map2048, MoveResult } from '../types';

export const moveMapIn2048Rule = (
  map: Map2048,
  direction: Direction,
): MoveResult => {
  if (!validateMapIsNByM(map)) throw new Error("Map is not N by M");

  const rotatedMap = rotateMapCounterClockwise(map, rotateDegreeMap[direction]);

  const { result, isMoved, score } = moveLeft(rotatedMap);

  return {
    result: rotateMapCounterClockwise(result, revertDegreeMap[direction]),
    isMoved,
    score,
  };
};

const validateMapIsNByM = (map: Map2048) => {
  const firstColumnCount = map[0].length;
  return map.every((row) => row.length === firstColumnCount);
};

const rotateMapCounterClockwise = (
  map: Map2048,
  degree: 0 | 90 | 180 | 270,
): Map2048 => {
  const rowLength = map.length;
  const columnLength = map[0].length;

  switch (degree) {
    case 0:
      return map;
    case 90:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex) => map[rowIndex][columnLength - columnIndex - 1],
        ),
      );
    case 180:
      return Array.from({ length: rowLength }, (_, rowIndex) =>
        Array.from(
          { length: columnLength },
          (_, columnIndex) =>
            map[rowLength - rowIndex - 1][columnLength - columnIndex - 1],
        ),
      );
    case 270:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex) => map[rowLength - rowIndex - 1][columnIndex],
        ),
      );
  }
};

const moveLeft = (map: Map2048): MoveResult => {
  const movedRows = map.map(moveRowLeft);
  const result = movedRows.map((movedRow) => movedRow.result);
  const isMoved = movedRows.some((movedRow) => movedRow.isMoved);
  const totalScore = movedRows.reduce((acc, movedRow) => acc + movedRow.score, 0);
  return { result, isMoved, score: totalScore };
};

const moveRowLeft = (row: Cell[]): { result: Cell[]; isMoved: boolean; score: number } => {
  let score = 0;
  const reduced = row.reduce(
    (acc: { lastCell: Cell; result: Cell[] }, cell) => {
      if (cell === null) {
        return acc;
      } else if (acc.lastCell === null) {
        return { ...acc, lastCell: cell };
      } else if (acc.lastCell === cell) {
        score += cell * 2;
        return { result: [...acc.result, cell * 2], lastCell: null };
      } else {
        return { result: [...acc.result, acc.lastCell], lastCell: cell };
      }
    },
    { lastCell: null, result: [] },
  );

  const result = [...reduced.result, reduced.lastCell];
  const resultRow = Array.from(
    { length: row.length },
    (_, i) => result[i] ?? null,
  );

  return {
    result: resultRow,
    isMoved: row.some((cell, i) => cell !== resultRow[i]),
    score,
  };
};

const rotateDegreeMap: DirectionDegreeMap = {
  up: 90,
  right: 180,
  down: 270,
  left: 0,
};

const revertDegreeMap: DirectionDegreeMap = {
  up: 270,
  right: 180,
  down: 90,
  left: 0,
};

const getEmptyCells = (map: Map2048): { row: number; col: number }[] => {
  const emptyCells: { row: number; col: number }[] = [];
  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  return emptyCells;
};

export const addNewTile = (map: Map2048): Map2048 => {
  const emptyCells = getEmptyCells(map);
  if (emptyCells.length === 0) {
    return map;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];

  const newTileValue = Math.random() < 0.9 ? 2 : 4;

  const newMap = map.map(row => [...row]);
  newMap[randomCell.row][randomCell.col] = newTileValue;

  return newMap;
};


const hasEmptyCells = (map: Map2048): boolean => {
  return map.some(row => row.some(cell => cell === null));
};

const hasPossibleMerges = (map: Map2048): boolean => {
  const rowCount = map.length;
  const colCount = map[0].length;

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const cellValue = map[r][c];
      if (cellValue === null) continue;

      if (c + 1 < colCount && map[r][c + 1] === cellValue) {
        return true;
      }
      if (r + 1 < rowCount && map[r + 1][c] === cellValue) {
        return true;
      }
    }
  }
  return false;
};

export const checkGameStatus = (map: Map2048): 'win' | 'lose' | 'playing' => {
  if (map.some(row => row.some(cell => cell === 128))) {
    return 'win';
  }

  if (!hasEmptyCells(map) && !hasPossibleMerges(map)) {
    return 'lose';
  }

  return 'playing';
};
