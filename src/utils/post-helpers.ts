const AVATAR_COLORS = [
  "#0079D3",
  "#FF4500",
  "#7193FF",
  "#46D160",
  "#FF585B",
  "#FFB000",
  "#00A6A5",
  "#CC3600",
];

export function getAvatarBg(authorId: string): string {
  let hash = 0;
  for (let i = 0; i < authorId.length; i++) {
    hash = authorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(authorId: string): string {
  return authorId.slice(0, 2).toUpperCase();
}

export function getDisplayAuthorId(authorId: string): string {
  return authorId.slice(0, 8);
}

interface FormatDateOptions {
  compact?: boolean;
}

export function formatRelativeDate(
  dateStr: string,
  { compact = false }: FormatDateOptions = {},
): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  if (isNaN(date)) return "Unknown date";
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  const suffix = compact ? "" : " ago";

  if (diffMin < 1) return compact ? "now" : "just now";
  if (diffMin < 60) return `${diffMin}m${suffix}`;
  if (diffHrs < 24) return `${diffHrs}h${suffix}`;
  if (diffDays < 30) return `${diffDays}d${suffix}`;

  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(compact ? {} : { year: "numeric" }),
  });
}
