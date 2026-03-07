import Skeleton from "react-loading-skeleton";

type Props = {
  lines?: number;
  height?: number;
};

export function LoadingSkeleton({ lines = 3, height = 20 }: Props) {
  return (
    <div className="skeleton-stack">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={height}
          borderRadius={12}
          baseColor="var(--skeleton-base)"
          highlightColor="var(--skeleton-highlight)"
        />
      ))}
    </div>
  );
}