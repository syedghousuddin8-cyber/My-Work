import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'storage_service.dart';

class AnalyticsService extends ChangeNotifier {
  static final AnalyticsService _instance = AnalyticsService._internal();
  static AnalyticsService get instance => _instance;

  AnalyticsService._internal();

  // Device info
  String _deviceModel = '';
  String _osVersion = '';
  String _appVersion = '';

  // Session tracking
  String? _currentSessionId;
  DateTime? _sessionStartTime;
  Timer? _sessionTimer;

  // Metrics
  final Map<String, int> _eventCounts = {};
  final Map<String, List<DateTime>> _eventTimestamps = {};
  final List<Map<String, dynamic>> _revenueEvents = [];

  // User behavior metrics
  int _totalTaps = 0;
  int _totalPlacements = 0;
  int _totalLinesCleared = 0;
  int _totalGamesCompleted = 0;
  int _totalGamesAbandoned = 0;

  // Retention metrics
  DateTime? _firstSessionDate;
  DateTime? _lastSessionDate;
  int _totalSessions = 0;
  double _totalSessionTime = 0.0;

  // A/B Testing variants
  String _adPlacementVariant = 'A'; // A or B
  Map<String, dynamic> _abTestResults = {};

  // Getters
  String get deviceModel => _deviceModel;
  String get osVersion => _osVersion;
  String get appVersion => _appVersion;
  String? get currentSessionId => _currentSessionId;
  Map<String, int> get eventCounts => Map.unmodifiable(_eventCounts);
  double get avgSessionDuration =>
      _totalSessions > 0 ? _totalSessionTime / _totalSessions : 0.0;

  Future<void> init() async {
    await _loadDeviceInfo();
    await _loadAppInfo();
    await _loadStoredMetrics();
    _startSession();
  }

  Future<void> _loadDeviceInfo() async {
    final deviceInfo = DeviceInfoPlugin();

    try {
      if (defaultTargetPlatform == TargetPlatform.android) {
        final androidInfo = await deviceInfo.androidInfo;
        _deviceModel = androidInfo.model;
        _osVersion = 'Android ${androidInfo.version.release}';
      } else if (defaultTargetPlatform == TargetPlatform.iOS) {
        final iosInfo = await deviceInfo.iosInfo;
        _deviceModel = iosInfo.utsname.machine;
        _osVersion = 'iOS ${iosInfo.systemVersion}';
      }
    } catch (e) {
      debugPrint('Error loading device info: $e');
    }
  }

  Future<void> _loadAppInfo() async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      _appVersion = packageInfo.version;
    } catch (e) {
      debugPrint('Error loading app info: $e');
    }
  }

  Future<void> _loadStoredMetrics() async {
    final gameData = StorageService.getGameData();

    _firstSessionDate = gameData.lastPlayedDate;
    _lastSessionDate = gameData.lastPlayedDate;
    _totalSessions = gameData.sessionCount;
    _totalSessionTime = gameData.totalPlayTime;

    if (gameData.analyticsData.containsKey('ab_variant')) {
      _adPlacementVariant = gameData.analyticsData['ab_variant'];
    } else {
      // Randomly assign A/B test variant
      _adPlacementVariant = DateTime.now().millisecond % 2 == 0 ? 'A' : 'B';
      await StorageService.updateGameData((data) {
        data.analyticsData['ab_variant'] = _adPlacementVariant;
      });
    }
  }

  void _startSession() {
    _currentSessionId = 'session_${DateTime.now().millisecondsSinceEpoch}';
    _sessionStartTime = DateTime.now();
    _totalSessions++;

    final gameData = StorageService.getGameData();
    final session = GameSession(
      sessionId: _currentSessionId!,
      startTime: _sessionStartTime!,
      gameMode: 'endless',
    );

    StorageService.saveSession(session);
    StorageService.updateGameData((data) {
      data.sessionCount++;
    });

    // Track session every 30 seconds
    _sessionTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      _updateSessionDuration();
    });

    logEvent('session_start');
  }

  void _updateSessionDuration() {
    if (_sessionStartTime != null) {
      final duration = DateTime.now().difference(_sessionStartTime!);
      _totalSessionTime = duration.inSeconds.toDouble();

      StorageService.updateGameData((data) {
        data.totalPlayTime = _totalSessionTime;
      });
    }
  }

  void endSession() {
    _updateSessionDuration();
    _sessionTimer?.cancel();
    logEvent('session_end');

    if (_currentSessionId != null) {
      final sessions = StorageService.getRecentSessions();
      final currentSession = sessions.firstWhere(
        (s) => s.sessionId == _currentSessionId,
        orElse: () => GameSession(
          sessionId: _currentSessionId!,
          startTime: _sessionStartTime!,
          gameMode: 'endless',
        ),
      );

      currentSession.endTime = DateTime.now();
      currentSession.save();
    }

    _currentSessionId = null;
    _sessionStartTime = null;
  }

  // Event tracking
  void logEvent(String eventName, {Map<String, dynamic>? parameters}) {
    _eventCounts[eventName] = (_eventCounts[eventName] ?? 0) + 1;

    if (!_eventTimestamps.containsKey(eventName)) {
      _eventTimestamps[eventName] = [];
    }
    _eventTimestamps[eventName]!.add(DateTime.now());

    debugPrint('Analytics Event: $eventName ${parameters ?? ""}');

    // Store critical events
    if (eventName.startsWith('achievement_') || eventName.contains('milestone')) {
      StorageService.updateGameData((data) {
        data.analyticsData[eventName] = DateTime.now().toIso8601String();
      });
    }
  }

  // Game-specific events
  void logGameStart(String gameMode) {
    logEvent('game_start', parameters: {'mode': gameMode});
    _updateSessionGameMode(gameMode);
  }

  void logGameEnd({
    required String gameMode,
    required int score,
    required int linesCleared,
    required int blocksPlaced,
    required bool completed,
  }) {
    logEvent('game_end', parameters: {
      'mode': gameMode,
      'score': score,
      'lines_cleared': linesCleared,
      'blocks_placed': blocksPlaced,
      'completed': completed,
    });

    if (completed) {
      _totalGamesCompleted++;
    } else {
      _totalGamesAbandoned++;
    }

    _totalLinesCleared += linesCleared;
    _totalPlacements += blocksPlaced;

    // Update session
    _updateSessionScore(score);
  }

  void logBlockPlacement({
    required int row,
    required int col,
    required int blockCount,
  }) {
    _totalPlacements++;
    _totalTaps++;

    if (_totalPlacements % 100 == 0) {
      logEvent('milestone_placements', parameters: {
        'total': _totalPlacements,
      });
    }
  }

  void logLinesClear(int count) {
    _totalLinesCleared += count;
    logEvent('lines_cleared', parameters: {'count': count});

    if (count >= 4) {
      logEvent('mega_clear', parameters: {'count': count});
    }
  }

  // Ad events
  void logAdEvent(String eventName, {Map<String, dynamic>? parameters}) {
    final adEvent = {
      'event': eventName,
      'timestamp': DateTime.now().toIso8601String(),
      'ab_variant': _adPlacementVariant,
      ...?parameters,
    };

    logEvent('ad_$eventName', parameters: adEvent);
  }

  // Revenue tracking
  void trackRevenue(Map<String, dynamic> revenueData) {
    _revenueEvents.add({
      ...revenueData,
      'session_id': _currentSessionId,
      'ab_variant': _adPlacementVariant,
    });
  }

  // User behavior metrics
  Map<String, dynamic> getUserBehaviorMetrics() {
    return {
      'total_taps': _totalTaps,
      'total_placements': _totalPlacements,
      'total_lines_cleared': _totalLinesCleared,
      'total_games_completed': _totalGamesCompleted,
      'total_games_abandoned': _totalGamesAbandoned,
      'completion_rate': _totalGamesCompleted > 0
          ? _totalGamesCompleted / (_totalGamesCompleted + _totalGamesAbandoned)
          : 0.0,
      'avg_placements_per_game': _totalGamesCompleted > 0
          ? _totalPlacements / _totalGamesCompleted
          : 0.0,
    };
  }

  // Retention metrics
  Map<String, dynamic> getRetentionMetrics() {
    final now = DateTime.now();
    final daysSinceFirst = _firstSessionDate != null
        ? now.difference(_firstSessionDate!).inDays
        : 0;
    final daysSinceLast = _lastSessionDate != null
        ? now.difference(_lastSessionDate!).inDays
        : 0;

    return {
      'first_session': _firstSessionDate?.toIso8601String(),
      'last_session': _lastSessionDate?.toIso8601String(),
      'days_since_first': daysSinceFirst,
      'days_since_last': daysSinceLast,
      'total_sessions': _totalSessions,
      'avg_session_duration': avgSessionDuration,
      'is_retained': daysSinceLast <= 7,
    };
  }

  // A/B Testing
  String getAdPlacementVariant() => _adPlacementVariant;

  void recordABTestResult(String metric, dynamic value) {
    if (!_abTestResults.containsKey(_adPlacementVariant)) {
      _abTestResults[_adPlacementVariant] = {};
    }

    _abTestResults[_adPlacementVariant][metric] = value;
  }

  Map<String, dynamic> getABTestResults() => Map.unmodifiable(_abTestResults);

  // Engagement metrics
  double getEngagementScore() {
    final metrics = getUserBehaviorMetrics();
    final retention = getRetentionMetrics();

    // Calculate engagement score (0-100)
    double score = 0.0;

    // Session frequency (30 points)
    if (_totalSessions > 10) score += 30;
    else if (_totalSessions > 5) score += 20;
    else if (_totalSessions > 1) score += 10;

    // Session duration (25 points)
    if (avgSessionDuration > 600) score += 25; // > 10 min
    else if (avgSessionDuration > 300) score += 15; // > 5 min
    else if (avgSessionDuration > 120) score += 10; // > 2 min

    // Completion rate (25 points)
    final completionRate = metrics['completion_rate'] as double;
    score += completionRate * 25;

    // Recency (20 points)
    final daysSinceLast = retention['days_since_last'] as int;
    if (daysSinceLast == 0) score += 20;
    else if (daysSinceLast <= 1) score += 15;
    else if (daysSinceLast <= 3) score += 10;
    else if (daysSinceLast <= 7) score += 5;

    return score;
  }

  // ARPDAU calculation
  double calculateARPDAU() {
    final sessionAnalytics = StorageService.getSessionAnalytics();
    final totalSessions = sessionAnalytics['total_sessions'] as int;

    if (totalSessions == 0) return 0.0;

    final totalRevenue = _revenueEvents.fold<double>(
      0.0,
      (sum, event) => sum + (event['revenue'] as double? ?? 0.0),
    );

    // Estimate DAU (simplified - would need actual date-based tracking)
    final dau = (totalSessions / 3).ceil(); // Assume avg 3 sessions per user

    return dau > 0 ? totalRevenue / dau : 0.0;
  }

  // Session helper methods
  void _updateSessionGameMode(String gameMode) {
    if (_currentSessionId != null) {
      final sessions = StorageService.getRecentSessions();
      final session = sessions.firstWhere(
        (s) => s.sessionId == _currentSessionId,
        orElse: () => GameSession(
          sessionId: _currentSessionId!,
          startTime: _sessionStartTime!,
          gameMode: gameMode,
        ),
      );

      session.gameMode = gameMode;
      session.save();
    }
  }

  void _updateSessionScore(int score) {
    if (_currentSessionId != null) {
      final sessions = StorageService.getRecentSessions();
      final session = sessions.firstWhere(
        (s) => s.sessionId == _currentSessionId,
        orElse: () => GameSession(
          sessionId: _currentSessionId!,
          startTime: _sessionStartTime!,
          gameMode: 'endless',
        ),
      );

      session.score = score;
      session.save();
    }
  }

  // Export analytics for review
  Map<String, dynamic> exportAnalytics() {
    return {
      'device_info': {
        'model': _deviceModel,
        'os': _osVersion,
        'app_version': _appVersion,
      },
      'user_behavior': getUserBehaviorMetrics(),
      'retention': getRetentionMetrics(),
      'engagement_score': getEngagementScore(),
      'event_counts': _eventCounts,
      'revenue_events': _revenueEvents,
      'ab_test_results': _abTestResults,
      'arpdau': calculateARPDAU(),
      'session_analytics': StorageService.getSessionAnalytics(),
    };
  }

  @override
  void dispose() {
    endSession();
    _sessionTimer?.cancel();
    super.dispose();
  }
}
