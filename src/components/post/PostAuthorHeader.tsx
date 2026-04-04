import { Text, View } from "react-native";

import {
  getAvatarBg,
  getInitials,
  getDisplayAuthorId,
  formatRelativeDate,
} from "@/utils/post-helpers";

interface PostAuthorHeaderProps {
  authorId: string;
  createdAt: string;
  compact?: boolean;
}

export default function PostAuthorHeader({
  authorId,
  createdAt,
  compact = false,
}: PostAuthorHeaderProps) {
  if (compact) {
    return (
      <View className="flex-row items-center">
        <View
          className="h-[22px] w-[22px] items-center justify-center rounded-full"
          style={{ backgroundColor: getAvatarBg(authorId) }}
        >
          <Text className="text-[10px] font-bold text-white">{getInitials(authorId)}</Text>
        </View>
        <Text className="ml-2 text-xs font-medium text-neutral-500">
          {getDisplayAuthorId(authorId)}
        </Text>
        <Text className="mx-1.5 text-xs text-neutral-300">{"\u00B7"}</Text>
        <Text className="text-xs text-neutral-400">
          {formatRelativeDate(createdAt, { compact: true })}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center">
      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: getAvatarBg(authorId) }}
      >
        <Text className="text-xs font-bold text-white">{getInitials(authorId)}</Text>
      </View>
      <View className="ml-2.5">
        <Text className="text-sm font-semibold text-neutral-800">
          {getDisplayAuthorId(authorId)}
        </Text>
        <Text className="mt-0.5 text-xs text-neutral-400">{formatRelativeDate(createdAt)}</Text>
      </View>
    </View>
  );
}
