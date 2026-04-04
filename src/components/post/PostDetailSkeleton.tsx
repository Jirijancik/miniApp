import { View } from "react-native";

import { SkeletonProvider, ShimmerBlock } from "@/components/ui/SkeletonCard";

export default function PostDetailSkeleton() {
  return (
    <SkeletonProvider>
      <View
        className="flex-1 bg-feed"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View className="mx-3 mt-3 overflow-hidden rounded-xl bg-white p-4">
          {/* Author row skeleton */}
          <View className="flex-row items-center">
            <ShimmerBlock className="h-8 w-8 rounded-full" />
            <View className="ml-2.5">
              <ShimmerBlock className="h-3 w-24 rounded" />
              <ShimmerBlock className="mt-1.5 h-2.5 w-16 rounded" />
            </View>
          </View>
          {/* Title skeleton */}
          <ShimmerBlock className="mt-5 h-5 w-11/12 rounded" />
          <ShimmerBlock className="mt-2 h-5 w-8/12 rounded" />
          {/* Divider */}
          <View className="my-5 h-px bg-neutral-200" />
          {/* Content skeleton */}
          <ShimmerBlock className="h-3.5 w-full rounded" />
          <ShimmerBlock className="mt-2 h-3.5 w-full rounded" />
          <ShimmerBlock className="mt-2 h-3.5 w-11/12 rounded" />
          <ShimmerBlock className="mt-2 h-3.5 w-full rounded" />
          <ShimmerBlock className="mt-2 h-3.5 w-7/12 rounded" />
        </View>
      </View>
    </SkeletonProvider>
  );
}
