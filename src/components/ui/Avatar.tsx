interface AvatarProps {
    name: string,
    src?: string,
    size?: number
}


export const Avatar = ({name, src, size =32}: AvatarProps) => {
    const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    const style = {width: size, height: size};

    return src ? (
        <img src={src} alt={name} style = {style} className = "rounded-full object-cover " />
    ) : (
        <span style = {style} className="inline-flex items-center justify-center rounded-full bg-teal-pale text-xs font-bold text-teal-dark" arial-label={name}>{initials}</span>
    )
}