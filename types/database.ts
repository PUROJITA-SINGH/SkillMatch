// Database Types for SkillMatch Supabase Backend
// Generated from database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enum types
export type UserRole = 'job_seeker' | 'recruiter' | 'admin'
export type ResumeStatus = 'draft' | 'active' | 'archived'
export type JobStatus = 'active' | 'closed' | 'draft'
export type MatchStatus = 'pending' | 'completed' | 'failed'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type NotificationType = 'match_found' | 'skill_recommendation' | 'system_update'

// Database table interfaces
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          avatar_url: string | null
          phone: string | null
          location: string | null
          bio: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          years_experience: number
          current_position: string | null
          current_company: string | null
          preferences: Json
          settings: Json
          is_verified: boolean
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          years_experience?: number
          current_position?: string | null
          current_company?: string | null
          preferences?: Json
          settings?: Json
          is_verified?: boolean
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          years_experience?: number
          current_position?: string | null
          current_company?: string | null
          preferences?: Json
          settings?: Json
          is_verified?: boolean
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          popularity_score: number
          demand_score: number
          avg_salary_impact: number | null
          related_skills: string[] | null
          learning_resources: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          popularity_score?: number
          demand_score?: number
          avg_salary_impact?: number | null
          related_skills?: string[] | null
          learning_resources?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          popularity_score?: number
          demand_score?: number
          avg_salary_impact?: number | null
          related_skills?: string[] | null
          learning_resources?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          level: SkillLevel
          years_experience: number
          is_verified: boolean
          endorsements: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          level?: SkillLevel
          years_experience?: number
          is_verified?: boolean
          endorsements?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          level?: SkillLevel
          years_experience?: number
          is_verified?: boolean
          endorsements?: number
          created_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          status: ResumeStatus
          version: number
          is_primary: boolean
          parsed_data: Json
          extracted_text: string | null
          contact_info: Json
          work_experience: Json
          education: Json
          skills_extracted: string[] | null
          certifications: Json
          ats_score: number | null
          ats_feedback: Json
          keyword_density: Json
          formatting_issues: string[] | null
          parse_status: string
          parse_error: string | null
          last_analyzed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          status?: ResumeStatus
          version?: number
          is_primary?: boolean
          parsed_data?: Json
          extracted_text?: string | null
          contact_info?: Json
          work_experience?: Json
          education?: Json
          skills_extracted?: string[] | null
          certifications?: Json
          ats_score?: number | null
          ats_feedback?: Json
          keyword_density?: Json
          formatting_issues?: string[] | null
          parse_status?: string
          parse_error?: string | null
          last_analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          status?: ResumeStatus
          version?: number
          is_primary?: boolean
          parsed_data?: Json
          extracted_text?: string | null
          contact_info?: Json
          work_experience?: Json
          education?: Json
          skills_extracted?: string[] | null
          certifications?: Json
          ats_score?: number | null
          ats_feedback?: Json
          keyword_density?: Json
          formatting_issues?: string[] | null
          parse_status?: string
          parse_error?: string | null
          last_analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          company: string
          location: string | null
          job_type: string | null
          experience_level: string | null
          salary_min: number | null
          salary_max: number | null
          currency: string
          description: string
          requirements: string | null
          responsibilities: string | null
          benefits: string | null
          remote_allowed: boolean
          required_skills: string[] | null
          preferred_skills: string[] | null
          parsed_requirements: Json
          status: JobStatus
          external_job_id: string | null
          source: string
          application_url: string | null
          application_deadline: string | null
          views_count: number
          applications_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          company: string
          location?: string | null
          job_type?: string | null
          experience_level?: string | null
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          description: string
          requirements?: string | null
          responsibilities?: string | null
          benefits?: string | null
          remote_allowed?: boolean
          required_skills?: string[] | null
          preferred_skills?: string[] | null
          parsed_requirements?: Json
          status?: JobStatus
          external_job_id?: string | null
          source?: string
          application_url?: string | null
          application_deadline?: string | null
          views_count?: number
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          company?: string
          location?: string | null
          job_type?: string | null
          experience_level?: string | null
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          description?: string
          requirements?: string | null
          responsibilities?: string | null
          benefits?: string | null
          remote_allowed?: boolean
          required_skills?: string[] | null
          preferred_skills?: string[] | null
          parsed_requirements?: Json
          status?: JobStatus
          external_job_id?: string | null
          source?: string
          application_url?: string | null
          application_deadline?: string | null
          views_count?: number
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      job_matches: {
        Row: {
          id: string
          user_id: string
          resume_id: string
          job_id: string
          overall_score: number
          skills_match_score: number | null
          experience_match_score: number | null
          education_match_score: number | null
          matched_skills: string[] | null
          missing_skills: string[] | null
          skill_gaps: Json
          recommendations: Json
          status: MatchStatus
          algorithm_version: string
          processing_time_ms: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_id: string
          job_id: string
          overall_score: number
          skills_match_score?: number | null
          experience_match_score?: number | null
          education_match_score?: number | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          skill_gaps?: Json
          recommendations?: Json
          status?: MatchStatus
          algorithm_version?: string
          processing_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string
          job_id?: string
          overall_score?: number
          skills_match_score?: number | null
          experience_match_score?: number | null
          education_match_score?: number | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          skill_gaps?: Json
          recommendations?: Json
          status?: MatchStatus
          algorithm_version?: string
          processing_time_ms?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      skill_recommendations: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          reason: string
          priority_score: number
          market_demand_score: number | null
          salary_impact_score: number | null
          estimated_learning_time_hours: number | null
          difficulty_level: SkillLevel
          prerequisites: string[] | null
          learning_path: Json
          is_dismissed: boolean
          is_bookmarked: boolean
          user_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          reason: string
          priority_score?: number
          market_demand_score?: number | null
          salary_impact_score?: number | null
          estimated_learning_time_hours?: number | null
          difficulty_level?: SkillLevel
          prerequisites?: string[] | null
          learning_path?: Json
          is_dismissed?: boolean
          is_bookmarked?: boolean
          user_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          reason?: string
          priority_score?: number
          market_demand_score?: number | null
          salary_impact_score?: number | null
          estimated_learning_time_hours?: number | null
          difficulty_level?: SkillLevel
          prerequisites?: string[] | null
          learning_path?: Json
          is_dismissed?: boolean
          is_bookmarked?: boolean
          user_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_analytics: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_data: Json
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_data?: Json
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_data?: Json
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          type: string
          rating: number | null
          title: string | null
          message: string | null
          related_match_id: string | null
          related_recommendation_id: string | null
          status: string
          admin_response: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          rating?: number | null
          title?: string | null
          message?: string | null
          related_match_id?: string | null
          related_recommendation_id?: string | null
          status?: string
          admin_response?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          rating?: number | null
          title?: string | null
          message?: string | null
          related_match_id?: string | null
          related_recommendation_id?: string | null
          status?: string
          admin_response?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          data: Json
          is_read: boolean
          is_email_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          data?: Json
          is_read?: boolean
          is_email_sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          data?: Json
          is_read?: boolean
          is_email_sent?: boolean
          created_at?: string
        }
      }
      saved_jobs: {
        Row: {
          id: string
          user_id: string
          job_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          resume_id: string | null
          status: string
          cover_letter: string | null
          application_date: string
          last_status_update: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          resume_id?: string | null
          status?: string
          cover_letter?: string | null
          application_date?: string
          last_status_update?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          resume_id?: string | null
          status?: string
          cover_letter?: string | null
          application_date?: string
          last_status_update?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: {
          resume_skills: string[]
          job_required_skills: string[]
          job_preferred_skills?: string[]
        }
        Returns: number
      }
      cleanup_orphaned_files: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_notification: {
        Args: {
          user_uuid: string
          notification_type: NotificationType
          title: string
          message: string
          data?: Json
        }
        Returns: string
      }
      generate_resume_path: {
        Args: {
          user_uuid: string
          file_name: string
          file_extension: string
        }
        Returns: string
      }
      generate_skill_recommendations: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
      get_resume_download_url: {
        Args: {
          resume_uuid: string
          expires_in?: number
        }
        Returns: string
      }
      get_skill_trends: {
        Args: Record<PropertyKey, never>
        Returns: {
          skill_name: string
          category: string
          popularity_score: number
          demand_score: number
          avg_salary_impact: number
          growth_trend: string
        }[]
      }
      get_user_dashboard_stats: {
        Args: {
          user_uuid: string
        }
        Returns: Json
      }
      increment_job_views: {
        Args: {
          job_uuid: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_recruiter: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          user_uuid: string
          event_type: string
          event_data?: Json
          session_id?: string
        }
        Returns: undefined
      }
      search_jobs: {
        Args: {
          search_query?: string
          job_location?: string
          job_type?: string
          experience_level?: string
          salary_min?: number
          remote_allowed?: boolean
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          company: string
          location: string
          job_type: string
          experience_level: string
          salary_min: number
          salary_max: number
          remote_allowed: boolean
          created_at: string
          match_rank: number
        }[]
      }
    }
    Enums: {
      job_status: JobStatus
      match_status: MatchStatus
      notification_type: NotificationType
      resume_status: ResumeStatus
      skill_level: SkillLevel
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Utility types for common operations
export type UserProfile = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Resume = Database['public']['Tables']['resumes']['Row']
export type ResumeInsert = Database['public']['Tables']['resumes']['Insert']
export type ResumeUpdate = Database['public']['Tables']['resumes']['Update']

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']

export type JobMatch = Database['public']['Tables']['job_matches']['Row']
export type JobMatchInsert = Database['public']['Tables']['job_matches']['Insert']
export type JobMatchUpdate = Database['public']['Tables']['job_matches']['Update']

export type Skill = Database['public']['Tables']['skills']['Row']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']

export type SkillRecommendation = Database['public']['Tables']['skill_recommendations']['Row']
export type SkillRecommendationInsert = Database['public']['Tables']['skill_recommendations']['Insert']
export type SkillRecommendationUpdate = Database['public']['Tables']['skill_recommendations']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type UserAnalytics = Database['public']['Tables']['user_analytics']['Row']
export type UserAnalyticsInsert = Database['public']['Tables']['user_analytics']['Insert']

export type Feedback = Database['public']['Tables']['feedback']['Row']
export type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']
export type FeedbackUpdate = Database['public']['Tables']['feedback']['Update']

export type SavedJob = Database['public']['Tables']['saved_jobs']['Row']
export type SavedJobInsert = Database['public']['Tables']['saved_jobs']['Insert']

export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert']
export type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update']

// Extended types with relationships
export interface JobWithDetails extends Job {
  recruiter?: UserProfile
  applications_count?: number
  is_saved?: boolean
  match_score?: number
}

export interface ResumeWithDetails extends Resume {
  user?: UserProfile
  match_count?: number
  latest_match?: JobMatch
}

export interface JobMatchWithDetails extends JobMatch {
  job?: Job
  resume?: Resume
  user?: UserProfile
}

export interface SkillRecommendationWithDetails extends SkillRecommendation {
  skill?: Skill
  user?: UserProfile
}

export interface DashboardStats {
  total_resumes: number
  active_resumes: number
  total_matches: number
  high_score_matches: number
  saved_jobs: number
  pending_recommendations: number
  unread_notifications: number
  recent_activity_count: number
}

export interface SkillTrend {
  skill_name: string
  category: string
  popularity_score: number
  demand_score: number
  avg_salary_impact: number
  growth_trend: 'High Growth' | 'Growing' | 'Stable' | 'Declining'
}

export interface JobSearchResult {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  experience_level: string
  salary_min: number
  salary_max: number
  remote_allowed: boolean
  created_at: string
  match_rank: number
}

