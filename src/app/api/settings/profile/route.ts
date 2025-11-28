import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fullName, coachPreference, businessProfile } = await request.json()

    // Update profile
    const updates: any = {}
    if (fullName) updates.full_name = fullName
    if (coachPreference) updates.coach_preference = coachPreference

    if (Object.keys(updates).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (profileError) throw profileError
    }

    // Update business profile (upsert)
    if (businessProfile) {
      const { error: businessError } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          ...businessProfile,
        })
        .eq('user_id', user.id)

      if (businessError) throw businessError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
