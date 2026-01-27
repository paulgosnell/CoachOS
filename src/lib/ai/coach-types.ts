/**
 * Coach Types Configuration
 * Centralized definitions for all available coaching personas
 */

export type CoachType = 'business' | 'adhd-business' | 'life' | 'adhd-life'

export interface CoachTypeConfig {
  id: CoachType
  name: string
  shortName: string
  description: string
  longDescription: string
  color: string
  bgColor: string
  borderColor: string
  icon: 'briefcase' | 'zap' | 'heart' | 'sparkles'
  isADHD: boolean
  isBusiness: boolean
}

export const COACH_TYPES: Record<CoachType, CoachTypeConfig> = {
  business: {
    id: 'business',
    name: 'Executive Coach',
    shortName: 'Business',
    description: 'Strategic business coaching',
    longDescription: 'Direct, practical coaching for founders and leaders. Focused on strategy, decisions, and getting things done.',
    color: 'text-deep-blue-400',
    bgColor: 'bg-deep-blue-900/30',
    borderColor: 'border-deep-blue-500',
    icon: 'briefcase',
    isADHD: false,
    isBusiness: true,
  },
  'adhd-business': {
    id: 'adhd-business',
    name: 'ADHD Business Coach',
    shortName: 'ADHD Business',
    description: 'Business coaching for ADHD brains',
    longDescription: 'Executive coaching adapted for neurodivergent founders. One thing at a time, no lists, follows your energy.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-500',
    icon: 'zap',
    isADHD: true,
    isBusiness: true,
  },
  life: {
    id: 'life',
    name: 'Life Coach',
    shortName: 'Life',
    description: 'Personal growth and wellbeing',
    longDescription: 'Person-centred coaching for life beyond work. Relationships, health, celebrations, challenges - whatever matters to you.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-500',
    icon: 'heart',
    isADHD: false,
    isBusiness: false,
  },
  'adhd-life': {
    id: 'adhd-life',
    name: 'ADHD Life Coach',
    shortName: 'ADHD Life',
    description: 'Life coaching for ADHD brains',
    longDescription: 'Warm, understanding support for navigating life with ADHD. Emotional regulation, self-compassion, and celebrating who you are.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-500',
    icon: 'sparkles',
    isADHD: true,
    isBusiness: false,
  },
}

export const COACH_TYPE_LIST = Object.values(COACH_TYPES)

export const DEFAULT_COACH_TYPE: CoachType = 'business'

/**
 * Maps legacy coach types to new ones
 * Used for database migration and backward compatibility
 */
export const LEGACY_COACH_MAP: Record<string, CoachType> = {
  standard: 'business',
  adhd: 'adhd-business',
}

/**
 * Get coach config by type, with fallback for legacy types
 */
export function getCoachConfig(type: string | undefined): CoachTypeConfig {
  if (!type) return COACH_TYPES[DEFAULT_COACH_TYPE]

  // Handle legacy types
  if (type in LEGACY_COACH_MAP) {
    return COACH_TYPES[LEGACY_COACH_MAP[type]]
  }

  // Handle current types
  if (type in COACH_TYPES) {
    return COACH_TYPES[type as CoachType]
  }

  return COACH_TYPES[DEFAULT_COACH_TYPE]
}

/**
 * Normalize coach type (convert legacy to current)
 */
export function normalizeCoachType(type: string | undefined): CoachType {
  if (!type) return DEFAULT_COACH_TYPE

  if (type in LEGACY_COACH_MAP) {
    return LEGACY_COACH_MAP[type]
  }

  if (type in COACH_TYPES) {
    return type as CoachType
  }

  return DEFAULT_COACH_TYPE
}
