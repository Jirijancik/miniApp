import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function PostDetailSkeleton() {
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

  const shimmer = (
    width: string | number,
    height: number,
    borderRadius = 4,
    marginTop = 0,
  ) => (
    <Animated.View
      style={{
        width: width as number,
        height,
        borderRadius,
        marginTop,
        backgroundColor: "#E5E7EB",
        opacity,
      }}
    />
  );

  return (
    <View className="flex-1 bg-[#DAE0E6]">
      <View className="mx-3 mt-3 overflow-hidden rounded-xl bg-white p-4">
        {/* Author row skeleton */}
        <View className="flex-row items-center">
          {shimmer(32, 32, 16)}
          <View className="ml-2.5">
            {shimmer(100, 12, 4)}
            {shimmer(60, 10, 4, 6)}
          </View>
        </View>
        {/* Title skeleton */}
        <View className="mt-5">
          {shimmer("95%", 20, 4)}
          {shimmer("70%", 20, 4, 8)}
        </View>
        {/* Divider */}
        <View className="my-5 h-px bg-neutral-200" />
        {/* Content skeleton */}
        {shimmer("100%", 14, 4)}
        {shimmer("100%", 14, 4, 8)}
        {shimmer("90%", 14, 4, 8)}
        {shimmer("100%", 14, 4, 8)}
        {shimmer("60%", 14, 4, 8)}
      </View>
    </View>
  );
}
