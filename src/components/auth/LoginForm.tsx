import { useRef } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  type TextInput,
  View,
} from "react-native";

import { Link } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuthLoading, getLogin } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/utils/validation";

export default function LoginForm() {
  const isLoading = useAuthLoading();
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await getLogin()(data.email, data.password);
    } catch {
      // Error toast already shown by the store
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-3xl font-bold text-center text-gray-900">MiniApp</Text>
          <Text className="mt-2 text-center text-gray-500">Sign in to your account</Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={passwordRef}
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <View className="mt-2">
          <Button title="Sign In" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500">Don&apos;t have an account? </Text>
          <Link href="/(auth)/signup">
            <Text className="font-semibold text-blue-600">Sign up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
