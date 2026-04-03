import { ActivityIndicator, Text, View } from "react-native";

interface SpinnerProps {
  label?: string;
  size?: "small" | "large";
}

export default function Spinner({ label, size = "large" }: SpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color="#2563eb" />
      {label && (
        <Text className="mt-3 text-sm text-gray-500">{label}</Text>
      )}
    </View>
  );
}
