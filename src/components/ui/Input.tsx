import { forwardRef } from "react";

import { Text, TextInput, View, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input = forwardRef<TextInput, InputProps>(({ label, error, ...props }, ref) => {
  const borderClass = error ? "border-red-500" : "border-gray-300";

  return (
    <View className="mb-4">
      {label && <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text>}
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        className={`rounded-lg border px-4 py-3 text-base text-gray-900 ${borderClass}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
});

Input.displayName = "Input";

export default Input;
