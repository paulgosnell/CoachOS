import { track } from '@vercel/analytics'

// Authentication Events
export const trackSignIn = (method: 'email' | 'google' | 'github' = 'email') => {
  track('sign_in', { method })
}

export const trackSignUp = (method: 'email' | 'google' | 'github' = 'email') => {
  track('sign_up', { method })
}

export const trackSignOut = () => {
  track('sign_out')
}

// Navigation Events
export const trackDashboardCardClick = (cardName: string) => {
  track('dashboard_card_click', { card: cardName })
}

export const trackNavigationClick = (destination: string, source?: string) => {
  track('navigation_click', { destination, source })
}

// Chat Events
export const trackNewConversation = () => {
  track('conversation_created')
}

export const trackMessageSent = (type: 'text' | 'voice' = 'text', conversationId?: string) => {
  track('message_sent', { type, conversationId })
}

export const trackConversationOpened = (conversationId: string) => {
  track('conversation_opened', { conversationId })
}

export const trackVoiceNoteUsed = () => {
  track('voice_note_used')
}

// Goals Events
export const trackGoalCreated = (category?: string, priority?: string) => {
  track('goal_created', { category, priority })
}

export const trackGoalUpdated = (goalId: string) => {
  track('goal_updated', { goalId })
}

export const trackGoalCompleted = (goalId: string, category?: string) => {
  track('goal_completed', { goalId, category })
}

export const trackGoalDeleted = (goalId: string) => {
  track('goal_deleted', { goalId })
}

// Session Events
export const trackSessionBookingStarted = () => {
  track('session_booking_started')
}

export const trackSessionBooked = (framework: string, duration: number, date: string) => {
  track('session_booked', { framework, duration, date })
}

export const trackSessionStarted = (sessionId: string, framework: string) => {
  track('session_started', { sessionId, framework })
}

export const trackSessionCompleted = (sessionId: string, rating?: number, duration?: number) => {
  track('session_completed', { sessionId, rating, duration })
}

export const trackSessionTabChanged = (tab: 'upcoming' | 'completed') => {
  track('session_tab_changed', { tab })
}

// Voice Events
export const trackVoiceRecordingStarted = () => {
  track('voice_recording_started')
}

export const trackVoiceRecordingStopped = (duration?: number) => {
  track('voice_recording_stopped', { duration })
}

export const trackAudioPlaybackStarted = () => {
  track('audio_playback_started')
}

// Feedback Events
export const trackFeedbackOpened = (source?: string) => {
  track('feedback_opened', { source })
}

export const trackFeedbackSubmitted = (type: string, category?: string) => {
  track('feedback_submitted', { type, category })
}

// Settings Events
export const trackSettingsOpened = () => {
  track('settings_opened')
}

export const trackSettingsSaved = (fieldsChanged?: string[]) => {
  track('settings_saved', { fieldsChanged: fieldsChanged?.join(',') })
}

// Onboarding Events
export const trackOnboardingStarted = () => {
  track('onboarding_started')
}

export const trackOnboardingStepCompleted = (step: string) => {
  track('onboarding_step_completed', { step })
}

export const trackOnboardingCompleted = () => {
  track('onboarding_completed')
}

// Form Events
export const trackFormSubmitted = (formName: string, success: boolean = true) => {
  track('form_submitted', { formName, success })
}

export const trackFormError = (formName: string, error: string) => {
  track('form_error', { formName, error })
}

// CTA Events (Generic)
export const trackCTAClick = (ctaName: string, location: string) => {
  track('cta_click', { ctaName, location })
}

// Feature Usage
export const trackFeatureUsed = (featureName: string, metadata?: Record<string, string | number | boolean>) => {
  track('feature_used', { feature: featureName, ...metadata })
}
