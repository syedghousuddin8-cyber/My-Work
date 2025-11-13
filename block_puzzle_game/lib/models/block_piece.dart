import 'dart:math';
import 'package:flutter/material.dart';

class BlockPiece {
  final List<List<int>> shape;
  final Color color;
  final int id;

  BlockPiece({
    required this.shape,
    required this.color,
    required this.id,
  });

  int get width => shape[0].length;
  int get height => shape.length;

  int get blockCount {
    int count = 0;
    for (var row in shape) {
      for (var cell in row) {
        if (cell == 1) count++;
      }
    }
    return count;
  }

  BlockPiece copyWith({
    List<List<int>>? shape,
    Color? color,
    int? id,
  }) {
    return BlockPiece(
      shape: shape ?? this.shape,
      color: color ?? this.color,
      id: id ?? this.id,
    );
  }
}

class BlockPieceFactory {
  static final Random _random = Random();

  static final List<List<List<int>>> _pieceShapes = [
    // Single block
    [
      [1]
    ],

    // 2-block pieces
    [
      [1, 1]
    ],
    [
      [1],
      [1]
    ],

    // 3-block pieces
    [
      [1, 1, 1]
    ],
    [
      [1],
      [1],
      [1]
    ],
    [
      [1, 1],
      [1, 0]
    ],
    [
      [1, 1],
      [0, 1]
    ],
    [
      [1, 0],
      [1, 1]
    ],
    [
      [0, 1],
      [1, 1]
    ],

    // 4-block pieces
    [
      [1, 1, 1, 1]
    ],
    [
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [1, 0, 0],
      [1, 1, 1]
    ],
    [
      [0, 0, 1],
      [1, 1, 1]
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1]
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0]
    ],

    // 5-block pieces
    [
      [1, 1, 1, 1, 1]
    ],
    [
      [1],
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1]
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1]
    ],

    // L-shapes
    [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    [
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 1],
      [0, 0, 1]
    ],

    // T-shapes
    [
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1]
    ],

    // Z-shapes
    [
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1, 1],
      [1, 1, 0]
    ],

    // 3x3 patterns
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
  ];

  static final List<Color> _pieceColors = [
    const Color(0xFF00BCD4), // Cyan
    const Color(0xFF2196F3), // Blue
    const Color(0xFF9C27B0), // Purple
    const Color(0xFFE91E63), // Pink
    const Color(0xFFF44336), // Red
    const Color(0xFFFF9800), // Orange
    const Color(0xFFFFEB3B), // Yellow
    const Color(0xFF4CAF50), // Green
    const Color(0xFF00E676), // Light Green
    const Color(0xFF1DE9B6), // Teal
  ];

  static BlockPiece createRandomPiece({int? pieceId}) {
    final shapeIndex = _random.nextInt(_pieceShapes.length);
    final colorIndex = _random.nextInt(_pieceColors.length);

    return BlockPiece(
      shape: _pieceShapes[shapeIndex].map((row) => List<int>.from(row)).toList(),
      color: _pieceColors[colorIndex],
      id: pieceId ?? _random.nextInt(1000000),
    );
  }

  static List<BlockPiece> createRandomSet({int count = 3}) {
    return List.generate(count, (index) => createRandomPiece(pieceId: index));
  }

  static BlockPiece createSpecificPiece(int shapeIndex, {int? colorIndex}) {
    final index = shapeIndex % _pieceShapes.length;
    final color = colorIndex != null
        ? _pieceColors[colorIndex % _pieceColors.length]
        : _pieceColors[_random.nextInt(_pieceColors.length)];

    return BlockPiece(
      shape: _pieceShapes[index].map((row) => List<int>.from(row)).toList(),
      color: color,
      id: _random.nextInt(1000000),
    );
  }

  static int get totalShapes => _pieceShapes.length;
}

class GameBoard {
  final int rows;
  final int columns;
  late List<List<Color?>> grid;

  GameBoard({this.rows = 8, this.columns = 8}) {
    grid = List.generate(
      rows,
      (_) => List.generate(columns, (_) => null),
    );
  }

  bool canPlacePiece(BlockPiece piece, int row, int col) {
    for (int r = 0; r < piece.height; r++) {
      for (int c = 0; c < piece.width; c++) {
        if (piece.shape[r][c] == 1) {
          final boardRow = row + r;
          final boardCol = col + c;

          if (boardRow < 0 ||
              boardRow >= rows ||
              boardCol < 0 ||
              boardCol >= columns) {
            return false;
          }

          if (grid[boardRow][boardCol] != null) {
            return false;
          }
        }
      }
    }
    return true;
  }

  void placePiece(BlockPiece piece, int row, int col) {
    for (int r = 0; r < piece.height; r++) {
      for (int c = 0; c < piece.width; c++) {
        if (piece.shape[r][c] == 1) {
          grid[row + r][col + c] = piece.color;
        }
      }
    }
  }

  List<int> clearCompleteLines() {
    List<int> clearedLines = [];

    // Check rows
    for (int r = 0; r < rows; r++) {
      if (grid[r].every((cell) => cell != null)) {
        clearedLines.add(r);
        for (int c = 0; c < columns; c++) {
          grid[r][c] = null;
        }
      }
    }

    // Check columns
    for (int c = 0; c < columns; c++) {
      bool isComplete = true;
      for (int r = 0; r < rows; r++) {
        if (grid[r][c] == null) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        clearedLines.add(rows + c);
        for (int r = 0; r < rows; r++) {
          grid[r][c] = null;
        }
      }
    }

    return clearedLines;
  }

  void clear() {
    grid = List.generate(
      rows,
      (_) => List.generate(columns, (_) => null),
    );
  }

  int get filledCells {
    int count = 0;
    for (var row in grid) {
      for (var cell in row) {
        if (cell != null) count++;
      }
    }
    return count;
  }

  GameBoard clone() {
    final newBoard = GameBoard(rows: rows, columns: columns);
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < columns; c++) {
        newBoard.grid[r][c] = grid[r][c];
      }
    }
    return newBoard;
  }
}
