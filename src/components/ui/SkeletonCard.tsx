import { createContext, memo, useContext, useEffect, useRef } from "react";

import { Animated, View } from "react-native";

const ShimmerContext = createContext<Animated.Value | null>(null);

export function ShimmerBlock({ className }: { className: string }) {
  const opacity = useContext(ShimmerContext);

  if (!opacity) return <View className={className} />;

  return (
    <View className={className}>
      <Animated.View className="flex-1 rounded bg-gray-200" style={{ opacity }} />
    </View>
  );
}

function SkeletonCardInner() {
  return (
    <View
      className="mx-2.5 mb-2 overflow-hidden rounded-xl bg-white"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* Meta row */}
      <View className="flex-row items-center px-3 pt-2.5">
        <ShimmerBlock className="h-5 w-5 rounded-full" />
        <ShimmerBlock className="ml-1.5 h-3 w-20 rounded" />
        <ShimmerBlock className="ml-2 h-3 w-6 rounded" />
      </View>
      {/* Title */}
      <ShimmerBlock className="mx-3 mt-2 h-4 w-11/12 rounded" />
      <ShimmerBlock className="mx-3 mt-1.5 h-4 w-3/5 rounded" />
      {/* Content */}
      <ShimmerBlock className="mx-3 mt-2 h-3 w-full rounded" />
      <ShimmerBlock className="mx-3 mt-1.5 h-3 w-4/5 rounded" />
      {/* Action bar */}
      <View className="mt-3 mb-2.5 flex-row items-center px-3">
        <ShimmerBlock className="h-7 w-20 rounded-full" />
        <ShimmerBlock className="ml-2 h-7 w-16 rounded-full" />
        <ShimmerBlock className="ml-2 h-7 w-16 rounded-full" />
      </View>
    </View>
  );
}

export function SkeletonProvider({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <ShimmerContext.Provider value={opacity}>{children}</ShimmerContext.Provider>;
}

const SkeletonCard = memo(SkeletonCardInner);
export default SkeletonCard;
