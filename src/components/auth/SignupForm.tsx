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
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { useAuthLoading, getSignup } from "@/hooks/useAuth";
import { signupSchema, type SignupFormData } from "@/utils/validation";

export default function SignupForm() {
  const isLoading = useAuthLoading();
  const lastnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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
      await getSignup()(data);
    } catch (error) {
      // Error toast is shown by the auth store
      if (__DEV__) console.error("Signup failed:", error);
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
          <Text className="text-3xl font-bold text-center text-gray-900">Create Account</Text>
          <Text className="mt-2 text-center text-gray-500">Sign up to get started</Text>
        </View>

        <FormInput
          control={control}
          name="firstname"
          label="First Name"
          placeholder="John"
          autoCapitalize="words"
          autoComplete="given-name"
          returnKeyType="next"
          onSubmitEditing={() => lastnameRef.current?.focus()}
          error={errors.firstname?.message}
        />

        <FormInput
          ref={lastnameRef}
          control={control}
          name="lastname"
          label="Last Name"
          placeholder="Doe"
          autoCapitalize="words"
          autoComplete="family-name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          error={errors.lastname?.message}
        />

        <FormInput
          ref={emailRef}
          control={control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={errors.email?.message}
        />

        <FormInput
          ref={passwordRef}
          control={control}
          name="password"
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onSubmit)}
          error={errors.password?.message}
        />

        <View className="mt-2">
          <Button title="Create Account" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
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
