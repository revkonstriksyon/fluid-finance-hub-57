
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSidebarSkeleton = () => {
  return (
    <div className="finance-card">
      <div className="flex flex-col items-center text-center mb-6 p-4">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24 mb-4" />
        
        <div className="mt-4 w-full">
          <div className="flex justify-between text-sm mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      
      <Skeleton className="h-20 w-full mb-6" />
      
      <div className="space-y-2 p-4">
        {[1,2,3,4].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebarSkeleton;
