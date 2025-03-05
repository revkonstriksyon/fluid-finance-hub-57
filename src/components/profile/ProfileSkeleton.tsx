
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="finance-card p-6 mb-6">
          <div className="flex flex-col items-center">
            <Skeleton className="w-24 h-24 rounded-full mb-4" />
            <Skeleton className="w-full h-10 mb-2" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        </div>

        <div className="finance-card p-6">
          <Skeleton className="w-3/4 h-5 mb-3" />
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="finance-card p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="w-full h-6 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>
            <div className="space-y-4">
              <Skeleton className="w-full h-6 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>
            <Skeleton className="w-full h-32" />
            <div className="flex justify-end">
              <Skeleton className="w-32 h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
