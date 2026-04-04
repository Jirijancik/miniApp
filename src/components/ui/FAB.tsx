import { Pressable, type PressableProps } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface FABProps extends Omit<PressableProps, "children"> {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  accessibilityLabel?: string;
}

export default function FAB({
  iconName = "add",
  iconSize = 40,
  iconColor = "#fff",
  accessibilityLabel = "Create",
  className,
  style,
  ...rest
}: FABProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`absolute bottom-12 self-center w-20 h-20 rounded-full bg-blue-600 items-center justify-center shadow-lg active:opacity-80 ${className ?? ""}`}
      style={[{ elevation: 6 }, typeof style === "object" ? style : undefined]}
      {...rest}
    >
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </Pressable>
  );
}
