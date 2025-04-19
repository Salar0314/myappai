import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, fullName, email } = await request.json()

    // Create Supabase client with service role
    const supabase = createRouteHandlerClient({ cookies })

    // Create the profile
    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          full_name: fullName,
          email: email,
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json(
        { message: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in create-profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 