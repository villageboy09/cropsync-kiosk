// Icon size configurations for consistent large icons throughout the app
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
  '3xl': 80,
  '4xl': 96,
  huge: 128,
};

// Icon stroke widths for better visibility
export const iconStrokes = {
  thin: 1,
  normal: 1.5,
  medium: 2,
  bold: 2.5,
  heavy: 3,
};

// Default icon props for large, prominent icons
export const largeIconProps = {
  size: iconSizes.xl,
  strokeWidth: iconStrokes.medium,
};

export const hugeIconProps = {
  size: iconSizes.huge,
  strokeWidth: iconStrokes.bold,
};

// Helper function to get icon class names
export const getIconClassName = (size = 'md', className = '') => {
  const sizeClass = `h-${iconSizes[size] / 4} w-${iconSizes[size] / 4}`;
  return `${sizeClass} ${className}`.trim();
};

export default {
  iconSizes,
  iconStrokes,
  largeIconProps,
  hugeIconProps,
  getIconClassName,
};
