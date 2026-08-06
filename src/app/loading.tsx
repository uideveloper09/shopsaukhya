import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      <div className="bg-saukhya-pink py-2">
        <Skeleton className="mx-auto h-3 w-64" />
      </div>
      <div className="container-saukhya py-4">
        <Skeleton className="h-12 w-32" />
      </div>
      <Skeleton className="aspect-[21/9] w-full rounded-none" />
      <div className="container-saukhya space-y-8 py-16">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-saukhya-lg" />
          ))}
        </div>
      </div>
    </>
  );
}
