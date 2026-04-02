import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";

import { signupSchema, type SignupFormData } from "@/utils/validation";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthLoading } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignupScreen() {
  const isLoading = useAuthLoading();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", firstname: "", lastname: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await useAuthStore.getState().signup(data);
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
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-3xl font-bold text-center text-gray-900">
            Create Account
          </Text>
          <Text className="mt-2 text-center text-gray-500">
            Sign up to get started
          </Text>
        </View>

        <Controller
          control={control}
          name="firstname"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="First Name"
              placeholder="John"
              autoCapitalize="words"
              autoComplete="given-name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.firstname?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastname"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Last Name"
              placeholder="Doe"
              autoCapitalize="words"
              autoComplete="family-name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.lastname?.message}
            />
          )}
        />

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
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              autoComplete="new-password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <View className="mt-2">
          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text className="font-semibold text-blue-600">Sign in</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
