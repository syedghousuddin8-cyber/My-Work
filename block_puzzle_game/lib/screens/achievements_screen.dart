import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/storage_service.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final gameData = StorageService.getGameData();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Achievements'),
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.backgroundColor,
              AppTheme.backgroundColor.withOpacity(0.8),
            ],
          ),
        ),
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: GameConstants.achievements.length,
          itemBuilder: (context, index) {
            final achievement =
                GameConstants.achievements.values.elementAt(index);
            final isUnlocked = _checkAchievement(gameData, achievement);

            return _buildAchievementCard(
              achievement,
              isUnlocked,
              _getProgress(gameData, achievement),
              index,
            );
          },
        ),
      ),
    );
  }

  bool _checkAchievement(gameData, Achievement achievement) {
    switch (achievement.id) {
      case 'first_game':
        return gameData.totalGamesPlayed >= 1;
      case 'score_10k':
        return gameData.highScore >= 10000;
      case 'score_50k':
        return gameData.highScore >= 50000;
      case 'score_100k':
        return gameData.highScore >= 100000;
      case 'lines_100':
        return gameData.totalBlocksPlaced >= 100;
      case 'lines_500':
        return gameData.totalBlocksPlaced >= 500;
      case 'streak_7':
        return gameData.longestStreak >= 7;
      case 'streak_30':
        return gameData.longestStreak >= 30;
      default:
        return false;
    }
  }

  double _getProgress(gameData, Achievement achievement) {
    switch (achievement.id) {
      case 'first_game':
        return gameData.totalGamesPlayed > 0 ? 1.0 : 0.0;
      case 'score_10k':
        return (gameData.highScore / 10000).clamp(0.0, 1.0);
      case 'score_50k':
        return (gameData.highScore / 50000).clamp(0.0, 1.0);
      case 'score_100k':
        return (gameData.highScore / 100000).clamp(0.0, 1.0);
      case 'lines_100':
        return (gameData.totalBlocksPlaced / 100).clamp(0.0, 1.0);
      case 'lines_500':
        return (gameData.totalBlocksPlaced / 500).clamp(0.0, 1.0);
      case 'streak_7':
        return (gameData.longestStreak / 7).clamp(0.0, 1.0);
      case 'streak_30':
        return (gameData.longestStreak / 30).clamp(0.0, 1.0);
      default:
        return 0.0;
    }
  }

  Widget _buildAchievementCard(
    Achievement achievement,
    bool isUnlocked,
    double progress,
    int index,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: isUnlocked
            ? Border.all(color: Colors.amber.withOpacity(0.5), width: 2)
            : null,
        boxShadow: isUnlocked
            ? [
                BoxShadow(
                  color: Colors.amber.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Row(
        children: [
          // Icon
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isUnlocked
                  ? Colors.amber.withOpacity(0.2)
                  : Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isUnlocked ? Icons.emoji_events : Icons.lock,
              color: isUnlocked ? Colors.amber : Colors.white54,
              size: 32,
            ),
          ),

          const SizedBox(width: 16),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  achievement.name,
                  style: TextStyle(
                    color: isUnlocked ? Colors.amber : Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  achievement.description,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                // Progress bar
                if (!isUnlocked) ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.white.withOpacity(0.1),
                      valueColor:
                          const AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
                      minHeight: 6,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${(progress * 100).toInt()}% Complete',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 12,
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Reward
          if (isUnlocked)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.monetization_on,
                    color: Colors.amber,
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '+${achievement.reward}',
                    style: const TextStyle(
                      color: Colors.amber,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 50 * index)).slideX(
          begin: 0.3,
          delay: Duration(milliseconds: 50 * index),
        );
  }
}
