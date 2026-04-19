'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

// Brand icons list for dynamic detection
const BRAND_ICONS = [
  'linkedin-in', 'facebook-f', 'instagram', 'youtube',
  'react', 'node-js', 'python', 'r-project', 'aws', 'microsoft',
  'docker', 'github', 'gitlab', 'bitbucket', 'android', 'apple',
  'linux', 'windows', 'google', 'facebook', 'twitter', 'linkedin',
  'whatsapp', 'slack', 'figma'
];

interface IconProps {
  /** Icon name (e.g., 'arrow-right', 'linkedin-in') */
  name: string;
  /** Override prefix: 'fas' for solid, 'fab' for brands. Auto-detected if not provided. */
  prefix?: 'fas' | 'fab';
  /** FontAwesome size prop */
  size?: SizeProp;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Hide from assistive tech (default: true for decorative icons) */
  ariaHidden?: boolean;
}

/**
 * Reusable Icon component wrapping FontAwesomeIcon.
 * Automatically detects brand vs solid icons based on name.
 */
export default function Icon({
  name,
  prefix,
  size,
  className = '',
  ariaLabel,
  ariaHidden = true,
}: IconProps) {
  // Auto-detect prefix if not provided
  const iconPrefix = prefix || (BRAND_ICONS.includes(name) ? 'fab' : 'fas');
  
  const icon: IconProp = [iconPrefix, name as any];

  return (
    <FontAwesomeIcon
      icon={icon}
      size={size}
      className={className}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  );
}
