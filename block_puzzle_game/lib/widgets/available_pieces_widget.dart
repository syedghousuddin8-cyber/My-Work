import 'package:flutter/material.dart';
import '../models/block_piece.dart';
import '../services/game_service.dart';
import 'package:provider/provider.dart';

class AvailablePiecesWidget extends StatelessWidget {
  final List<BlockPiece> pieces;
  final Function(BlockPiece, int, int) onPiecePlaced;

  const AvailablePiecesWidget({
    super.key,
    required this.pieces,
    required this.onPiecePlaced,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: pieces.map((piece) {
          return Expanded(
            child: Center(
              child: DraggablePiece(
                piece: piece,
                onPiecePlaced: onPiecePlaced,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class DraggablePiece extends StatefulWidget {
  final BlockPiece piece;
  final Function(BlockPiece, int, int) onPiecePlaced;

  const DraggablePiece({
    super.key,
    required this.piece,
    required this.onPiecePlaced,
  });

  @override
  State<DraggablePiece> createState() => _DraggablePieceState();
}

class _DraggablePieceState extends State<DraggablePiece> {
  bool _isBeingDragged = false;

  @override
  Widget build(BuildContext context) {
    return Draggable<BlockPiece>(
      data: widget.piece,
      feedback: Material(
        color: Colors.transparent,
        child: Opacity(
          opacity: 0.8,
          child: PieceWidget(piece: widget.piece, scale: 1.2),
        ),
      ),
      childWhenDragging: Opacity(
        opacity: 0.3,
        child: PieceWidget(piece: widget.piece),
      ),
      onDragStarted: () {
        setState(() => _isBeingDragged = true);
      },
      onDragEnd: (details) {
        setState(() => _isBeingDragged = false);
      },
      child: AnimatedScale(
        scale: _isBeingDragged ? 1.1 : 1.0,
        duration: const Duration(milliseconds: 200),
        child: PieceWidget(piece: widget.piece),
      ),
    );
  }
}

class PieceWidget extends StatelessWidget {
  final BlockPiece piece;
  final double scale;

  const PieceWidget({
    super.key,
    required this.piece,
    this.scale = 1.0,
  });

  @override
  Widget build(BuildContext context) {
    final cellSize = 20.0 * scale;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        piece.height,
        (row) => Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(
            piece.width,
            (col) {
              final isBlock = piece.shape[row][col] == 1;
              return Container(
                width: cellSize,
                height: cellSize,
                margin: const EdgeInsets.all(1),
                decoration: BoxDecoration(
                  color: isBlock ? piece.color : Colors.transparent,
                  borderRadius: BorderRadius.circular(3),
                  boxShadow: isBlock
                      ? [
                          BoxShadow(
                            color: piece.color.withOpacity(0.5),
                            blurRadius: 4,
                            spreadRadius: 1,
                          ),
                        ]
                      : null,
                ),
                child: isBlock
                    ? Center(
                        child: Container(
                          width: cellSize * 0.3,
                          height: cellSize * 0.3,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.3),
                            shape: BoxShape.circle,
                          ),
                        ),
                      )
                    : null,
              );
            },
          ),
        ),
      ),
    );
  }
}

class BoardDropTarget extends StatelessWidget {
  final GameBoard board;
  final int row;
  final int col;
  final Function(BlockPiece, int, int) onPiecePlaced;

  const BoardDropTarget({
    super.key,
    required this.board,
    required this.row,
    required this.col,
    required this.onPiecePlaced,
  });

  @override
  Widget build(BuildContext context) {
    return DragTarget<BlockPiece>(
      onWillAccept: (piece) {
        if (piece == null) return false;
        return board.canPlacePiece(piece, row, col);
      },
      onAccept: (piece) {
        onPiecePlaced(piece, row, col);
      },
      builder: (context, candidateData, rejectedData) {
        final isHighlighted = candidateData.isNotEmpty;
        return Container(
          decoration: BoxDecoration(
            border: isHighlighted
                ? Border.all(color: Colors.green, width: 2)
                : null,
          ),
        );
      },
    );
  }
}
