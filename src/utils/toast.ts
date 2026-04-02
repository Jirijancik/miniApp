import Toast, { ToastShowParams } from "react-native-toast-message";

export const showSuccessToast = (
  message: string,
  options?: ToastShowParams,
) => {
  Toast.show({
    type: "success",
    text1: message,
    visibilityTime: 3000,
    ...options,
  });
};

export const showErrorToast = (message: string, options?: ToastShowParams) => {
  Toast.show({
    type: "error",
    text1: message,
    visibilityTime: 4000,
    ...options,
  });
};
