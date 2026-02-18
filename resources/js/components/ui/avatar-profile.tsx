import Avatar from 'boring-avatars';

const PALETTE = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

interface AvatarProfileProps {
    name: string;
    size?: number;
    className?: string;
}

export function AvatarProfile({ name, size = 48, className }: AvatarProfileProps) {
    return (
        <div className={className} style={{ width: size, height: size }}>
            <Avatar name={name} size={size} variant="marble" colors={PALETTE} />
        </div>
    );
}
