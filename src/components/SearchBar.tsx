import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
}: SearchBarProps) {
  return (
    <View className="mx-4 mb-3 flex-row items-center rounded-full bg-gray-100 px-4 py-2">
      <Ionicons name="search-outline" size={20} color="#9ca3af" />
      <TextInput
        className="ml-2 flex-1 text-base text-gray-900"
        placeholder="Search posts..."
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color="#9ca3af" />
        </Pressable>
      )}
    </View>
  );
}
