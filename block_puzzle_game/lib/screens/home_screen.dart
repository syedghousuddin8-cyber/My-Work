import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import 'game_screen.dart';
import 'leaderboard_screen.dart';
import 'achievements_screen.dart';
import 'settings_screen.dart';
import '../services/ad_service.dart';
import '../services/storage_service.dart';
import '../services/analytics_service.dart';
import '../services/game_service.dart';
import '../widgets/daily_reward_dialog.dart';
import '../widgets/game_mode_selector.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _checkDailyReward();
    _loadBannerAd();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _checkDailyReward() async {
    await Future.delayed(const Duration(milliseconds: 500));

    final gameData = StorageService.getGameData();
    if (gameData.canClaimDailyReward() && mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => const DailyRewardDialog(),
      );
    }
  }

  void _loadBannerAd() {
    final adService = context.read<AdService>();
    if (!adService.isBannerAdLoaded) {
      adService.loadBannerAd();
    }
  }

  void _playGame(GameMode mode) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => GameScreen(gameMode: mode),
      ),
    );
  }

  void _showGameModeSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => GameModeSelector(
        onModeSelected: (mode) {
          Navigator.pop(context);
          _playGame(mode);
        },
      ),
    );
  }

  void _shareGame() {
    AnalyticsService.instance.logEvent('share_game');
    // Share implementation would go here
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Share feature coming soon!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final gameData = StorageService.getGameData();
    final adService = context.watch<AdService>();

    return Scaffold(
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
        child: SafeArea(
          child: Column(
            children: [
              // Header with coins and settings
              _buildHeader(gameData),

              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),

                      // App title
                      Text(
                        AppStrings.appName,
                        style: Theme.of(context).textTheme.displayLarge?.copyWith(
                              color: Colors.white,
                              shadows: [
                                Shadow(
                                  color: AppTheme.primaryColor.withOpacity(0.5),
                                  blurRadius: 20,
                                ),
                              ],
                            ),
                        textAlign: TextAlign.center,
                      ).animate().fadeIn().slideY(begin: -0.3),

                      const SizedBox(height: 8),

                      Text(
                        AppStrings.appSlogan,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Colors.white70,
                            ),
                        textAlign: TextAlign.center,
                      ).animate().fadeIn(delay: AppDurations.short),

                      const SizedBox(height: 48),

                      // Play button
                      _buildPlayButton(),

                      const SizedBox(height: 32),

                      // Stats cards
                      _buildStatsCards(gameData),

                      const SizedBox(height: 32),

                      // Menu buttons
                      _buildMenuButtons(),

                      const SizedBox(height: 32),

                      // Social buttons
                      _buildSocialButtons(),
                    ],
                  ),
                ),
              ),

              // Banner ad
              if (adService.isBannerAdLoaded && adService.bannerAd != null)
                Container(
                  height: 60,
                  alignment: Alignment.center,
                  child: AdWidget(ad: adService.bannerAd!),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(GameData gameData) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Coins
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.surfaceColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.primaryColor.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.monetization_on, color: Colors.amber, size: 24),
                const SizedBox(width: 8),
                Text(
                  gameData.coinsBalance.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn().slideX(begin: -0.3),

          // Streak indicator
          if (gameData.currentStreak > 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.successColor.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.local_fire_department,
                      color: Colors.orange, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    '${gameData.currentStreak}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: AppDurations.short),

          // Settings
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.white, size: 28),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ).animate().fadeIn().slideX(begin: 0.3),
        ],
      ),
    );
  }

  Widget _buildPlayButton() {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        return Transform.scale(
          scale: 1.0 + (_pulseController.value * 0.05),
          child: child,
        );
      },
      child: Container(
        width: 200,
        height: 200,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: AppGradients.primaryGradient,
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryColor.withOpacity(0.5),
              blurRadius: 30,
              spreadRadius: 5,
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: _showGameModeSelector,
            customBorder: const CircleBorder(),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.play_arrow, size: 80, color: Colors.white),
                  SizedBox(height: 8),
                  Text(
                    'PLAY',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 4,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ).animate().scale(
          delay: AppDurations.medium,
          duration: AppDurations.long,
          curve: AppCurves.bounceCurve,
        );
  }

  Widget _buildStatsCards(GameData gameData) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'High Score',
            gameData.highScore.toString(),
            Icons.emoji_events,
            Colors.amber,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Games',
            gameData.totalGamesPlayed.toString(),
            Icons.sports_esports,
            AppTheme.primaryColor,
          ),
        ),
      ],
    ).animate().fadeIn(delay: AppDurations.long);
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuButtons() {
    return Column(
      children: [
        _buildMenuButton(
          'Leaderboard',
          Icons.leaderboard,
          () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const LeaderboardScreen()),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildMenuButton(
          'Achievements',
          Icons.emoji_events,
          () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const AchievementsScreen()),
            );
          },
        ),
      ],
    ).animate().fadeIn(delay: Duration(milliseconds: 800));
  }

  Widget _buildMenuButton(String label, IconData icon, VoidCallback onTap) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.primaryColor.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: AppTheme.primaryColor),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.white54),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildSocialButton(Icons.share, 'Share', _shareGame),
        const SizedBox(width: 16),
        _buildSocialButton(
          Icons.star,
          'Rate',
          () {
            AnalyticsService.instance.logEvent('rate_app');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Thanks for your support!')),
            );
          },
        ),
      ],
    ).animate().fadeIn(delay: Duration(milliseconds: 1000));
  }

  Widget _buildSocialButton(IconData icon, String label, VoidCallback onTap) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.accentColor.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(icon, color: AppTheme.accentColor),
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
