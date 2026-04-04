import ErrorBoundary from "@/components/ErrorBoundary";
import ProfileContent from "@/components/post/ProfileContent";
import { usePostNavigation } from "@/hooks/usePostNavigation";

export default function ProfileScreen() {
  const { navigateToPost } = usePostNavigation();

  return (
    <ErrorBoundary>
      <ProfileContent onPostPress={navigateToPost} />
    </ErrorBoundary>
  );
}
