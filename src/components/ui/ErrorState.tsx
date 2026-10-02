import {Button} from "./Button";
import {Icon} from "./Icon";

interface ErrorStateProps {
    title?: string,
    message?: string,
    onRetry?: () => void;
}

export const ErrorState = ({ title = "Could not load this page", message , onRetry }: ErrorStateProps) => {
    return (
        <div role="error" className = "mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
            <Icon name="error" size={36} className="text-danger" />
            <h2 className = "text-lg font-semibold" > {title}</h2>
            <p className = "text-charcoal-muted" > {message}</p>
            {onRetry && <Button onClick={onRetry} variant="primary">Try again</Button>}
        </div>

    );

}