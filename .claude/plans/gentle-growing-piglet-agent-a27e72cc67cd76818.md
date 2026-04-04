# Threads-Style Redesign Plan: Home Feed Screen

## Overview

Redesign the home feed screen and its components to follow the Threads (by Meta) design language. The core philosophy: **content is the hero**. Remove all visual containers (cards, shadows, borders), use hairline dividers between posts, left-aligned avatar with content flowing right, high-contrast black-on-white typography, and generous whitespace.

---

## Design Token Reference (NativeWind Classes)

These values are used consistently across all components:

| Token | Value | NativeWind Class |
|-------|-------|-----------------|
| Background | Pure white `#ffffff` | `bg-white` |
| Primary text | Black `#000000` | `text-black` |
| Secondary text | Gray `#999999` | `text-neutral-400` (closest) or inline `style={{ color: '#999' }}` |
| Divider | `#e5e5e5` at 0.5px | `border-neutral-200` + `style={{ borderBottomWidth: StyleSheet.hairlineWidth }}` |
| Avatar size | 36px (9 in tw) | `h-9 w-9` |
| Content left margin | Aligned with avatar + gap = `ml-12` (avatar 36px + gap 12px = 48px = ml-12) |
| Horizontal padding | 16px | `px-4` |
| Post vertical padding | 14px top, 0 bottom (divider handles spacing) | `pt-3.5` |
| Time format | Compact, no "ago" suffix | `5m`, `2h`, `3d`, `Jan 15` |

---

## File 1: `src/components/PostCard.tsx`

### Current State
- Rounded white card (`rounded-2xl bg-white`) with shadow
- Author row: avatar circle + name + timestamp side by side, chevron on right
- Content section: bold title (2 lines) + gray content (3 lines)
- `active:scale-[0.98]` press animation

### Target State (Threads-style)
- **No card container** at all -- just a flat `View` with a hairline bottom border
- **Left-aligned avatar** stays persistently on the left; all text content flows in a column to its right
- **Thread line stub** beneath the avatar (a thin vertical gray line, 20px tall, centered under avatar)
- **Author name + timestamp on same line**, separated by a centered dot `·`, no chevron
- **Title rendered as bold first line** of content (not a separate section header)
- **Content below title** in regular weight, same column
- **Subtle press feedback**: `active:opacity-70` instead of scale transform
- **Time format**: drop "ago" suffix -- just `5m`, `2h`, `3d`, or `Jan 15`

### Exact Layout Structure
```
<Pressable>  // no background, no shadow, no rounded corners
  <View className="flex-row px-4 pt-3.5">
    {/* Left column: avatar + thread line */}
    <View className="items-center">
      <View className="h-9 w-9 rounded-full items-center justify-center {avatarColor}">
        <Text className="text-xs font-bold text-white">{initials}</Text>
      </View>
      {/* Thread line stub */}
      <View className="mt-1 w-0.5 flex-1 rounded-full bg-neutral-200" style={{ minHeight: 20 }} />
    </View>

    {/* Right column: all text content */}
    <View className="ml-3 flex-1 pb-3.5">
      {/* Author + time row */}
      <View className="flex-row items-center">
        <Text className="text-[15px] font-semibold text-black">
          {authorId.slice(0, 8)}
        </Text>
        <Text className="mx-1.5 text-neutral-400">·</Text>
        <Text className="text-[15px] text-neutral-400">
          {formatCompactDate(post.createdAt)}
        </Text>
      </View>

      {/* Title (bold, treated as first paragraph) */}
      <Text className="mt-1 text-[15px] font-semibold leading-snug text-black" numberOfLines={2}>
        {post.title}
      </Text>

      {/* Content (regular weight) */}
      <Text className="mt-0.5 text-[15px] leading-snug text-black" numberOfLines={3}>
        {post.content}
      </Text>
    </View>
  </View>

  {/* Hairline divider -- full width, left-aligned with content column */}
  <View className="ml-16 mr-4" style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e5e5e5' }} />
</Pressable>
```

### Key Changes to Helper Functions
- `formatRelativeDate` renamed to `formatCompactDate` -- drop the "ago" suffix:
  - `< 1 min` -> `"now"`
  - `< 60 min` -> `"5m"` (not `"5m ago"`)
  - `< 24 hrs` -> `"2h"`
  - `< 7 days` -> `"3d"`
  - Older -> `"Jan 15"`
- `getInitials` and `getAvatarColor` remain unchanged (they work well)

### Press Interaction
- Remove `active:scale-[0.98]`
- Add `active:opacity-70`
- Remove all `style` shadow props

### What Gets Removed
- `rounded-2xl bg-white p-4` from container
- All `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` style props
- `<Ionicons name="chevron-forward" ...>` -- the entire chevron
- `text-gray-800`, `text-gray-400`, `text-gray-500`, `text-gray-900` -- replaced with `text-black` and `text-neutral-400`
- The `mt-3` content wrapper `<View>` -- content now lives in the right column directly
- The title/content visual separation (both now use same font size, differ only in weight)

### Import Changes
- Remove `Ionicons` import (no longer needed in PostCard)
- Add `StyleSheet` import from `react-native`

---

## File 2: `src/components/PostList.tsx`

### Current State
- FlashList with `contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4 }}`
- Skeleton loading via FlashList rendering SkeletonCard
- EmptyState with icon in gray circle, title, subtitle

### Target State
- **Remove** `contentContainerStyle.paddingHorizontal` from FlashList -- PostCard now handles its own `px-4`, and dividers need to extend to left edge partially
- Keep `paddingTop: 4` or set to 0 (Threads has no top padding on feed)
- `estimatedItemSize` should be set on FlashList (currently missing -- add it at ~120 for performance)
- EmptyState redesign: simpler, Threads-style
  - Remove the icon circle background
  - Lighter, centered text
  - Replace `text-gray-700` with `text-black`, `text-gray-400` with `text-neutral-400`

### Exact Layout Changes

**FlashList (loaded state)**:
```
<FlashList
  data={posts}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <PostCard post={item} onPress={() => onPostPress(item)} />
  )}
  estimatedItemSize={120}
  refreshing={isRefetching}
  onRefresh={onRefresh}
  contentContainerStyle={{ paddingTop: 0 }}
  showsVerticalScrollIndicator={false}
/>
```

**FlashList (skeleton state)**:
```
<FlashList
  data={SKELETON_DATA}
  keyExtractor={(item) => `skeleton-${item}`}
  renderItem={() => <SkeletonCard />}
  estimatedItemSize={120}
  contentContainerStyle={{ paddingTop: 0 }}
/>
```

**EmptyState**:
```
<View className="flex-1 items-center justify-center px-8 pb-16">
  <Ionicons
    name={isError ? "cloud-offline-outline" : "chatbubbles-outline"}
    size={48}
    color="#d4d4d4"
  />
  <Text className="mt-4 text-base font-semibold text-black">
    {isError ? "Something went wrong" : "No posts yet"}
  </Text>
  <Text className="mt-1 text-center text-sm text-neutral-400">
    {message}
  </Text>
</View>
```

Changes:
- Remove the `h-16 w-16 rounded-full bg-gray-100` icon wrapper -- icon floats naked
- Increase icon size from 28 to 48, use lighter color `#d4d4d4`
- Use `chatbubbles-outline` instead of `document-text-outline` (more social/Threads-like)
- Typography: `text-black` for heading, `text-neutral-400` for body
- Remove `mb-4`, `mb-1` spacings, use `mt-4`, `mt-1` for vertical flow

---

## File 3: `src/components/SearchBar.tsx`

### Current State
- `px-4 pb-2 pt-3` wrapper
- `rounded-xl` input container with `bg-gray-100` (unfocused) / `bg-white` (focused)
- Blue shadow and blue border on focus
- Blue-tinted search icon on focus
- Clear button with `bg-gray-200` circle

### Target State (Threads-style)
- **Flat, minimal search bar** -- no color change on focus, no shadow, no colored border
- Background: `bg-neutral-100` always (no focus state change)
- `rounded-2xl` (slightly more rounded, matching Threads pill shape)
- Icon stays gray always -- `#999999`
- No focus state visuals at all (remove `isFocused` state entirely, or keep it but don't use it for styling)
- Clear button: no background circle, just a plain `x` icon
- Placeholder text: `"Search"` (shorter, Threads-style, not `"Search posts..."`)

### Exact Layout
```
<View className="px-4 pb-2 pt-2">
  <View className="flex-row items-center rounded-2xl bg-neutral-100 px-3.5 py-2.5">
    <Ionicons name="search-outline" size={18} color="#999" />
    <TextInput
      className="ml-2.5 flex-1 text-[15px] text-black"
      placeholder="Search"
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      autoCapitalize="none"
      autoCorrect={false}
    />
    {value.length > 0 && (
      <Pressable onPress={onClear} hitSlop={8}>
        <Ionicons name="close-circle" size={18} color="#999" />
      </Pressable>
    )}
  </View>
</View>
```

### Key Changes
- Remove `useState` for `isFocused` -- no focus state styling
- Remove `onFocus`/`onBlur` handlers from TextInput
- Remove all `style` objects (shadow, border) -- the ternary logic disappears
- Change `rounded-xl` to `rounded-2xl`
- Change clear button: remove `rounded-full bg-gray-200 p-0.5` wrapper, use `close-circle` icon (filled circle with X, common in iOS/Threads) instead of plain `close` icon
- Change `text-sm` to `text-[15px]` for consistency with Threads typography
- Change placeholder from `"Search posts..."` to `"Search"`
- Change `placeholderTextColor` from `#9ca3af` to `#999`

### Test Impact
- **`SearchBar.test.tsx`**: The test at line 17 checks `getByPlaceholderText("Search posts...")` -- this must change to `getByPlaceholderText("Search")`
- The test at line 43 checks `queryByText("close")` -- since the mock renders icon `name` as text, and we change from `"close"` to `"close-circle"`, the test must check for `"close-circle"` instead
- Same for line 52: `getByText("close")` becomes `getByText("close-circle")`

---

## File 4: `src/components/ui/SkeletonCard.tsx`

### Current State
- Mirrors PostCard layout: rounded white card with shadow
- Avatar shimmer (h-9 w-9), name block, date block
- Title line, two content lines

### Target State
- Must mirror new PostCard layout exactly (no card, thread line, left avatar column)
- Same `px-4 pt-3.5` padding as PostCard
- Thread line stub shimmer beneath avatar
- Right column: author name block, title block, two content lines
- Divider at bottom (same `ml-16` hairline as PostCard)

### Exact Layout
```
<View>
  <View className="flex-row px-4 pt-3.5">
    {/* Left column */}
    <View className="items-center">
      <ShimmerBlock className="h-9 w-9 rounded-full" />
      <ShimmerBlock className="mt-1 w-0.5 rounded-full" style={{ height: 20 }} />
    </View>

    {/* Right column */}
    <View className="ml-3 flex-1 pb-3.5">
      {/* Author row */}
      <View className="flex-row items-center">
        <ShimmerBlock className="h-3.5 w-20 rounded" />
        <ShimmerBlock className="ml-2 h-3.5 w-8 rounded" />
      </View>
      {/* Title */}
      <ShimmerBlock className="mt-2 h-4 w-4/5 rounded" />
      {/* Content lines */}
      <ShimmerBlock className="mt-1.5 h-3.5 w-full rounded" />
      <ShimmerBlock className="mt-1.5 h-3.5 w-3/4 rounded" />
    </View>
  </View>

  {/* Hairline divider */}
  <View className="ml-16 mr-4" style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#e5e5e5' }} />
</View>
```

### Key Changes
- Remove `rounded-2xl bg-white p-4` and all shadow styles from container
- Restructure to two-column layout matching PostCard
- Add thread line shimmer block
- Author name + time are now side-by-side (two shimmer blocks in a row)
- Add hairline divider at bottom
- Add `StyleSheet` import

### ShimmerBlock Changes
- The `ShimmerBlock` component itself needs a minor update: its inner shimmer color should change from `#e5e7eb` (gray-200) to `#e5e5e5` (neutral-200) for consistency with the neutral palette
- It also needs to accept an optional `style` prop for the thread line height

---

## File 5: `app/(app)/(home)/index.tsx` (FeedScreen)

### Current State
- `Stack.Screen` with: `headerLargeTitle: true`, gray background `#f9fafb`, bold title
- Main view: `bg-gray-50`

### Target State
- **Pure white background** everywhere
- **Header**: white background, no large title (Threads uses a logo/icon in the center, but since we have a text-based app, use a clean medium-weight "Feed" title)
- Remove `headerLargeTitle` -- Threads doesn't use iOS large titles
- Set `headerShadowVisible: false` to remove the bottom border of the header

### Exact Changes
```tsx
<Stack.Screen
  options={{
    title: "Feed",
    headerShadowVisible: false,
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { fontWeight: '600', fontSize: 17, color: '#000' },
  }}
/>
<View className="flex-1 bg-white">
  <SearchBar ... />
  <PostList ... />
</View>
```

### Key Changes
- Remove `headerLargeTitle: true` -- flat header
- Remove `headerLargeTitleShadowVisible` (no longer relevant)
- Change `headerStyle.backgroundColor` from `#f9fafb` to `#fff`
- Change `headerTitleStyle.fontWeight` from `"700"` to `"600"` (semibold, not bold -- more Threads-like)
- Add `headerShadowVisible: false`
- Add `headerTitleStyle.color: '#000'` and `fontSize: 17`
- Change `<View className="flex-1 bg-gray-50">` to `<View className="flex-1 bg-white">`

---

## File 6: `app/(app)/(home)/_layout.tsx` (Home Stack Layout)

### Current State
- Basic Stack with two screens, no custom styling

### Target State
- Add `screenOptions` to enforce white headers and no shadows across all home stack screens:

```tsx
<Stack
  screenOptions={{
    headerShadowVisible: false,
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { fontWeight: '600', color: '#000' },
    headerTintColor: '#000',
  }}
>
  <Stack.Screen name="index" options={{ title: "Feed" }} />
  <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
</Stack>
```

This ensures the post detail screen also gets the white header treatment, and the back button tint is black (matching Threads).

---

## File 7 (Adjacent): `app/(app)/_layout.tsx` (Tab Layout)

### Not in direct scope but recommended change

The tab bar currently uses blue as active tint (`#2563eb`). Threads uses black for active tab icons and gray for inactive. The FAB is also blue. For full Threads consistency:

- Change `tabBarActiveTintColor` from `#2563eb` to `#000`
- Change `tabBarInactiveTintColor` from `#6b7280` to `#b5b5b5`
- Change FAB from `bg-blue-600` to `bg-black` (and keep `Ionicons name="add"` white)
- This file is adjacent to scope; change is optional for this phase but noted for completeness

---

## Test Impact Analysis

### `__tests__/components/PostCard.test.tsx`
**Status: All 4 tests should pass without changes.**
- Test 1 ("renders title and content"): Checks `getByText("Test Post Title")` and content text. Both still rendered. PASSES.
- Test 2 ("renders author ID preview"): Checks `getByText("user-abc")`. Still rendered (authorId.slice(0, 8)). PASSES.
- Test 3 ("renders relative date"): Checks regex `/ago|just now|Jan/i`. The new format drops "ago" but still shows "now" for recent times, and "Jan" for old dates, plus "m", "h", "d" format. The regex `/ago|just now|Jan/i` will NOT match `"2m"` since "ago" is dropped and "just now" is now "now". **NEEDS UPDATE**: Change regex to `/now|m$|h$|d$|Jan/i` or more simply `/\d+[mhd]|now|Jan/i`.
- Test 4 ("calls onPress"): Presses title text. Still works. PASSES.

**Required test change**: Test 3 regex update.

### `__tests__/components/PostList.test.tsx`
**Status: All 4 tests should pass without changes.**
- Tests check for text content ("First Post", "Second Post", "No posts yet", "No posts found") and onPostPress callback. None depend on layout structure. All PASS.

### `__tests__/components/SearchBar.test.tsx`
**Status: 3 of 4 tests need updates.**
- Test 1 ("renders text input with placeholder"): `getByPlaceholderText("Search posts...")` -- **NEEDS UPDATE** to `"Search"`.
- Test 2 ("calls onChangeText when typing"): Uses same placeholder -- **NEEDS UPDATE** to `"Search"`.
- Test 3 ("does not show clear button when empty"): Checks `queryByText("close")` -- **NEEDS UPDATE** to `"close-circle"`.
- Test 4 ("shows clear button and calls onClear"): `getByText("close")` -- **NEEDS UPDATE** to `"close-circle"`.

---

## Implementation Order

1. **PostCard.tsx** -- Core visual change; everything else depends on this shape
2. **SkeletonCard.tsx** -- Must mirror PostCard structure
3. **PostList.tsx** -- Adjust FlashList padding, EmptyState styling
4. **SearchBar.tsx** -- Independent, can be done in parallel
5. **index.tsx** (FeedScreen) -- Header and background color changes
6. **_layout.tsx** (Home Stack) -- Stack-wide header defaults
7. **Tests** -- Update the 4 affected test assertions

## Potential Risks

1. **Thread line `flex-1`**: The thread line uses `flex-1` to fill available vertical space between avatar and divider. This works because the parent is a flex column. If the content is very short (1-line title, no content body), the thread line may look oddly long. Mitigation: use `minHeight: 20` and cap with a max reasonable height, or remove `flex-1` and use a fixed height of 20px. Starting with `flex-1` + `minHeight: 20` is the more authentic Threads approach.

2. **FlashList `estimatedItemSize`**: Currently missing. Adding `estimatedItemSize={120}` is important for FlashList performance. The value is approximate -- height of avatar row (~36) + title (~20) + content (~40) + padding (~24) = ~120px.

3. **`ml-16` magic number for divider alignment**: `ml-16` = 64px. Avatar (36px) + gap (12px = ml-3) = 48px. This means the divider starts 16px to the right of the content column's left edge. In Threads, the divider starts exactly at the content column. So `ml-12` (48px) would be more precise. However, Threads actually indents the divider slightly past the avatar -- `ml-[48px]` would be pixel-perfect. Use `ml-12` since Tailwind doesn't have ml-[48px] natively but `ml-12 = 3rem = 48px` in NativeWind. Actually `ml-12` in Tailwind = `margin-left: 3rem` = 48px at default 16px base. Use `ml-12`.

   **Correction**: Let me verify. In NativeWind/Tailwind, `ml-12` = `margin-left: 48px` (12 * 4 = 48). Avatar width (36px/w-9 = 36px) + gap (ml-3 = 12px) = 48px. So `ml-12` perfectly aligns the divider with the start of the content column. Use `ml-12`.

4. **NativeWind `text-[15px]` support**: NativeWind supports arbitrary values with `text-[15px]`. This is standard Tailwind JIT syntax. Should work.

---

## Summary of All File Changes

| File | Changes |
|------|---------|
| `src/components/PostCard.tsx` | Remove card/shadow/chevron, two-column layout with thread line, compact time format, hairline divider, opacity press feedback |
| `src/components/ui/SkeletonCard.tsx` | Mirror new PostCard layout, add thread line shimmer, hairline divider, neutral colors |
| `src/components/PostList.tsx` | Remove horizontal padding from FlashList, add estimatedItemSize, simplify EmptyState |
| `src/components/SearchBar.tsx` | Remove focus states, flat neutral-100 bg, rounded-2xl, change placeholder, close-circle icon |
| `app/(app)/(home)/index.tsx` | White bg, remove large title header, semibold header, headerShadowVisible: false |
| `app/(app)/(home)/_layout.tsx` | Add screenOptions for white headers, black tint across stack |
| `__tests__/components/PostCard.test.tsx` | Update date regex in test 3 |
| `__tests__/components/SearchBar.test.tsx` | Update placeholder text and icon name in 3 tests |
