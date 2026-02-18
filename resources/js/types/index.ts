export interface Profile {
    id: number;
    name: string;
    current_page: number;
    level: number;
    total_xp: number;
    current_streak: number;
    created_at?: string;
}

export interface QuranWord {
    text: string;
    audio_url: string | null;
    char_type: 'word' | 'end';
    position: number;
}

export interface QuranAyah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    page: number;
    surahNumber: number;
    words?: QuranWord[];
}

export interface QuranSurah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface QuranPageData {
    page: number;
    surahs: QuranSurah[];
    ayahs: QuranAyah[];
    juz: number | null;
}

export interface ReadingProgress {
    current_page: number;
    last_word_index: number | null;
    last_read_at: string | null;
}

export interface XpResult {
    xp_earned: number;
    total_xp: number;
    level: number;
    leveled_up: boolean;
}

export interface StreakInfo {
    current_streak: number;
    longest_streak: number;
    freeze_count: number;
    last_read_date: string | null;
}

export interface Badge {
    slug: string;
    name: string;
    description: string;
    icon: string;
    xp_reward?: number;
    earned_at?: string;
}

export interface ProgressUpdateResponse {
    progress: {
        current_page: number;
        last_word_index: number | null;
    };
    xp: XpResult | null;
    streak: StreakInfo | null;
    new_badges: Badge[];
}

export interface GamificationStats {
    profile: { id: number; name: string };
    xp: {
        total: number;
        level: number;
        xp_for_current_level: number;
        xp_for_next_level: number;
        progress_to_next: number;
    };
    streak: {
        current: number;
        longest: number;
        freeze_count: number;
        last_read_date: string | null;
    };
    reading: {
        total_pages: number;
        completion: number;
        total_sessions: number;
        total_duration: number;
    };
    badges: Badge[];
    reading_history: {
        date: string;
        pages_count: number;
        xp_earned: number;
        duration: number;
    }[];
}

export interface LeaderboardEntry {
    rank: number;
    profile_id: number;
    name: string;
    period_xp: number;
    total_xp: number;
    level: number;
    current_streak: number;
    days_active: number;
}
