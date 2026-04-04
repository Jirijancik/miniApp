import Toast, { type ToastShowParams } from "react-native-toast-message";

const TOAST_SUCCESS_DURATION_MS = 3000;
const TOAST_ERROR_DURATION_MS = 4000;

export const showSuccessToast = (message: string, options?: ToastShowParams) => {
  Toast.show({
    type: "success",
    text1: message,
    visibilityTime: TOAST_SUCCESS_DURATION_MS,
    ...options,
  });
};

export const showErrorToast = (message: string, options?: ToastShowParams) => {
  Toast.show({
    type: "error",
    text1: message,
    visibilityTime: TOAST_ERROR_DURATION_MS,
    ...options,
  });
};
