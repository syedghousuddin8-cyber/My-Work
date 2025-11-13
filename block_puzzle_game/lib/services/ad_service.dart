import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'storage_service.dart';
import 'analytics_service.dart';

class AdService extends ChangeNotifier {
  // Test Ad Unit IDs - Replace with your actual Ad Unit IDs
  static const String _androidBannerAdUnitId = 'ca-app-pub-3940256099942544/6300978111';
  static const String _iosBannerAdUnitId = 'ca-app-pub-3940256099942544/2934735716';
  static const String _androidInterstitialAdUnitId = 'ca-app-pub-3940256099942544/1033173712';
  static const String _iosInterstitialAdUnitId = 'ca-app-pub-3940256099942544/4411468910';
  static const String _androidRewardedAdUnitId = 'ca-app-pub-3940256099942544/5224354917';
  static const String _iosRewardedAdUnitId = 'ca-app-pub-3940256099942544/1712485313';

  // Ad frequency control
  static const Duration _interstitialCooldown = Duration(minutes: 3);
  DateTime? _lastInterstitialAdShown;
  int _gamesPlayedSinceLastAd = 0;
  static const int _gamesBeforeInterstitial = 2;

  // Ad instances
  BannerAd? _bannerAd;
  InterstitialAd? _interstitialAd;
  RewardedAd? _rewardedAd;

  bool _isBannerAdLoaded = false;
  bool _isInterstitialAdLoaded = false;
  bool _isRewardedAdLoaded = false;

  // Ad revenue tracking
  double _totalAdRevenue = 0.0;
  int _interstitialAdsShown = 0;
  int _rewardedAdsShown = 0;
  int _bannerImpressions = 0;

  // Getters
  BannerAd? get bannerAd => _bannerAd;
  bool get isBannerAdLoaded => _isBannerAdLoaded;
  bool get isInterstitialAdReady => _isInterstitialAdLoaded;
  bool get isRewardedAdReady => _isRewardedAdLoaded;
  double get totalAdRevenue => _totalAdRevenue;

  Map<String, dynamic> get adMetrics => {
        'interstitial_shown': _interstitialAdsShown,
        'rewarded_shown': _rewardedAdsShown,
        'banner_impressions': _bannerImpressions,
        'total_revenue': _totalAdRevenue,
      };

  AdService() {
    _init();
  }

  void _init() {
    // Load initial ads
    loadBannerAd();
    loadInterstitialAd();
    loadRewardedAd();

    // Restore last ad time from storage
    final gameData = StorageService.getGameData();
    _lastInterstitialAdShown = gameData.lastInterstitialAdShown;
  }

  // Banner Ad Methods
  void loadBannerAd() {
    _bannerAd = BannerAd(
      adUnitId: Platform.isAndroid ? _androidBannerAdUnitId : _iosBannerAdUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          _isBannerAdLoaded = true;
          _bannerImpressions++;
          notifyListeners();
          AnalyticsService.instance.logAdEvent('banner_loaded');
        },
        onAdFailedToLoad: (ad, error) {
          debugPrint('Banner ad failed to load: $error');
          _isBannerAdLoaded = false;
          ad.dispose();
          _bannerAd = null;
          notifyListeners();

          // Retry after delay
          Future.delayed(const Duration(seconds: 30), () {
            if (_bannerAd == null) loadBannerAd();
          });
        },
        onAdImpression: (ad) {
          _trackAdRevenue('banner', 0.05); // Estimated $0.05 per impression
        },
      ),
    );

    _bannerAd!.load();
  }

  void disposeBannerAd() {
    _bannerAd?.dispose();
    _bannerAd = null;
    _isBannerAdLoaded = false;
    notifyListeners();
  }

  // Interstitial Ad Methods
  void loadInterstitialAd() {
    if (_isInterstitialAdLoaded) return;

    InterstitialAd.load(
      adUnitId: Platform.isAndroid
          ? _androidInterstitialAdUnitId
          : _iosInterstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          _isInterstitialAdLoaded = true;
          notifyListeners();
          AnalyticsService.instance.logAdEvent('interstitial_loaded');

          _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
            onAdShowedFullScreenContent: (ad) {
              _interstitialAdsShown++;
              _gamesPlayedSinceLastAd = 0;
              _lastInterstitialAdShown = DateTime.now();

              // Save to storage
              StorageService.updateGameData((data) {
                data.lastInterstitialAdShown = _lastInterstitialAdShown;
                data.totalAdsWatched++;
              });

              AnalyticsService.instance.logAdEvent('interstitial_shown');
            },
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              _interstitialAd = null;
              _isInterstitialAdLoaded = false;
              notifyListeners();

              // Load next ad
              loadInterstitialAd();
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              debugPrint('Interstitial ad failed to show: $error');
              ad.dispose();
              _interstitialAd = null;
              _isInterstitialAdLoaded = false;
              notifyListeners();
              loadInterstitialAd();
            },
            onAdImpression: (ad) {
              _trackAdRevenue('interstitial', 2.0); // Estimated $2.00 per impression
            },
          );
        },
        onAdFailedToLoad: (error) {
          debugPrint('Interstitial ad failed to load: $error');
          _isInterstitialAdLoaded = false;
          notifyListeners();

          // Retry after delay
          Future.delayed(const Duration(seconds: 30), loadInterstitialAd);
        },
      ),
    );
  }

  bool canShowInterstitialAd() {
    // Check cooldown
    if (_lastInterstitialAdShown != null) {
      final timeSinceLastAd = DateTime.now().difference(_lastInterstitialAdShown!);
      if (timeSinceLastAd < _interstitialCooldown) {
        return false;
      }
    }

    // Check games played
    if (_gamesPlayedSinceLastAd < _gamesBeforeInterstitial) {
      return false;
    }

    return _isInterstitialAdLoaded;
  }

  Future<bool> showInterstitialAd() async {
    if (!canShowInterstitialAd()) {
      return false;
    }

    if (_interstitialAd != null) {
      await _interstitialAd!.show();
      return true;
    }

    return false;
  }

  void incrementGameCount() {
    _gamesPlayedSinceLastAd++;
  }

  // Rewarded Ad Methods
  void loadRewardedAd() {
    if (_isRewardedAdLoaded) return;

    RewardedAd.load(
      adUnitId: Platform.isAndroid ? _androidRewardedAdUnitId : _iosRewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isRewardedAdLoaded = true;
          notifyListeners();
          AnalyticsService.instance.logAdEvent('rewarded_loaded');

          _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
            onAdShowedFullScreenContent: (ad) {
              _rewardedAdsShown++;
              AnalyticsService.instance.logAdEvent('rewarded_shown');
            },
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              _rewardedAd = null;
              _isRewardedAdLoaded = false;
              notifyListeners();
              loadRewardedAd();
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              debugPrint('Rewarded ad failed to show: $error');
              ad.dispose();
              _rewardedAd = null;
              _isRewardedAdLoaded = false;
              notifyListeners();
              loadRewardedAd();
            },
            onAdImpression: (ad) {
              _trackAdRevenue('rewarded', 5.0); // Estimated $5.00 per impression
            },
          );
        },
        onAdFailedToLoad: (error) {
          debugPrint('Rewarded ad failed to load: $error');
          _isRewardedAdLoaded = false;
          notifyListeners();

          // Retry after delay
          Future.delayed(const Duration(seconds: 30), loadRewardedAd);
        },
      ),
    );
  }

  Future<bool> showRewardedAd({
    required Function(RewardItem) onUserEarnedReward,
  }) async {
    if (!_isRewardedAdLoaded || _rewardedAd == null) {
      return false;
    }

    bool earned = false;

    await _rewardedAd!.show(
      onUserEarnedReward: (ad, reward) {
        earned = true;
        onUserEarnedReward(reward);

        StorageService.updateGameData((data) {
          data.totalRewardedAdsWatched++;
        });

        AnalyticsService.instance.logAdEvent('rewarded_earned');
      },
    );

    return earned;
  }

  // Revenue tracking
  void _trackAdRevenue(String adType, double estimatedRevenue) {
    _totalAdRevenue += estimatedRevenue;

    AnalyticsService.instance.trackRevenue({
      'ad_type': adType,
      'revenue': estimatedRevenue,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  // Day-parting optimization (show more ads during peak hours)
  bool isPeakHour() {
    final hour = DateTime.now().hour;

    // Peak hours: 12-2 PM and 6-11 PM (when people are on breaks/evening)
    return (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 23);
  }

  // Geo-based optimization (would require location services)
  String getOptimalAdStrategy() {
    // This is a placeholder - in production, you'd use actual location data
    // High eCPM countries: US, UK, Canada, Australia, Germany
    // For now, return default strategy
    return 'standard';
  }

  // Smart ad loading based on session metrics
  void optimizeAdLoading() {
    final sessionAnalytics = StorageService.getSessionAnalytics();
    final avgSessionDuration = sessionAnalytics['avg_session_duration'] as double;

    // If sessions are short, load ads more aggressively
    if (avgSessionDuration < 120) { // Less than 2 minutes
      if (!_isInterstitialAdLoaded) loadInterstitialAd();
      if (!_isRewardedAdLoaded) loadRewardedAd();
    }
  }

  // Calculate estimated daily revenue
  double estimateDailyRevenue({
    required int dailyActiveUsers,
    required double avgSessionsPerUser,
  }) {
    // Assumptions:
    // - Interstitial eCPM: $10-20 (avg $15)
    // - Rewarded eCPM: $30-50 (avg $40)
    // - Banner eCPM: $1-3 (avg $2)

    const interstitialCpm = 15.0;
    const rewardedCpm = 40.0;
    const bannerCpm = 2.0;

    final totalSessions = dailyActiveUsers * avgSessionsPerUser;

    // Estimate impressions
    final interstitialImpressions = totalSessions * 0.8; // 80% of sessions show interstitial
    final rewardedImpressions = totalSessions * 0.3; // 30% watch rewarded ads
    final bannerImpressions = totalSessions * 5; // Multiple banner views per session

    final interstitialRevenue = (interstitialImpressions / 1000) * interstitialCpm;
    final rewardedRevenue = (rewardedImpressions / 1000) * rewardedCpm;
    final bannerRevenue = (bannerImpressions / 1000) * bannerCpm;

    return interstitialRevenue + rewardedRevenue + bannerRevenue;
  }

  // Dispose all ads
  @override
  void dispose() {
    _bannerAd?.dispose();
    _interstitialAd?.dispose();
    _rewardedAd?.dispose();
    super.dispose();
  }

  // Get recommendations to reach $1000/day
  Map<String, dynamic> getRevenueRecommendations() {
    // To reach $1000/day, calculate required DAU
    const targetRevenue = 1000.0;
    const avgRevenuePerUser = 0.15; // Conservative estimate per DAU

    final requiredDau = (targetRevenue / avgRevenuePerUser).ceil();

    return {
      'target_daily_revenue': targetRevenue,
      'current_estimated_revenue': estimateDailyRevenue(
        dailyActiveUsers: 1000,
        avgSessionsPerUser: 3.0,
      ),
      'required_dau': requiredDau,
      'recommendations': [
        'Increase interstitial frequency to 1 per 2 minutes',
        'Add rewarded ad incentives for power-ups',
        'Optimize for tier-1 countries (US, UK, CA)',
        'Implement A/B testing for ad placements',
        'Add special events during peak hours',
        'Improve retention to increase sessions per user',
      ],
    };
  }
}
