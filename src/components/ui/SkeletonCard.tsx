import { View } from "react-native";

export default function SkeletonCard() {
  return (
    <View className="mb-3 rounded-xl border border-gray-100 bg-white p-4">
      {/* Title */}
      <View className="h-5 w-3/4 rounded bg-gray-200" />
      {/* Content line 1 */}
      <View className="mt-3 h-3.5 w-full rounded bg-gray-200" />
      {/* Content line 2 */}
      <View className="mt-2 h-3.5 w-5/6 rounded bg-gray-200" />
      {/* Footer row */}
      <View className="mt-4 flex-row justify-between">
        <View className="h-3 w-20 rounded bg-gray-200" />
        <View className="h-3 w-16 rounded bg-gray-200" />
      </View>
    </View>
  );
}
