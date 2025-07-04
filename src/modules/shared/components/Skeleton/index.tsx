import ReactLoadingSkeleton, { SkeletonProps, SkeletonTheme } from "react-loading-skeleton";

const Skeleton = (props: SkeletonProps) => {
    return (
        <SkeletonTheme baseColor="#8B3737" highlightColor="#444">
            <p>
                <ReactLoadingSkeleton {...props} />
            </p>
        </SkeletonTheme>
    );
};

export default Skeleton;
