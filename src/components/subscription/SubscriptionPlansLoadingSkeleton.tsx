
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export const SubscriptionPlansLoadingSkeleton = () => {
  return (
    <LoadingOverlay loading={true} message="Loading subscription plans..." fullOverlay={false}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default SubscriptionPlansLoadingSkeleton;
