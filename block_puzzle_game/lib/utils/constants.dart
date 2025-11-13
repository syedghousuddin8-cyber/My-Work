class GameConstants {
  // Board dimensions
  static const int boardRows = 8;
  static const int boardColumns = 8;

  // Scoring
  static const int baseBlockScore = 10;
  static const int lineScore = 100;
  static const double comboMultiplier = 0.5;
  static const int allPiecesBonus = 100;

  // Power-ups
  static const int hintCost = 50;
  static const int undoCost = 100;
  static const int bombCost = 150;

  // Daily rewards
  static const List<int> dailyRewards = [50, 75, 100, 150, 200, 300, 500];

  // Achievements
  static const Map<String, Achievement> achievements = {
    'first_game': Achievement(
      id: 'first_game',
      name: 'First Steps',
      description: 'Play your first game',
      reward: 50,
    ),
    'score_10k': Achievement(
      id: 'score_10k',
      name: 'Rising Star',
      description: 'Score 10,000 points',
      reward: 100,
    ),
    'score_50k': Achievement(
      id: 'score_50k',
      name: 'Expert Player',
      description: 'Score 50,000 points',
      reward: 500,
    ),
    'score_100k': Achievement(
      id: 'score_100k',
      name: 'Master',
      description: 'Score 100,000 points',
      reward: 1000,
    ),
    'lines_100': Achievement(
      id: 'lines_100',
      name: 'Line Clearer',
      description: 'Clear 100 lines',
      reward: 200,
    ),
    'lines_500': Achievement(
      id: 'lines_500',
      name: 'Line Master',
      description: 'Clear 500 lines',
      reward: 500,
    ),
    'streak_7': Achievement(
      id: 'streak_7',
      name: 'Dedicated',
      description: 'Play 7 days in a row',
      reward: 300,
    ),
    'streak_30': Achievement(
      id: 'streak_30',
      name: 'Legendary',
      description: 'Play 30 days in a row',
      reward: 1500,
    ),
    'new_highscore': Achievement(
      id: 'new_highscore',
      name: 'New Record',
      description: 'Beat your high score',
      reward: 100,
    ),
  };

  // Share messages
  static const List<String> shareMessages = [
    'I just scored {score} in Block Puzzle Master! Can you beat it?',
    'Crushing it in Block Puzzle Master with {score} points!',
    'Just cleared {lines} lines in Block Puzzle Master!',
    'Block Puzzle Master is addictive! My score: {score}',
    'Challenge accepted! My Block Puzzle score: {score}',
  ];

  // Monetization
  static const int requiredDauFor1000Daily = 6667; // Based on $0.15 ARPDAU
  static const double targetArpdau = 0.15;

  // Ad frequency
  static const Duration interstitialCooldown = Duration(minutes: 3);
  static const int gamesBeforeInterstitial = 2;
  static const int minRewardedAdsPerSession = 1;

  // Session tracking
  static const Duration sessionTimeout = Duration(minutes: 30);
  static const int minSessionDuration = 60; // seconds

  // Viral features
  static const int referralReward = 500;
  static const int shareReward = 25;
}

class Achievement {
  final String id;
  final String name;
  final String description;
  final int reward;

  const Achievement({
    required this.id,
    required this.name,
    required this.description,
    required this.reward,
  });
}

class AppStrings {
  // App
  static const String appName = 'Block Puzzle Master';
  static const String appSlogan = 'The Ultimate Block Puzzle Experience';

  // Menu
  static const String playNow = 'Play Now';
  static const String continueGame = 'Continue';
  static const String newGame = 'New Game';
  static const String leaderboard = 'Leaderboard';
  static const String achievements = 'Achievements';
  static const String settings = 'Settings';
  static const String share = 'Share';

  // Game modes
  static const String endless = 'Endless';
  static const String endlessDesc = 'Play until no moves left';
  static const String timed = 'Timed';
  static const String timedDesc = '3 minutes to score high';
  static const String challenge = 'Challenge';
  static const String challengeDesc = 'Reach target scores';

  // UI
  static const String score = 'Score';
  static const String highScore = 'High Score';
  static const String moves = 'Moves';
  static const String time = 'Time';
  static const String level = 'Level';
  static const String target = 'Target';
  static const String combo = 'Combo';

  // Power-ups
  static const String hint = 'Hint';
  static const String undo = 'Undo';
  static const String bomb = 'Bomb';

  // Dialogs
  static const String gameOver = 'Game Over';
  static const String pause = 'Paused';
  static const String resume = 'Resume';
  static const String restart = 'Restart';
  static const String quit = 'Quit';

  // Rewards
  static const String dailyReward = 'Daily Reward';
  static const String claimReward = 'Claim Reward';
  static const String comeBackTomorrow = 'Come back tomorrow';

  // Ads
  static const String watchAdForReward = 'Watch ad for reward';
  static const String noAdsAvailable = 'No ads available';
  static const String adRewardReceived = 'Reward received!';
}
