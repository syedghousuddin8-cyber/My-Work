import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/game_service.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class GameModeSelector extends StatelessWidget {
  final Function(GameMode) onModeSelected;

  const GameModeSelector({
    super.key,
    required this.onModeSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Select Game Mode',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          _buildModeCard(
            context,
            AppStrings.endless,
            AppStrings.endlessDesc,
            Icons.all_inclusive,
            Colors.blue,
            () => onModeSelected(GameMode.endless),
            0,
          ),
          const SizedBox(height: 12),
          _buildModeCard(
            context,
            AppStrings.timed,
            AppStrings.timedDesc,
            Icons.timer,
            Colors.orange,
            () => onModeSelected(GameMode.timed),
            1,
          ),
          const SizedBox(height: 12),
          _buildModeCard(
            context,
            AppStrings.challenge,
            AppStrings.challengeDesc,
            Icons.emoji_events,
            Colors.amber,
            () => onModeSelected(GameMode.challenge),
            2,
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildModeCard(
    BuildContext context,
    String title,
    String description,
    IconData icon,
    Color color,
    VoidCallback onTap,
    int index,
  ) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.backgroundColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 32),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: color,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      description,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.white54),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 100 * index)).slideX(
          begin: 0.3,
          delay: Duration(milliseconds: 100 * index),
        );
  }
}
