import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/storage_service.dart';
import '../services/analytics_service.dart';
import '../utils/theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late bool _soundEnabled;
  late bool _musicEnabled;
  late bool _hapticEnabled;

  @override
  void initState() {
    super.initState();
    final gameData = StorageService.getGameData();
    _soundEnabled = gameData.soundEnabled;
    _musicEnabled = gameData.musicEnabled;
    _hapticEnabled = gameData.hapticEnabled;
  }

  void _updateSetting(String setting, bool value) {
    StorageService.updateGameData((data) {
      switch (setting) {
        case 'sound':
          data.soundEnabled = value;
          _soundEnabled = value;
          break;
        case 'music':
          data.musicEnabled = value;
          _musicEnabled = value;
          break;
        case 'haptic':
          data.hapticEnabled = value;
          _hapticEnabled = value;
          break;
      }
    });

    AnalyticsService.instance.logEvent('setting_changed', parameters: {
      'setting': setting,
      'value': value,
    });

    setState(() {});
  }

  void _showResetDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text(
          'Reset Game Data?',
          style: TextStyle(color: Colors.white),
        ),
        content: const Text(
          'This will delete all your progress, scores, and achievements. This action cannot be undone.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              StorageService.clearAllData();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Game data reset')),
              );
            },
            style: TextButton.styleFrom(
              foregroundColor: AppTheme.errorColor,
            ),
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }

  void _showAnalyticsDialog() {
    final analytics = AnalyticsService.instance.exportAnalytics();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text(
          'Analytics Overview',
          style: TextStyle(color: Colors.white),
        ),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildAnalyticsItem(
                'Engagement Score',
                '${analytics['engagement_score'].toStringAsFixed(1)}/100',
              ),
              _buildAnalyticsItem(
                'ARPDAU',
                '\$${analytics['arpdau'].toStringAsFixed(2)}',
              ),
              _buildAnalyticsItem(
                'Total Sessions',
                analytics['session_analytics']['total_sessions'].toString(),
              ),
              _buildAnalyticsItem(
                'Avg Session Duration',
                '${(analytics['session_analytics']['avg_session_duration'] / 60).toStringAsFixed(1)} min',
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalyticsItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white70),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final gameData = StorageService.getGameData();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
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
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Audio Settings
            _buildSectionHeader('Audio'),
            _buildSettingTile(
              'Sound Effects',
              'Play sound effects during gameplay',
              Icons.volume_up,
              _soundEnabled,
              (value) => _updateSetting('sound', value),
            ),
            _buildSettingTile(
              'Music',
              'Play background music',
              Icons.music_note,
              _musicEnabled,
              (value) => _updateSetting('music', value),
            ),

            const SizedBox(height: 24),

            // Haptic Settings
            _buildSectionHeader('Haptics'),
            _buildSettingTile(
              'Vibration',
              'Vibrate on interactions',
              Icons.vibration,
              _hapticEnabled,
              (value) => _updateSetting('haptic', value),
            ),

            const SizedBox(height: 24),

            // Statistics
            _buildSectionHeader('Statistics'),
            _buildStatCard('Total Games', gameData.totalGamesPlayed.toString()),
            const SizedBox(height: 8),
            _buildStatCard('High Score', gameData.highScore.toString()),
            const SizedBox(height: 8),
            _buildStatCard('Current Streak', '${gameData.currentStreak} days'),
            const SizedBox(height: 8),
            _buildStatCard('Longest Streak', '${gameData.longestStreak} days'),

            const SizedBox(height: 24),

            // Data Management
            _buildSectionHeader('Data'),
            _buildActionTile(
              'View Analytics',
              'See detailed statistics',
              Icons.analytics,
              _showAnalyticsDialog,
            ),
            const SizedBox(height: 8),
            _buildActionTile(
              'Reset Game Data',
              'Clear all progress',
              Icons.delete_forever,
              _showResetDialog,
              isDestructive: true,
            ),

            const SizedBox(height: 24),

            // About
            _buildSectionHeader('About'),
            _buildInfoTile('Version', '1.0.0'),
            _buildInfoTile('Device', AnalyticsService.instance.deviceModel),
            _buildInfoTile('OS', AnalyticsService.instance.osVersion),

            const SizedBox(height: 32),

            // Footer
            Center(
              child: Text(
                'Block Puzzle Master\nMade with ❤️ for puzzle lovers',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.5),
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(
          color: AppTheme.primaryColor,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildSettingTile(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool) onChanged,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppTheme.primaryColor,
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: AppTheme.primaryColor,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap, {
    bool isDestructive = false,
  }) {
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
            border: isDestructive
                ? Border.all(color: AppTheme.errorColor.withOpacity(0.3))
                : null,
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (isDestructive
                          ? AppTheme.errorColor
                          : AppTheme.primaryColor)
                      .withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  icon,
                  color: isDestructive
                      ? AppTheme.errorColor
                      : AppTheme.primaryColor,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: isDestructive
                            ? AppTheme.errorColor
                            : Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
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
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
