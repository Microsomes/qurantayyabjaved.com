import type { Profile } from '@/types';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            activeProfile: Profile | null;
            [key: string]: unknown;
        };
    }
}
