import { createClient } from '@/lib/supabase/server'

export type FeatureType = 'chat' | 'voice' | 'frameworks' | 'actions' | 'history' | 'settings'

// Define which features are available for free vs pro
export const FEATURES: Record<FeatureType, { requiresPro: boolean; name: string }> = {
  chat: {
    requiresPro: false,
    name: 'Chat Conversations',
  },
  voice: {
    requiresPro: true,
    name: 'Voice Coaching',
  },
  frameworks: {
    requiresPro: true,
    name: 'Coaching Frameworks',
  },
  actions: {
    requiresPro: true,
    name: 'Action Items',
  },
  history: {
    requiresPro: true,
    name: 'Session History',
  },
  settings: {
    requiresPro: true,
    name: 'Custom Settings',
  },
}

export async function checkFeatureAccess(feature: FeatureType): Promise<{
  hasAccess: boolean
  subscriptionStatus: string
  requiresUpgrade: boolean
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      hasAccess: false,
      subscriptionStatus: 'none',
      requiresUpgrade: false,
    }
  }

  const featureConfig = FEATURES[feature]

  // If feature doesn't require pro, grant access
  if (!featureConfig.requiresPro) {
    return {
      hasAccess: true,
      subscriptionStatus: 'free',
      requiresUpgrade: false,
    }
  }

  // Check user's subscription status
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at')
    .eq('id', user.id)
    .single()

  const isPro = profile?.subscription_status === 'pro'

  // Check if subscription is still valid
  const isExpired =
    profile?.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date()

  const hasAccess = isPro && !isExpired

  return {
    hasAccess,
    subscriptionStatus: profile?.subscription_status || 'free',
    requiresUpgrade: !hasAccess,
  }
}

export async function requireProAccess(
  feature: FeatureType
): Promise<{ hasAccess: true } | { hasAccess: false; redirectUrl: string }> {
  const access = await checkFeatureAccess(feature)

  if (!access.hasAccess && FEATURES[feature].requiresPro) {
    return {
      hasAccess: false,
      redirectUrl: '/subscribe',
    }
  }

  return { hasAccess: true }
}
