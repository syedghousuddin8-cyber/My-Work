import 'package:hive_flutter/hive_flutter.dart';
import '../models/game_data.dart';

class StorageService {
  static const String _gameDataBoxName = 'game_data';
  static const String _leaderboardBoxName = 'leaderboard';
  static const String _sessionBoxName = 'sessions';
  static const String _gameDataKey = 'main_game_data';

  static late Box<GameData> _gameDataBox;
  static late Box<LeaderboardEntry> _leaderboardBox;
  static late Box<GameSession> _sessionBox;

  static Future<void> init() async {
    // Register adapters
    if (!Hive.isAdapterRegistered(0)) {
      Hive.registerAdapter(GameDataAdapter());
    }
    if (!Hive.isAdapterRegistered(1)) {
      Hive.registerAdapter(LeaderboardEntryAdapter());
    }
    if (!Hive.isAdapterRegistered(2)) {
      Hive.registerAdapter(GameSessionAdapter());
    }

    // Open boxes
    _gameDataBox = await Hive.openBox<GameData>(_gameDataBoxName);
    _leaderboardBox = await Hive.openBox<LeaderboardEntry>(_leaderboardBoxName);
    _sessionBox = await Hive.openBox<GameSession>(_sessionBoxName);

    // Initialize game data if it doesn't exist
    if (!_gameDataBox.containsKey(_gameDataKey)) {
      await _gameDataBox.put(_gameDataKey, GameData());
    }
  }

  // Game Data Methods
  static GameData getGameData() {
    return _gameDataBox.get(_gameDataKey) ?? GameData();
  }

  static Future<void> saveGameData(GameData data) async {
    await _gameDataBox.put(_gameDataKey, data);
  }

  static Future<void> updateGameData(Function(GameData) updateFn) async {
    final data = getGameData();
    updateFn(data);
    await saveGameData(data);
  }

  // Leaderboard Methods
  static Future<void> addLeaderboardEntry(LeaderboardEntry entry) async {
    await _leaderboardBox.add(entry);

    // Keep only top 100 entries per game mode
    await _cleanupLeaderboard();
  }

  static List<LeaderboardEntry> getLeaderboard({String? gameMode, int limit = 100}) {
    var entries = _leaderboardBox.values.toList();

    if (gameMode != null) {
      entries = entries.where((e) => e.gameMode == gameMode).toList();
    }

    entries.sort((a, b) => b.score.compareTo(a.score));

    return entries.take(limit).toList();
  }

  static Future<void> _cleanupLeaderboard() async {
    final gameModes = ['endless', 'timed', 'challenge'];

    for (final mode in gameModes) {
      final entries = getLeaderboard(gameMode: mode);
      if (entries.length > 100) {
        // Remove entries beyond top 100
        final toRemove = entries.skip(100).toList();
        for (final entry in toRemove) {
          await entry.delete();
        }
      }
    }
  }

  static int getPlayerRank(int score, String gameMode) {
    final leaderboard = getLeaderboard(gameMode: gameMode);
    int rank = 1;

    for (final entry in leaderboard) {
      if (entry.score > score) {
        rank++;
      } else {
        break;
      }
    }

    return rank;
  }

  // Session Methods
  static Future<void> saveSession(GameSession session) async {
    await _sessionBox.add(session);

    // Keep only last 50 sessions
    if (_sessionBox.length > 50) {
      final firstKey = _sessionBox.keys.first;
      await _sessionBox.delete(firstKey);
    }
  }

  static List<GameSession> getRecentSessions({int limit = 10}) {
    final sessions = _sessionBox.values.toList();
    sessions.sort((a, b) => b.startTime.compareTo(a.startTime));
    return sessions.take(limit).toList();
  }

  static Map<String, dynamic> getSessionAnalytics() {
    final sessions = _sessionBox.values.toList();
    if (sessions.isEmpty) {
      return {
        'total_sessions': 0,
        'avg_session_duration': 0.0,
        'total_ads_shown': 0,
        'total_rewarded_ads': 0,
        'avg_score': 0.0,
      };
    }

    final totalSessions = sessions.length;
    final totalDuration = sessions.fold<Duration>(
      Duration.zero,
      (sum, session) => sum + session.duration,
    );
    final totalAdsShown = sessions.fold<int>(
      0,
      (sum, session) => sum + session.adsShown,
    );
    final totalRewardedAds = sessions.fold<int>(
      0,
      (sum, session) => sum + session.rewardedAdsWatched,
    );
    final totalScore = sessions.fold<int>(
      0,
      (sum, session) => sum + session.score,
    );

    return {
      'total_sessions': totalSessions,
      'avg_session_duration': totalDuration.inSeconds / totalSessions,
      'total_ads_shown': totalAdsShown,
      'total_rewarded_ads': totalRewardedAds,
      'avg_score': totalScore / totalSessions,
      'sessions_today': sessions.where((s) {
        final now = DateTime.now();
        return s.startTime.year == now.year &&
            s.startTime.month == now.month &&
            s.startTime.day == now.day;
      }).length,
    };
  }

  // Clear all data (for testing or reset)
  static Future<void> clearAllData() async {
    await _gameDataBox.clear();
    await _leaderboardBox.clear();
    await _sessionBox.clear();
    await _gameDataBox.put(_gameDataKey, GameData());
  }

  // Backup and restore
  static Map<String, dynamic> exportData() {
    return {
      'game_data': getGameData(),
      'leaderboard': _leaderboardBox.values.toList(),
      'sessions': _sessionBox.values.toList(),
      'export_date': DateTime.now().toIso8601String(),
    };
  }

  static Future<void> close() async {
    await _gameDataBox.close();
    await _leaderboardBox.close();
    await _sessionBox.close();
  }
}
