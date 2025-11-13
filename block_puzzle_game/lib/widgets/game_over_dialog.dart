import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:share_plus/share_plus.dart';
import '../services/game_service.dart';
import '../services/storage_service.dart';
import '../services/analytics_service.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class GameOverDialog extends StatelessWidget {
  final int score;
  final GameMode gameMode;
  final VoidCallback onRestart;
  final VoidCallback onHome;

  const GameOverDialog({
    super.key,
    required this.score,
    required this.gameMode,
    required this.onRestart,
    required this.onHome,
  });

  String _getModeName() {
    switch (gameMode) {
      case GameMode.endless:
        return 'Endless';
      case GameMode.timed:
        return 'Timed';
      case GameMode.challenge:
        return 'Challenge';
    }
  }

  void _shareScore() {
    final message = GameConstants.shareMessages[0]
        .replaceAll('{score}', score.toString());

    Share.share(message);
    AnalyticsService.instance.logEvent('share_score', parameters: {
      'score': score,
      'game_mode': _getModeName(),
    });
  }

  @override
  Widget build(BuildContext context) {
    final gameData = StorageService.getGameData();
    final isNewHighScore = score > gameData.highScore || score == gameData.highScore;
    final rank = StorageService.getPlayerRank(score, _getModeName().toLowerCase());

    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isNewHighScore
                ? Colors.amber
                : AppTheme.primaryColor.withOpacity(0.3),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Title
            Text(
              isNewHighScore ? 'NEW HIGH SCORE!' : 'GAME OVER',
              style: TextStyle(
                color: isNewHighScore ? Colors.amber : Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ).animate().fadeIn().slideY(begin: -0.3),

            const SizedBox(height: 8),

            Text(
              _getModeName(),
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 16,
              ),
            ).animate().fadeIn(delay: AppDurations.short),

            const SizedBox(height: 24),

            // Score display
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppGradients.primaryGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  const Text(
                    'YOUR SCORE',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    score.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ).animate().scale(
                  delay: AppDurations.medium,
                  duration: AppDurations.long,
                  curve: AppCurves.bounceCurve,
                ),

            const SizedBox(height: 16),

            // Stats
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.backgroundColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  _buildStatRow('High Score', gameData.highScore.toString(),
                      Icons.emoji_events, Colors.amber),
                  const Divider(color: Colors.white24, height: 24),
                  _buildStatRow('Rank', '#$rank', Icons.leaderboard,
                      AppTheme.primaryColor),
                ],
              ),
            ).animate().fadeIn(delay: AppDurations.long),

            const SizedBox(height: 24),

            // Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onHome,
                    icon: const Icon(Icons.home),
                    label: const Text('Home'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white54),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onRestart,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Restart'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ).animate().fadeIn(delay: AppDurations.extraLong),

            const SizedBox(height: 12),

            // Share button
            OutlinedButton.icon(
              onPressed: _shareScore,
              icon: const Icon(Icons.share),
              label: const Text('Share Score'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.accentColor,
                side: BorderSide(color: AppTheme.accentColor.withOpacity(0.5)),
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ).animate().fadeIn(delay: Duration(milliseconds: 1200)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, IconData icon, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
          ],
        ),
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
