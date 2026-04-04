import { memo } from "react";

import { Pressable, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  return (
    <View className="bg-white px-3 pb-2 pt-1.5" accessibilityRole="search">
      <View className="flex-row items-center rounded-[20px] border border-[#EDEFF1] bg-[#F6F7F8] px-3 py-1.5">
        <Ionicons name="search-outline" size={18} color="#878A8C" />
        <TextInput
          className="ml-2 flex-1 text-sm text-neutral-900"
          accessibilityLabel="Search posts"
          placeholder="Search"
          placeholderTextColor="#878A8C"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <Pressable
            onPress={onClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color="#878A8C" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default memo(SearchBar);
