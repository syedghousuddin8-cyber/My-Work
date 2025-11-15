import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    (disabled || loading) && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#F97316'}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={textStyles}>{children}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primary: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  secondary: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#F97316',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  // Sizes
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  // Text styles
  text: {
    fontFamily: 'Inter',
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: '#F97316',
  },
  text_ghost: {
    color: '#F97316',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
