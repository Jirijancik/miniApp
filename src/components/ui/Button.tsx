import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export default function Button({
  title,
  isLoading = false,
  disabled = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const bgClass = variant === "primary" ? "bg-blue-600" : "bg-gray-200";
  const textClass = variant === "primary" ? "text-white" : "text-gray-800";

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={isLoading ? "Loading" : title}
      accessibilityState={{ disabled: isDisabled }}
      className={`rounded-lg px-6 py-3.5 items-center justify-center ${bgClass} ${isDisabled ? "opacity-50" : "active:opacity-80"}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#1f2937"} />
      ) : (
        <Text className={`text-base font-semibold ${textClass}`}>{title}</Text>
      )}
    </Pressable>
  );
}
