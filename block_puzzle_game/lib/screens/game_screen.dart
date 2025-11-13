import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:confetti/confetti.dart';

import '../services/game_service.dart';
import '../services/ad_service.dart';
import '../services/analytics_service.dart';
import '../widgets/game_board_widget.dart';
import '../widgets/available_pieces_widget.dart';
import '../widgets/game_over_dialog.dart';
import '../widgets/pause_dialog.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class GameScreen extends StatefulWidget {
  final GameMode gameMode;

  const GameScreen({
    super.key,
    required this.gameMode,
  });

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  late ConfettiController _confettiController;
  DateTime? _sessionStartTime;

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 2));
    _sessionStartTime = DateTime.now();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final gameService = context.read<GameService>();
      gameService.startGame(widget.gameMode);
    });
  }

  @override
  void dispose() {
    _confettiController.dispose();
    _maybeShowInterstitialAd();
    super.dispose();
  }

  Future<void> _maybeShowInterstitialAd() async {
    final adService = context.read<AdService>();
    adService.incrementGameCount();

    if (adService.canShowInterstitialAd()) {
      await adService.showInterstitialAd();
    }
  }

  void _onGameOver() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => GameOverDialog(
        score: context.read<GameService>().score,
        gameMode: widget.gameMode,
        onRestart: () {
          Navigator.pop(context);
          context.read<GameService>().restartGame();
        },
        onHome: () {
          Navigator.pop(context);
          Navigator.pop(context);
        },
      ),
    );
  }

  void _pauseGame() {
    context.read<GameService>().pauseGame();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => PauseDialog(
        onResume: () {
          Navigator.pop(context);
          context.read<GameService>().resumeGame();
        },
        onRestart: () {
          Navigator.pop(context);
          context.read<GameService>().restartGame();
        },
        onHome: () {
          Navigator.pop(context);
          Navigator.pop(context);
        },
      ),
    );
  }

  void _watchRewardedAd(String rewardType) async {
    final adService = context.read<AdService>();

    if (!adService.isRewardedAdReady) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.noAdsAvailable)),
      );
      return;
    }

    final earned = await adService.showRewardedAd(
      onUserEarnedReward: (reward) {
        _applyReward(rewardType);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text(AppStrings.adRewardReceived)),
        );
      },
    );

    if (!earned) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ad not completed')),
      );
    }
  }

  void _applyReward(String rewardType) {
    // Apply reward based on type
    // This would be implemented based on specific reward logic
    AnalyticsService.instance.logEvent('rewarded_ad_completed', parameters: {
      'reward_type': rewardType,
    });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        _pauseGame();
        return false;
      },
      child: Scaffold(
        body: Stack(
          children: [
            // Background
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppTheme.backgroundColor,
                    AppTheme.gridColor,
                  ],
                ),
              ),
            ),

            // Game content
            SafeArea(
              child: Consumer<GameService>(
                builder: (context, gameService, _) {
                  // Show game over dialog when game ends
                  if (gameService.gameState == GameState.gameOver) {
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      _onGameOver();
                    });
                  }

                  return Column(
                    children: [
                      // Header
                      _buildHeader(gameService),

                      const SizedBox(height: 16),

                      // Score and info
                      _buildScoreSection(gameService),

                      const SizedBox(height: 24),

                      // Game board
                      Expanded(
                        child: Center(
                          child: GameBoardWidget(
                            board: gameService.board,
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Available pieces
                      AvailablePiecesWidget(
                        pieces: gameService.availablePieces,
                        onPiecePlaced: (piece, row, col) {
                          gameService.placePiece(piece, row, col);
                        },
                      ),

                      const SizedBox(height: 16),
                    ],
                  );
                },
              ),
            ),

            // Confetti
            Align(
              alignment: Alignment.topCenter,
              child: ConfettiWidget(
                confettiController: _confettiController,
                blastDirectionality: BlastDirectionality.explosive,
                particleDrag: 0.05,
                emissionFrequency: 0.05,
                numberOfParticles: 20,
                gravity: 0.2,
                colors: const [
                  Colors.green,
                  Colors.blue,
                  Colors.pink,
                  Colors.orange,
                  Colors.purple,
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(GameService gameService) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back button
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white, size: 28),
            onPressed: _pauseGame,
          ),

          // Mode indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.primaryColor.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                Icon(
                  _getModeIcon(widget.gameMode),
                  color: AppTheme.primaryColor,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  _getModeName(widget.gameMode),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          // Pause button
          IconButton(
            icon: const Icon(Icons.pause, color: Colors.white, size: 28),
            onPressed: _pauseGame,
          ),
        ],
      ),
    );
  }

  Widget _buildScoreSection(GameService gameService) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Score
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AppGradients.primaryGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryColor.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: [
                const Text(
                  'SCORE',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  gameService.score.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Stats row
          Row(
            children: [
              if (widget.gameMode == GameMode.timed)
                Expanded(
                  child: _buildStatChip(
                    'Time',
                    _formatTime(gameService.remainingTime),
                    Icons.timer,
                    Colors.orange,
                  ),
                ),
              if (widget.gameMode == GameMode.challenge) ...[
                Expanded(
                  child: _buildStatChip(
                    'Level',
                    gameService.currentLevel.toString(),
                    Icons.trending_up,
                    Colors.blue,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatChip(
                    'Target',
                    gameService.targetScore.toString(),
                    Icons.flag,
                    Colors.green,
                  ),
                ),
              ],
              if (widget.gameMode == GameMode.endless) ...[
                Expanded(
                  child: _buildStatChip(
                    'Moves',
                    gameService.moves.toString(),
                    Icons.touch_app,
                    Colors.blue,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatChip(
                    'Lines',
                    gameService.linesCleared.toString(),
                    Icons.grid_on,
                    Colors.green,
                  ),
                ),
              ],
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatChip(
                  'Combo',
                  'x${gameService.combo}',
                  Icons.whatshot,
                  Colors.red,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatChip(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white54,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getModeIcon(GameMode mode) {
    switch (mode) {
      case GameMode.endless:
        return Icons.all_inclusive;
      case GameMode.timed:
        return Icons.timer;
      case GameMode.challenge:
        return Icons.emoji_events;
    }
  }

  String _getModeName(GameMode mode) {
    switch (mode) {
      case GameMode.endless:
        return 'Endless';
      case GameMode.timed:
        return 'Timed';
      case GameMode.challenge:
        return 'Challenge';
    }
  }

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }
}
