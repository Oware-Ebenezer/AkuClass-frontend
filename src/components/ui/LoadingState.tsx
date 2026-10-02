export const LoadingState = ({label = "Loading..."}: {label?: string}) => {
    return (
        <div role="status" className = "flex items-center justify-center gap-3 py-24 text-charcoal-muted">
            <span className="size-5 animate-spin rounded-full border-2 border-warm-300 border-t-teal"/>
            <span>{label}</span>
        </div>
    )
}