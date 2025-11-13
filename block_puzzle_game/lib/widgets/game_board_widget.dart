import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/block_piece.dart';
import '../utils/theme.dart';

class GameBoardWidget extends StatefulWidget {
  final GameBoard board;

  const GameBoardWidget({
    super.key,
    required this.board,
  });

  @override
  State<GameBoardWidget> createState() => _GameBoardWidgetState();
}

class _GameBoardWidgetState extends State<GameBoardWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(GameBoardWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Trigger animation when board updates
    _animationController.forward(from: 0);
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final cellSize = (screenWidth - 48) / widget.board.columns;

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(
          widget.board.rows,
          (row) => Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(
              widget.board.columns,
              (col) => _buildCell(row, col, cellSize),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCell(int row, int col, double size) {
    final cellColor = widget.board.grid[row][col];
    final isEmpty = cellColor == null;

    return Container(
      width: size,
      height: size,
      margin: const EdgeInsets.all(1),
      decoration: BoxDecoration(
        color: isEmpty ? AppTheme.gridColor : cellColor,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(
          color: isEmpty
              ? AppTheme.gridBorderColor
              : cellColor!.withOpacity(0.5),
          width: isEmpty ? 1 : 2,
        ),
        boxShadow: isEmpty
            ? null
            : [
                BoxShadow(
                  color: cellColor!.withOpacity(0.5),
                  blurRadius: 4,
                  spreadRadius: 1,
                ),
              ],
      ),
      child: isEmpty
          ? null
          : Center(
              child: Container(
                width: size * 0.3,
                height: size * 0.3,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
              ),
            ),
    ).animate(controller: _animationController).fadeIn(
          duration: isEmpty ? Duration.zero : AppDurations.short,
        ).scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1, 1),
          duration: isEmpty ? Duration.zero : AppDurations.short,
        );
  }
}
