// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game_data.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class GameDataAdapter extends TypeAdapter<GameData> {
  @override
  final int typeId = 0;

  @override
  GameData read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return GameData(
      highScore: fields[0] as int,
      totalGamesPlayed: fields[1] as int,
      totalBlocksPlaced: fields[2] as int,
      lastPlayedDate: fields[3] as DateTime,
      currentStreak: fields[4] as int,
      longestStreak: fields[5] as int,
      coinsBalance: fields[6] as int,
      unlockedThemes: (fields[7] as List?)?.cast<String>(),
      currentTheme: fields[8] as String,
      soundEnabled: fields[9] as bool,
      musicEnabled: fields[10] as bool,
      hapticEnabled: fields[11] as bool,
      dailyRewardDay: fields[12] as int,
      lastDailyRewardClaimed: fields[13] as DateTime?,
      achievements: (fields[14] as Map?)?.cast<String, int>(),
      timedModeBestScore: fields[15] as int,
      challengeModeLevel: fields[16] as int,
      totalAdsWatched: fields[17] as int,
      totalRewardedAdsWatched: fields[18] as int,
      lastInterstitialAdShown: fields[19] as DateTime?,
      sessionCount: fields[20] as int,
      totalPlayTime: fields[21] as double,
      analyticsData: (fields[22] as Map?)?.cast<String, dynamic>(),
    );
  }

  @override
  void write(BinaryWriter writer, GameData obj) {
    writer
      ..writeByte(23)
      ..writeByte(0)
      ..write(obj.highScore)
      ..writeByte(1)
      ..write(obj.totalGamesPlayed)
      ..writeByte(2)
      ..write(obj.totalBlocksPlaced)
      ..writeByte(3)
      ..write(obj.lastPlayedDate)
      ..writeByte(4)
      ..write(obj.currentStreak)
      ..writeByte(5)
      ..write(obj.longestStreak)
      ..writeByte(6)
      ..write(obj.coinsBalance)
      ..writeByte(7)
      ..write(obj.unlockedThemes)
      ..writeByte(8)
      ..write(obj.currentTheme)
      ..writeByte(9)
      ..write(obj.soundEnabled)
      ..writeByte(10)
      ..write(obj.musicEnabled)
      ..writeByte(11)
      ..write(obj.hapticEnabled)
      ..writeByte(12)
      ..write(obj.dailyRewardDay)
      ..writeByte(13)
      ..write(obj.lastDailyRewardClaimed)
      ..writeByte(14)
      ..write(obj.achievements)
      ..writeByte(15)
      ..write(obj.timedModeBestScore)
      ..writeByte(16)
      ..write(obj.challengeModeLevel)
      ..writeByte(17)
      ..write(obj.totalAdsWatched)
      ..writeByte(18)
      ..write(obj.totalRewardedAdsWatched)
      ..writeByte(19)
      ..write(obj.lastInterstitialAdShown)
      ..writeByte(20)
      ..write(obj.sessionCount)
      ..writeByte(21)
      ..write(obj.totalPlayTime)
      ..writeByte(22)
      ..write(obj.analyticsData);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GameDataAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class LeaderboardEntryAdapter extends TypeAdapter<LeaderboardEntry> {
  @override
  final int typeId = 1;

  @override
  LeaderboardEntry read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return LeaderboardEntry(
      playerId: fields[0] as String,
      playerName: fields[1] as String,
      score: fields[2] as int,
      date: fields[3] as DateTime,
      gameMode: fields[4] as String,
    );
  }

  @override
  void write(BinaryWriter writer, LeaderboardEntry obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.playerId)
      ..writeByte(1)
      ..write(obj.playerName)
      ..writeByte(2)
      ..write(obj.score)
      ..writeByte(3)
      ..write(obj.date)
      ..writeByte(4)
      ..write(obj.gameMode);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LeaderboardEntryAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class GameSessionAdapter extends TypeAdapter<GameSession> {
  @override
  final int typeId = 2;

  @override
  GameSession read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return GameSession(
      sessionId: fields[0] as String,
      startTime: fields[1] as DateTime,
      endTime: fields[2] as DateTime?,
      score: fields[3] as int,
      gameMode: fields[4] as String,
      adsShown: fields[5] as int,
      rewardedAdsWatched: fields[6] as int,
      metrics: (fields[7] as Map?)?.cast<String, dynamic>(),
    );
  }

  @override
  void write(BinaryWriter writer, GameSession obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.sessionId)
      ..writeByte(1)
      ..write(obj.startTime)
      ..writeByte(2)
      ..write(obj.endTime)
      ..writeByte(3)
      ..write(obj.score)
      ..writeByte(4)
      ..write(obj.gameMode)
      ..writeByte(5)
      ..write(obj.adsShown)
      ..writeByte(6)
      ..write(obj.rewardedAdsWatched)
      ..writeByte(7)
      ..write(obj.metrics);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GameSessionAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
