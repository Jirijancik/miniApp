import { useCallback, useRef } from "react";

import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import CreatePostForm from "@/components/post/CreatePostForm";
import FAB from "@/components/ui/FAB";

const SNAP_POINTS = ["90%"];
const BACKGROUND_STYLE = { borderTopLeftRadius: 20, borderTopRightRadius: 20 };
const HANDLE_INDICATOR_STYLE = { backgroundColor: "#d1d5db", width: 40 };

export default function CreatePostSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  return (
    <>
      <FAB onPress={handleOpenSheet} />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={BACKGROUND_STYLE}
        handleIndicatorStyle={HANDLE_INDICATOR_STYLE}
      >
        <CreatePostForm onSuccess={handleCloseSheet} />
      </BottomSheet>
    </>
  );
}
