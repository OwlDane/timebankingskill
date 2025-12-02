// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    username: string;
    school: string;
    grade: string;
    major?: string;
    phone_number?: string;
}

export interface AuthResponse {
    token: string;
    user: UserProfile;
}

// User Types
export interface UserProfile {
    id: number;
    email: string;
    full_name: string;
    username: string;
    school: string;
    grade: string;
    major: string;
    bio: string;
    avatar: string;
    location: string;
    credit_balance: number;
    is_active: boolean;
    is_verified: boolean;
}

// Skill Types
export type SkillCategory = 'academic' | 'technical' | 'creative' | 'language' | 'sports' | 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
    id: number;
    name: string;
    category: SkillCategory;
    description: string;
    icon: string;
    total_teachers: number;
    total_learners: number;
    created_at: string;
    updated_at: string;
}

export interface UserSkill {
    id: number;
    user_id: number;
    skill_id: number;
    level: SkillLevel;
    description: string;
    years_of_experience: number;
    proof_url: string;
    proof_type: string;
    is_available: boolean;
    hourly_rate: number;
    online_only: boolean;
    offline_only: boolean;
    total_sessions: number;
    average_rating: number;
    total_reviews: number;
    user?: UserProfile;
    skill?: Skill;
}

export interface LearningSkill {
    id: number;
    user_id: number;
    skill_id: number;
    desired_level: SkillLevel;
    priority: number;
    notes: string;
    user?: UserProfile;
    skill?: Skill;
}

// Session Types
export type SessionStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type SessionMode = 'online' | 'offline' | 'hybrid';

export interface Session {
    id: number;
    teacher_id: number;
    student_id: number;
    user_skill_id: number;
    title: string;
    description: string;
    duration: number;
    mode: SessionMode;
    scheduled_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    status: SessionStatus;
    location: string;
    meeting_link: string;
    credit_amount: number;
    credit_held: boolean;
    credit_released: boolean;
    teacher_confirmed: boolean;
    student_confirmed: boolean;
    materials: string;
    notes: string;
    cancelled_by: number | null;
    cancellation_reason: string;
    teacher?: UserProfile;
    student?: UserProfile;
    user_skill?: UserSkill;
    review?: Review;
    created_at: string;
    updated_at: string;
}

// Review Types
export type ReviewType = 'teacher' | 'student';

export interface Review {
    id: number;
    session_id: number;
    reviewer_id: number;
    reviewee_id: number;
    type: ReviewType;
    rating: number;
    comment: string;
    tags: string;
    communication_rating: number | null;
    punctuality_rating: number | null;
    knowledge_rating: number | null;
    helpful_count: number;
    is_reported: boolean;
    is_hidden: boolean;
    session?: Session;
    reviewer?: UserProfile;
    reviewee?: UserProfile;
    created_at: string;
    updated_at: string;
}

// Transaction Types
export type TransactionType = 'earned' | 'spent' | 'bonus' | 'refund' | 'penalty' | 'initial';

export interface Transaction {
    id: number;
    user_id: number;
    type: TransactionType;
    amount: number;
    balance_before: number;
    balance_after: number;
    session_id: number | null;
    description: string;
    metadata: string;
    user?: UserProfile;
    session?: Session;
    created_at: string;
    updated_at: string;
}

// Badge Types
export type BadgeType = 'achievement' | 'milestone' | 'quality' | 'special';

export interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    type: BadgeType;
    requirements: string;
    bonus_credits: number;
    rarity: number;
    color: string;
    total_awarded: number;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface UserBadge {
    id: number;
    user_id: number;
    badge_id: number;
    earned_at: string;
    progress: number;
    progress_goal: number;
    is_pinned: boolean;
    user?: UserProfile;
    badge?: Badge;
    created_at: string;
    updated_at: string;
}
