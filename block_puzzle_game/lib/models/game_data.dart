import 'package:hive/hive.dart';

part 'game_data.g.dart';

@HiveType(typeId: 0)
class GameData extends HiveObject {
  @HiveField(0)
  int highScore;

  @HiveField(1)
  int totalGamesPlayed;

  @HiveField(2)
  int totalBlocksPlaced;

  @HiveField(3)
  DateTime lastPlayedDate;

  @HiveField(4)
  int currentStreak;

  @HiveField(5)
  int longestStreak;

  @HiveField(6)
  int coinsBalance;

  @HiveField(7)
  List<String> unlockedThemes;

  @HiveField(8)
  String currentTheme;

  @HiveField(9)
  bool soundEnabled;

  @HiveField(10)
  bool musicEnabled;

  @HiveField(11)
  bool hapticEnabled;

  @HiveField(12)
  int dailyRewardDay;

  @HiveField(13)
  DateTime? lastDailyRewardClaimed;

  @HiveField(14)
  Map<String, int> achievements;

  @HiveField(15)
  int timedModeBestScore;

  @HiveField(16)
  int challengeModeLevel;

  @HiveField(17)
  int totalAdsWatched;

  @HiveField(18)
  int totalRewardedAdsWatched;

  @HiveField(19)
  DateTime? lastInterstitialAdShown;

  @HiveField(20)
  int sessionCount;

  @HiveField(21)
  double totalPlayTime;

  @HiveField(22)
  Map<String, dynamic> analyticsData;

  GameData({
    this.highScore = 0,
    this.totalGamesPlayed = 0,
    this.totalBlocksPlaced = 0,
    DateTime? lastPlayedDate,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.coinsBalance = 100,
    List<String>? unlockedThemes,
    this.currentTheme = 'classic',
    this.soundEnabled = true,
    this.musicEnabled = true,
    this.hapticEnabled = true,
    this.dailyRewardDay = 0,
    this.lastDailyRewardClaimed,
    Map<String, int>? achievements,
    this.timedModeBestScore = 0,
    this.challengeModeLevel = 1,
    this.totalAdsWatched = 0,
    this.totalRewardedAdsWatched = 0,
    this.lastInterstitialAdShown,
    this.sessionCount = 0,
    this.totalPlayTime = 0.0,
    Map<String, dynamic>? analyticsData,
  })  : lastPlayedDate = lastPlayedDate ?? DateTime.now(),
        unlockedThemes = unlockedThemes ?? ['classic'],
        achievements = achievements ?? {},
        analyticsData = analyticsData ?? {};

  bool canClaimDailyReward() {
    if (lastDailyRewardClaimed == null) return true;

    final now = DateTime.now();
    final lastClaimed = lastDailyRewardClaimed!;

    return now.difference(lastClaimed).inHours >= 24;
  }

  void claimDailyReward() {
    lastDailyRewardClaimed = DateTime.now();
    dailyRewardDay = (dailyRewardDay % 7) + 1;

    // Calculate reward based on day
    final reward = getDailyRewardAmount();
    coinsBalance += reward;
  }

  int getDailyRewardAmount() {
    const rewards = [50, 75, 100, 150, 200, 300, 500];
    return rewards[dailyRewardDay - 1];
  }

  void updateStreak() {
    final now = DateTime.now();
    final daysSinceLastPlayed = now.difference(lastPlayedDate).inDays;

    if (daysSinceLastPlayed == 1) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else if (daysSinceLastPlayed > 1) {
      currentStreak = 1;
    }

    lastPlayedDate = now;
  }

  void addCoins(int amount) {
    coinsBalance += amount;
  }

  bool spendCoins(int amount) {
    if (coinsBalance >= amount) {
      coinsBalance -= amount;
      return true;
    }
    return false;
  }

  void unlockTheme(String theme) {
    if (!unlockedThemes.contains(theme)) {
      unlockedThemes.add(theme);
    }
  }

  void incrementAchievement(String achievementId) {
    achievements[achievementId] = (achievements[achievementId] ?? 0) + 1;
  }

  bool hasAchievement(String achievementId, int requiredCount) {
    return (achievements[achievementId] ?? 0) >= requiredCount;
  }
}

@HiveType(typeId: 1)
class LeaderboardEntry extends HiveObject {
  @HiveField(0)
  String playerId;

  @HiveField(1)
  String playerName;

  @HiveField(2)
  int score;

  @HiveField(3)
  DateTime date;

  @HiveField(4)
  String gameMode;

  LeaderboardEntry({
    required this.playerId,
    required this.playerName,
    required this.score,
    required this.date,
    required this.gameMode,
  });
}

@HiveType(typeId: 2)
class GameSession extends HiveObject {
  @HiveField(0)
  String sessionId;

  @HiveField(1)
  DateTime startTime;

  @HiveField(2)
  DateTime? endTime;

  @HiveField(3)
  int score;

  @HiveField(4)
  String gameMode;

  @HiveField(5)
  int adsShown;

  @HiveField(6)
  int rewardedAdsWatched;

  @HiveField(7)
  Map<String, dynamic> metrics;

  GameSession({
    required this.sessionId,
    required this.startTime,
    this.endTime,
    this.score = 0,
    required this.gameMode,
    this.adsShown = 0,
    this.rewardedAdsWatched = 0,
    Map<String, dynamic>? metrics,
  }) : metrics = metrics ?? {};

  Duration get duration =>
      (endTime ?? DateTime.now()).difference(startTime);
}
