import { forwardRef } from "react";

import { type TextInput, type TextInputProps } from "react-native";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import Input from "@/components/ui/Input";

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, "value"> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  error?: string;
}

function FormInputInner<T extends FieldValues>(
  { control, name, label, error, ...inputProps }: FormInputProps<T>,
  ref: React.ForwardedRef<TextInput>,
) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          ref={ref}
          label={label}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          error={error}
          {...inputProps}
        />
      )}
    />
  );
}

const FormInput = forwardRef(FormInputInner) as <T extends FieldValues>(
  props: FormInputProps<T> & { ref?: React.ForwardedRef<TextInput> },
) => React.ReactElement;

export default FormInput;
