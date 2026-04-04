import { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import CreatePostForm from "@/components/post/CreatePostForm";
import FAB from "@/components/ui/FAB";

export default function CreatePostSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <>
      <FAB onPress={handleOpenSheet} />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40 }}
      >
        <CreatePostForm onSuccess={handleCloseSheet} />
      </BottomSheet>
    </>
  );
}
