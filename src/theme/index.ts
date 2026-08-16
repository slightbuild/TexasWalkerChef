import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  display: 'Rye_400Regular',
  displayMedium: 'Rye_400Regular',
  displayRegular: 'Rye_400Regular',
  /** Clean condensed face kept for prices / dense UI */
  condensed: 'Oswald_700Bold',
  condensedMedium: 'Oswald_500Medium',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

/** Shared western display treatment — larger + italic slant. */
export const displayStyle = {
  fontFamily: fonts.display,
  fontStyle: 'italic',
} as const satisfies TextStyle;

export const typography = {
  heroBrand: {
    ...displayStyle,
    fontSize: 76,
    letterSpacing: 3,
    lineHeight: 86,
    color: colors.text,
    textTransform: 'uppercase',
  } as TextStyle,
  h1: {
    ...displayStyle,
    fontSize: 58,
    letterSpacing: 2,
    lineHeight: 68,
    color: colors.text,
    textTransform: 'uppercase',
  } as TextStyle,
  h2: {
    ...displayStyle,
    fontSize: 46,
    letterSpacing: 1.5,
    lineHeight: 54,
    color: colors.text,
    textTransform: 'uppercase',
  } as TextStyle,
  h3: {
    ...displayStyle,
    fontSize: 32,
    letterSpacing: 1.2,
    lineHeight: 38,
    color: colors.text,
    textTransform: 'uppercase',
  } as TextStyle,
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 4,
    color: colors.orange,
    textTransform: 'uppercase',
  } as TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 30,
    color: colors.textMuted,
  } as TextStyle,
  bodyLarge: {
    fontFamily: fonts.body,
    fontSize: 22,
    lineHeight: 36,
    color: colors.textMuted,
  } as TextStyle,
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.text,
  } as TextStyle,
  price: {
    fontFamily: fonts.condensedMedium,
    fontSize: 24,
    letterSpacing: 0.5,
    color: colors.orange,
  } as TextStyle,
  caption: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textDim,
  } as TextStyle,
} as const;
