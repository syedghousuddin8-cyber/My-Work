import 'package:flutter/material.dart';

class AppTheme {
  // Colors
  static const Color primaryColor = Color(0xFF6C63FF);
  static const Color secondaryColor = Color(0xFFFF6584);
  static const Color accentColor = Color(0xFF00D4FF);
  static const Color backgroundColor = Color(0xFF1A1A2E);
  static const Color surfaceColor = Color(0xFF16213E);
  static const Color errorColor = Color(0xFFFF4757);
  static const Color successColor = Color(0xFF2ED573);
  static const Color warningColor = Color(0xFFFFA502);

  // Text colors
  static const Color textPrimaryColor = Color(0xFFFFFFFF);
  static const Color textSecondaryColor = Color(0xFFB4B4B4);

  // Game colors
  static const Color gridColor = Color(0xFF0F3460);
  static const Color gridBorderColor = Color(0xFF16213E);
  static const Color emptyBlockColor = Color(0xFF1A1A2E);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryColor,
      scaffoldBackgroundColor: Colors.white,
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: Colors.white,
        error: errorColor,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 4,
        ),
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
        displayMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
        displaySmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.black,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: Colors.black87,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: Colors.black87,
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: primaryColor,
      scaffoldBackgroundColor: backgroundColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: surfaceColor,
        error: errorColor,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: backgroundColor,
        foregroundColor: textPrimaryColor,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardTheme(
        color: surfaceColor,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 4,
        ),
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
        ),
        displayMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
        ),
        displaySmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: textSecondaryColor,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: textSecondaryColor,
        ),
      ),
    );
  }
}

class GameThemes {
  static const Map<String, GameTheme> themes = {
    'classic': GameTheme(
      name: 'Classic',
      backgroundColor: Color(0xFF1A1A2E),
      gridColor: Color(0xFF0F3460),
      gridBorderColor: Color(0xFF16213E),
      emptyBlockColor: Color(0xFF1A1A2E),
      cost: 0,
    ),
    'ocean': GameTheme(
      name: 'Ocean',
      backgroundColor: Color(0xFF003B5C),
      gridColor: Color(0xFF004E7C),
      gridBorderColor: Color(0xFF006494),
      emptyBlockColor: Color(0xFF003B5C),
      cost: 500,
    ),
    'sunset': GameTheme(
      name: 'Sunset',
      backgroundColor: Color(0xFF4A1942),
      gridColor: Color(0xFF6B2D5C),
      gridBorderColor: Color(0xFF9B4F96),
      emptyBlockColor: Color(0xFF4A1942),
      cost: 500,
    ),
    'forest': GameTheme(
      name: 'Forest',
      backgroundColor: Color(0xFF1B3A2F),
      gridColor: Color(0xFF2C5F2D),
      gridBorderColor: Color(0xFF3F7D20),
      emptyBlockColor: Color(0xFF1B3A2F),
      cost: 1000,
    ),
    'neon': GameTheme(
      name: 'Neon',
      backgroundColor: Color(0xFF0D0221),
      gridColor: Color(0xFF1B0A2A),
      gridBorderColor: Color(0xFF3A015C),
      emptyBlockColor: Color(0xFF0D0221),
      cost: 1000,
    ),
    'galaxy': GameTheme(
      name: 'Galaxy',
      backgroundColor: Color(0xFF0B0C10),
      gridColor: Color(0xFF1F2833),
      gridBorderColor: Color(0xFF45A29E),
      emptyBlockColor: Color(0xFF0B0C10),
      cost: 2000,
    ),
    'candy': GameTheme(
      name: 'Candy',
      backgroundColor: Color(0xFFFFC0CB),
      gridColor: Color(0xFFFFB6C1),
      gridBorderColor: Color(0xFFFF69B4),
      emptyBlockColor: Color(0xFFFFC0CB),
      cost: 2000,
    ),
  };
}

class GameTheme {
  final String name;
  final Color backgroundColor;
  final Color gridColor;
  final Color gridBorderColor;
  final Color emptyBlockColor;
  final int cost;

  const GameTheme({
    required this.name,
    required this.backgroundColor,
    required this.gridColor,
    required this.gridBorderColor,
    required this.emptyBlockColor,
    required this.cost,
  });
}

// Gradient backgrounds for special effects
class AppGradients {
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [AppTheme.accentColor, AppTheme.primaryColor],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient successGradient = LinearGradient(
    colors: [AppTheme.successColor, Color(0xFF26D0CE)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

// Animation durations
class AppDurations {
  static const Duration short = Duration(milliseconds: 150);
  static const Duration medium = Duration(milliseconds: 300);
  static const Duration long = Duration(milliseconds: 500);
  static const Duration extraLong = Duration(milliseconds: 1000);
}

// Animation curves
class AppCurves {
  static const Curve defaultCurve = Curves.easeInOut;
  static const Curve bounceCurve = Curves.elasticOut;
  static const Curve fastOutSlowIn = Curves.fastOutSlowIn;
}
