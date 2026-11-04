import Image from "next/image";

interface UserAvatarProps {
    name: string;
    src?: string;
}

export default function UserAvatar({ name, src }: UserAvatarProps) {
    return (
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15">
            {src ? (
                <Image
                    src={src}
                    alt={name}
                    fill
                    sizes="40px"
                    className="object-cover"
                />
            ) : (
                <span
                    aria-label={name}
                    className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-200 to-orange-500 text-sm font-semibold text-black"
                >
                    {name.charAt(0)}
                </span>
            )}
        </div>
    );
}
