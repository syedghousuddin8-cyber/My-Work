import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/block_piece.dart';
import '../models/game_data.dart';
import 'storage_service.dart';
import 'analytics_service.dart';

enum GameMode { endless, timed, challenge }

enum GameState { idle, playing, paused, gameOver }

class GameService extends ChangeNotifier {
  GameBoard _board = GameBoard();
  List<BlockPiece> _availablePieces = [];
  GameMode _currentMode = GameMode.endless;
  GameState _gameState = GameState.idle;

  int _score = 0;
  int _moves = 0;
  int _linesCleared = 0;
  int _combo = 0;
  int _maxCombo = 0;

  // Timed mode
  Timer? _gameTimer;
  int _remainingTime = 180; // 3 minutes
  static const int _timedModeDuration = 180;

  // Challenge mode
  int _currentLevel = 1;
  int _targetScore = 1000;

  // Power-ups
  int _hintsAvailable = 3;
  int _undoAvailable = 2;
  int _bombsAvailable = 1;

  // Audio
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _soundEnabled = true;

  // Getters
  GameBoard get board => _board;
  List<BlockPiece> get availablePieces => _availablePieces;
  GameMode get currentMode => _currentMode;
  GameState get gameState => _gameState;
  int get score => _score;
  int get moves => _moves;
  int get linesCleared => _linesCleared;
  int get combo => _combo;
  int get maxCombo => _maxCombo;
  int get remainingTime => _remainingTime;
  int get currentLevel => _currentLevel;
  int get targetScore => _targetScore;
  int get hintsAvailable => _hintsAvailable;
  int get undoAvailable => _undoAvailable;
  int get bombsAvailable => _bombsAvailable;

  GameService() {
    _loadGameSettings();
  }

  void _loadGameSettings() {
    final gameData = StorageService.getGameData();
    _soundEnabled = gameData.soundEnabled;
    _currentLevel = gameData.challengeModeLevel;
  }

  // Game initialization
  void startGame(GameMode mode) {
    _currentMode = mode;
    _gameState = GameState.playing;
    _board = GameBoard();
    _score = 0;
    _moves = 0;
    _linesCleared = 0;
    _combo = 0;
    _maxCombo = 0;

    _generateNewPieces();

    switch (mode) {
      case GameMode.timed:
        _startTimedMode();
        break;
      case GameMode.challenge:
        _startChallengeMode();
        break;
      case GameMode.endless:
        _hintsAvailable = 3;
        _undoAvailable = 2;
        _bombsAvailable = 1;
        break;
    }

    AnalyticsService.instance.logGameStart(_getModeString());
    notifyListeners();
  }

  void _startTimedMode() {
    _remainingTime = _timedModeDuration;
    _hintsAvailable = 5;
    _undoAvailable = 3;
    _bombsAvailable = 2;

    _gameTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _remainingTime--;

      if (_remainingTime <= 0) {
        _endGame(completed: true);
        timer.cancel();
      }

      notifyListeners();
    });
  }

  void _startChallengeMode() {
    _targetScore = _currentLevel * 1000;
    _hintsAvailable = 2;
    _undoAvailable = 1;
    _bombsAvailable = 0;
  }

  void _generateNewPieces() {
    _availablePieces = BlockPieceFactory.createRandomSet(count: 3);
    notifyListeners();
  }

  // Piece placement
  bool canPlacePiece(BlockPiece piece, int row, int col) {
    return _board.canPlacePiece(piece, row, col);
  }

  Future<void> placePiece(BlockPiece piece, int row, int col) async {
    if (!canPlacePiece(piece, row, col)) return;

    // Place the piece
    _board.placePiece(piece, row, col);
    _moves++;

    // Play sound
    await _playSound('place');

    // Vibrate
    await _vibrate();

    // Remove piece from available pieces
    _availablePieces.removeWhere((p) => p.id == piece.id);

    // Calculate score for placement
    final placementScore = piece.blockCount * 10;
    _addScore(placementScore);

    AnalyticsService.instance.logBlockPlacement(
      row: row,
      col: col,
      blockCount: piece.blockCount,
    );

    // Check for cleared lines
    final clearedLines = _board.clearCompleteLines();
    if (clearedLines.isNotEmpty) {
      await _handleClearedLines(clearedLines.length);
    } else {
      _combo = 0;
    }

    // Generate new pieces if all are used
    if (_availablePieces.isEmpty) {
      _generateNewPieces();
      _addScore(100); // Bonus for using all pieces
      await _playSound('bonus');
    }

    // Check if game over
    if (!_hasValidMoves()) {
      _endGame(completed: false);
    }

    // Check challenge mode completion
    if (_currentMode == GameMode.challenge && _score >= _targetScore) {
      _levelUp();
    }

    notifyListeners();
  }

  Future<void> _handleClearedLines(int count) async {
    _linesCleared += count;
    _combo++;

    if (_combo > _maxCombo) {
      _maxCombo = _combo;
    }

    // Calculate score
    int lineScore = count * 100;

    // Apply combo multiplier
    if (_combo > 1) {
      lineScore = (lineScore * (1 + (_combo * 0.5))).toInt();
      await _playSound('combo');
    } else {
      await _playSound('clear');
    }

    _addScore(lineScore);

    AnalyticsService.instance.logLinesClear(count);

    // Show achievement if milestone reached
    if (_linesCleared >= 100 && _linesCleared < 100 + count) {
      _unlockAchievement('lines_100');
    }
    if (_linesCleared >= 500 && _linesCleared < 500 + count) {
      _unlockAchievement('lines_500');
    }
  }

  void _addScore(int points) {
    _score += points;

    // Check score milestones
    if (_score >= 10000 && _score < 10000 + points) {
      _unlockAchievement('score_10k');
    }
    if (_score >= 50000 && _score < 50000 + points) {
      _unlockAchievement('score_50k');
    }
    if (_score >= 100000 && _score < 100000 + points) {
      _unlockAchievement('score_100k');
    }
  }

  bool _hasValidMoves() {
    for (final piece in _availablePieces) {
      for (int r = 0; r < _board.rows; r++) {
        for (int c = 0; c < _board.columns; c++) {
          if (_board.canPlacePiece(piece, r, c)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  void _levelUp() {
    _currentLevel++;
    _targetScore = _currentLevel * 1000;

    StorageService.updateGameData((data) {
      data.challengeModeLevel = _currentLevel;
    });

    _playSound('levelup');
    _unlockAchievement('level_${_currentLevel}');

    notifyListeners();
  }

  void _endGame({required bool completed}) {
    _gameState = GameState.gameOver;
    _gameTimer?.cancel();

    // Update game data
    final gameData = StorageService.getGameData();

    // Update high score
    if (_score > gameData.highScore) {
      gameData.highScore = _score;
      _unlockAchievement('new_highscore');
    }

    // Update mode-specific scores
    if (_currentMode == GameMode.timed && _score > gameData.timedModeBestScore) {
      gameData.timedModeBestScore = _score;
    }

    // Update stats
    gameData.totalGamesPlayed++;
    gameData.totalBlocksPlaced += _moves;
    gameData.updateStreak();

    StorageService.saveGameData(gameData);

    // Add to leaderboard
    StorageService.addLeaderboardEntry(LeaderboardEntry(
      playerId: 'local_player',
      playerName: 'You',
      score: _score,
      date: DateTime.now(),
      gameMode: _getModeString(),
    ));

    // Log analytics
    AnalyticsService.instance.logGameEnd(
      gameMode: _getModeString(),
      score: _score,
      linesCleared: _linesCleared,
      blocksPlaced: _moves,
      completed: completed,
    );

    notifyListeners();
  }

  // Power-ups
  Future<void> useHint() async {
    if (_hintsAvailable <= 0) return;

    _hintsAvailable--;
    await _playSound('hint');

    // Find best move (simple heuristic)
    // In a real implementation, this would use a more sophisticated algorithm
    notifyListeners();
  }

  Future<void> useUndo() async {
    if (_undoAvailable <= 0) return;

    _undoAvailable--;
    await _playSound('undo');

    // Implement undo logic
    notifyListeners();
  }

  Future<void> useBomb(int row, int col) async {
    if (_bombsAvailable <= 0) return;

    _bombsAvailable--;

    // Clear 3x3 area around the target
    for (int r = row - 1; r <= row + 1; r++) {
      for (int c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < _board.rows && c >= 0 && c < _board.columns) {
          _board.grid[r][c] = null;
        }
      }
    }

    await _playSound('bomb');
    notifyListeners();
  }

  // Game control
  void pauseGame() {
    if (_gameState == GameState.playing) {
      _gameState = GameState.paused;
      _gameTimer?.cancel();
      notifyListeners();
    }
  }

  void resumeGame() {
    if (_gameState == GameState.paused) {
      _gameState = GameState.playing;

      if (_currentMode == GameMode.timed) {
        _gameTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
          _remainingTime--;

          if (_remainingTime <= 0) {
            _endGame(completed: true);
            timer.cancel();
          }

          notifyListeners();
        });
      }

      notifyListeners();
    }
  }

  void restartGame() {
    startGame(_currentMode);
  }

  void exitGame() {
    if (_gameState == GameState.playing) {
      _endGame(completed: false);
    }
    _gameState = GameState.idle;
    _gameTimer?.cancel();
    notifyListeners();
  }

  // Audio
  Future<void> _playSound(String soundName) async {
    if (!_soundEnabled) return;

    try {
      await _audioPlayer.play(AssetSource('sounds/$soundName.mp3'));
    } catch (e) {
      debugPrint('Error playing sound: $e');
    }
  }

  Future<void> _vibrate() async {
    final gameData = StorageService.getGameData();
    if (gameData.hapticEnabled) {
      await HapticFeedback.mediumImpact();
    }
  }

  void toggleSound() {
    _soundEnabled = !_soundEnabled;
    StorageService.updateGameData((data) {
      data.soundEnabled = _soundEnabled;
    });
    notifyListeners();
  }

  // Achievements
  void _unlockAchievement(String achievementId) {
    StorageService.updateGameData((data) {
      data.incrementAchievement(achievementId);
    });

    AnalyticsService.instance.logEvent('achievement_$achievementId');
  }

  // Helpers
  String _getModeString() {
    switch (_currentMode) {
      case GameMode.endless:
        return 'endless';
      case GameMode.timed:
        return 'timed';
      case GameMode.challenge:
        return 'challenge';
    }
  }

  // Calculate best possible move (for hint system)
  Map<String, dynamic>? findBestMove() {
    int bestScore = 0;
    Map<String, dynamic>? bestMove;

    for (final piece in _availablePieces) {
      for (int r = 0; r < _board.rows; r++) {
        for (int c = 0; c < _board.columns; c++) {
          if (_board.canPlacePiece(piece, r, c)) {
            // Simulate placement
            final testBoard = _board.clone();
            testBoard.placePiece(piece, r, c);

            // Calculate score
            final clearedLines = testBoard.clearCompleteLines();
            final moveScore = piece.blockCount * 10 + clearedLines.length * 100;

            if (moveScore > bestScore) {
              bestScore = moveScore;
              bestMove = {
                'piece': piece,
                'row': r,
                'col': c,
                'score': moveScore,
              };
            }
          }
        }
      }
    }

    return bestMove;
  }

  @override
  void dispose() {
    _gameTimer?.cancel();
    _audioPlayer.dispose();
    super.dispose();
  }
}
