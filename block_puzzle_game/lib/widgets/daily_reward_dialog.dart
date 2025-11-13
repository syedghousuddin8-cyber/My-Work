import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:confetti/confetti.dart';
import '../services/storage_service.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class DailyRewardDialog extends StatefulWidget {
  const DailyRewardDialog({super.key});

  @override
  State<DailyRewardDialog> createState() => _DailyRewardDialogState();
}

class _DailyRewardDialogState extends State<DailyRewardDialog> {
  late ConfettiController _confettiController;
  bool _claimed = false;

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 3));
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  void _claimReward() {
    setState(() => _claimed = true);
    _confettiController.play();

    final gameData = StorageService.getGameData();
    gameData.claimDailyReward();
    StorageService.saveGameData(gameData);

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.of(context).pop();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final gameData = StorageService.getGameData();
    final day = gameData.dailyRewardDay == 0 ? 1 : gameData.dailyRewardDay;
    final reward = GameConstants.dailyRewards[day - 1];

    return Stack(
      children: [
        Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: AppGradients.primaryGradient,
              borderRadius: BorderRadius.circular(24),
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
              children: [
                // Title
                const Icon(
                  Icons.card_giftcard,
                  size: 64,
                  color: Colors.white,
                ).animate().scale(
                      duration: AppDurations.long,
                      curve: AppCurves.bounceCurve,
                    ),

                const SizedBox(height: 16),

                Text(
                  'Daily Reward',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ).animate().fadeIn(),

                const SizedBox(height: 8),

                Text(
                  'Day $day',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        color: Colors.white70,
                      ),
                ).animate().fadeIn(delay: AppDurations.short),

                const SizedBox(height: 24),

                // Reward display
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.monetization_on,
                        size: 48,
                        color: Colors.amber,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '+$reward',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        'Coins',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ).animate().scale(
                      delay: AppDurations.medium,
                      duration: AppDurations.long,
                      curve: AppCurves.bounceCurve,
                    ),

                const SizedBox(height: 24),

                // Days progress
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(7, (index) {
                    final isComplete = index < day;
                    final isCurrent = index == day - 1;

                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: isCurrent ? 16 : 12,
                      height: isCurrent ? 16 : 12,
                      decoration: BoxDecoration(
                        color: isComplete
                            ? Colors.white
                            : Colors.white.withOpacity(0.3),
                        shape: BoxShape.circle,
                        border: isCurrent
                            ? Border.all(color: Colors.white, width: 2)
                            : null,
                      ),
                    );
                  }),
                ).animate().fadeIn(delay: AppDurations.long),

                const SizedBox(height: 24),

                // Claim button
                if (!_claimed)
                  ElevatedButton(
                    onPressed: _claimReward,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppTheme.primaryColor,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 48,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'CLAIM REWARD',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ).animate().fadeIn(delay: AppDurations.extraLong),

                if (_claimed)
                  Container(
                    padding: const EdgeInsets.all(16),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.check_circle, color: Colors.white),
                        SizedBox(width: 8),
                        Text(
                          'Reward Claimed!',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
        Positioned.fill(
          child: Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              particleDrag: 0.05,
              emissionFrequency: 0.05,
              numberOfParticles: 30,
              gravity: 0.2,
              colors: const [
                Colors.amber,
                Colors.yellow,
                Colors.orange,
                Colors.white,
              ],
            ),
          ),
        ),
      ],
    );
  }
}
