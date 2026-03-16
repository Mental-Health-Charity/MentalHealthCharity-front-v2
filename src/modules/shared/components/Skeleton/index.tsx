import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
    count?: number;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
    className?: string;
}

const Skeleton = ({ count = 1, width, height, circle, className }: Props) => {
    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map((i) => (
                <ShadcnSkeleton key={i} className={cn(circle && "rounded-full", className)} style={{ width, height }} />
            ))}
        </>
    );
};

export default Skeleton;
