// Supabase client configuration for SkillMatch
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  signInWithProvider: async (provider: 'google' | 'github' | 'linkedin') => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password })
  },

  getUser: async () => {
    return await supabase.auth.getUser()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  }
}

// Storage helpers
export const storage = {
  uploadResume: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    
    return await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
  },

  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`
    
    return await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
  },

  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path)
  },

  createSignedUrl: async (bucket: string, path: string, expiresIn = 3600) => {
    return await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
  },

  deleteFile: async (bucket: string, path: string) => {
    return await supabase.storage
      .from(bucket)
      .remove([path])
  }
}

// Database helpers
export const db = {
  // Users
  getUserProfile: async (userId: string) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
  },

  updateUserProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
  },

  // Resumes
  getResumes: async (userId: string) => {
    return await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  getResume: async (resumeId: string) => {
    return await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single()
  },

  createResume: async (resumeData: any) => {
    return await supabase
      .from('resumes')
      .insert(resumeData)
      .select()
      .single()
  },

  updateResume: async (resumeId: string, updates: any) => {
    return await supabase
      .from('resumes')
      .update(updates)
      .eq('id', resumeId)
  },

  deleteResume: async (resumeId: string) => {
    return await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)
  },

  // Jobs
  getJobs: async (filters?: any) => {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (filters?.search) {
      query = query.textSearch('title,description', filters.search)
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters?.jobType) {
      query = query.eq('job_type', filters.jobType)
    }
    if (filters?.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel)
    }
    if (filters?.salaryMin) {
      query = query.gte('salary_max', filters.salaryMin)
    }
    if (filters?.remoteAllowed !== undefined) {
      query = query.eq('remote_allowed', filters.remoteAllowed)
    }

    return await query.limit(filters?.limit || 20)
  },

  getJob: async (jobId: string) => {
    return await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()
  },

  // Job Matches
  getJobMatches: async (userId: string) => {
    return await supabase
      .from('job_matches')
      .select(`
        *,
        jobs:job_id(*),
        resumes:resume_id(*)
      `)
      .eq('user_id', userId)
      .order('overall_score', { ascending: false })
  },

  createJobMatch: async (matchData: any) => {
    return await supabase
      .from('job_matches')
      .insert(matchData)
      .select()
      .single()
  },

  // Skills
  getSkills: async () => {
    return await supabase
      .from('skills')
      .select('*')
      .order('popularity_score', { ascending: false })
  },

  getUserSkills: async (userId: string) => {
    return await supabase
      .from('user_skills')
      .select(`
        *,
        skills:skill_id(*)
      `)
      .eq('user_id', userId)
  },

  addUserSkill: async (userId: string, skillId: string, level: string) => {
    return await supabase
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: skillId,
        level: level as any
      })
  },

  // Skill Recommendations
  getSkillRecommendations: async (userId: string) => {
    return await supabase
      .from('skill_recommendations')
      .select(`
        *,
        skills:skill_id(*)
      `)
      .eq('user_id', userId)
      .eq('is_dismissed', false)
      .order('priority_score', { ascending: false })
  },

  updateSkillRecommendation: async (recommendationId: string, updates: any) => {
    return await supabase
      .from('skill_recommendations')
      .update(updates)
      .eq('id', recommendationId)
  },

  // Notifications
  getNotifications: async (userId: string) => {
    return await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
  },

  markNotificationAsRead: async (notificationId: string) => {
    return await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
  },

  // Saved Jobs
  getSavedJobs: async (userId: string) => {
    return await supabase
      .from('saved_jobs')
      .select(`
        *,
        jobs:job_id(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  saveJob: async (userId: string, jobId: string, notes?: string) => {
    return await supabase
      .from('saved_jobs')
      .insert({
        user_id: userId,
        job_id: jobId,
        notes
      })
  },

  unsaveJob: async (userId: string, jobId: string) => {
    return await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId)
  },

  // Analytics
  logUserActivity: async (userId: string, eventType: string, eventData?: any) => {
    return await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData || {}
      })
  },

  // Dashboard Stats
  getDashboardStats: async (userId: string) => {
    return await supabase.rpc('get_user_dashboard_stats', {
      user_uuid: userId
    })
  },

  // Search Jobs with RPC
  searchJobs: async (params: any) => {
    return await supabase.rpc('search_jobs', {
      search_query: params.query,
      job_location: params.location,
      job_type: params.jobType,
      experience_level: params.experienceLevel,
      salary_min: params.salaryMin,
      remote_allowed: params.remoteAllowed,
      limit_count: params.limit || 20,
      offset_count: params.offset || 0
    })
  },

  // Feedback
  submitFeedback: async (feedbackData: any) => {
    return await supabase
      .from('feedback')
      .insert(feedbackData)
  }
}

// Realtime subscriptions
export const realtime = {
  subscribeToNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeToJobMatches: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('job_matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_matches',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  unsubscribe: (channel: any) => {
    return supabase.removeChannel(channel)
  }
}

export default supabase

