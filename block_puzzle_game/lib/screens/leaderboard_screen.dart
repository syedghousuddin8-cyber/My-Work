import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/storage_service.dart';
import '../models/game_data.dart';
import '../utils/theme.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Leaderboard'),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.primaryColor,
          labelColor: AppTheme.primaryColor,
          unselectedLabelColor: Colors.white54,
          tabs: const [
            Tab(text: 'Endless'),
            Tab(text: 'Timed'),
            Tab(text: 'Challenge'),
          ],
        ),
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
        child: TabBarView(
          controller: _tabController,
          children: [
            _buildLeaderboardList('endless'),
            _buildLeaderboardList('timed'),
            _buildLeaderboardList('challenge'),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboardList(String gameMode) {
    final entries = StorageService.getLeaderboard(gameMode: gameMode, limit: 50);

    if (entries.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.leaderboard,
              size: 64,
              color: Colors.white.withOpacity(0.3),
            ),
            const SizedBox(height: 16),
            Text(
              'No scores yet',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Play ${gameMode} mode to get on the leaderboard!',
              style: TextStyle(
                color: Colors.white.withOpacity(0.3),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: entries.length,
      itemBuilder: (context, index) {
        final entry = entries[index];
        final rank = index + 1;
        final isTop3 = rank <= 3;

        return _buildLeaderboardItem(
          rank,
          entry,
          isTop3,
          index,
        );
      },
    );
  }

  Widget _buildLeaderboardItem(
    int rank,
    LeaderboardEntry entry,
    bool isTop3,
    int index,
  ) {
    Color rankColor;
    IconData? rankIcon;

    if (rank == 1) {
      rankColor = Colors.amber;
      rankIcon = Icons.emoji_events;
    } else if (rank == 2) {
      rankColor = Colors.grey[400]!;
      rankIcon = Icons.emoji_events;
    } else if (rank == 3) {
      rankColor = Colors.brown;
      rankIcon = Icons.emoji_events;
    } else {
      rankColor = Colors.white54;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: isTop3
            ? Border.all(color: rankColor.withOpacity(0.5), width: 2)
            : null,
        boxShadow: isTop3
            ? [
                BoxShadow(
                  color: rankColor.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Row(
        children: [
          // Rank
          SizedBox(
            width: 40,
            child: Column(
              children: [
                if (rankIcon != null)
                  Icon(rankIcon, color: rankColor, size: 24)
                else
                  Text(
                    '$rank',
                    style: TextStyle(
                      color: rankColor,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(width: 16),

          // Player info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.playerName,
                  style: TextStyle(
                    color: isTop3 ? rankColor : Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formatDate(entry.date),
                  style: const TextStyle(
                    color: Colors.white54,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),

          // Score
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: rankColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              entry.score.toString(),
              style: TextStyle(
                color: rankColor,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 50 * index)).slideX(
          begin: 0.3,
          delay: Duration(milliseconds: 50 * index),
        );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inDays == 0) {
      if (diff.inHours == 0) {
        return '${diff.inMinutes}m ago';
      }
      return '${diff.inHours}h ago';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}d ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
