import {ReactNode} from 'react';

export type BadgeTone = "teal" | "orange" | "neutral" | "danger"

const tones: Record<BadgeTone, string> = {
    teal: "bg-teal-pale text-teal-dark",
    orange: "bg-orange-pale text-charcoal",
    neutral: "bg-warm-pale text-charcoal-lighter",
    danger: "bg-danger-pale text-danger"
}

export const Badge = ({tone = "neutral", children}: {tone?: BadgeTone, children: ReactNode}) => {
    return (
        <span className = {`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>
    )
}