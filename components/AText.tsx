import React from "react";
import {
  Text,
  TextInput,
  TextProps,
  TextInputProps,
  TextStyle,
  StyleSheet,
} from "react-native";
import { resolveFontFamily, hasArabic } from "@/constants/fonts";

function flattenStyle(style: any): TextStyle {
  return (StyleSheet.flatten(style) as TextStyle) ?? {};
}

function injectFont(style: any, content: unknown): any {
  const flat = flattenStyle(style);
  const family = resolveFontFamily(content, flat.fontFamily);
  if (family === flat.fontFamily) return style;
  return [style, { fontFamily: family }];
}

function childrenToString(children: React.ReactNode): string {
  if (children == null || children === false) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToString).join("");
  if (React.isValidElement(children)) return childrenToString((children.props as any).children);
  return "";
}

/**
 * Drop-in replacement for `<Text>` that automatically uses Teshrin
 * for Arabic content. Pass styles exactly as you would to `<Text>`.
 */
export function AText({ style, children, ...rest }: TextProps) {
  const text = childrenToString(children);
  return <Text style={injectFont(style, text)} {...rest}>{children}</Text>;
}

/**
 * Drop-in replacement for `<TextInput>` that automatically uses
 * Teshrin while the user types Arabic, and falls back to the
 * provided font (Nunito) for Latin input.
 */
export function ATextInput(props: TextInputProps) {
  const { style, value, defaultValue, placeholder, onChangeText, ...rest } = props;
  const [internal, setInternal] = React.useState<string>(
    typeof value === "string" ? value : (defaultValue ?? ""),
  );

  React.useEffect(() => {
    if (typeof value === "string") setInternal(value);
  }, [value]);

  const sample = (typeof value === "string" ? value : internal) || placeholder || "";
  const finalStyle = injectFont(style, hasArabic(sample) ? sample : (placeholder ?? sample));

  return (
    <TextInput
      style={finalStyle}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChangeText={(t) => {
        setInternal(t);
        onChangeText?.(t);
      }}
      {...rest}
    />
  );
}
