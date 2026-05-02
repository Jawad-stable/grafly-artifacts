import React, { useEffect, useRef, useState } from "react";
import { Text, type StyleProp, type TextStyle } from "react-native";
import { TYPEWRITER_SPEED_MS } from "@/constants/critique";

interface TypewriterTextProps {
  text: string;
  active: boolean;
  style: StyleProp<TextStyle>;
  onTick?: () => void;
  onDone?: () => void;
}

// Reveals `text` one character at a time when `active` is true; jumps
// to the full text immediately when `active` is false. Used for the
// AI mentor's reply animation in the critique chat.
//
// `onTick` fires after every character so the parent can keep the
// scroll view pinned to the bottom; `onDone` fires once when the
// reveal finishes so the parent can clear its "currently animating"
// index.
export function TypewriterText({
  text,
  active,
  style,
  onTick,
  onDone,
}: TypewriterTextProps) {
  const [shown, setShown] = useState(active ? "" : text);
  const indexRef = useRef(0);
  const tickRef = useRef(onTick);
  const doneRef = useRef(onDone);
  tickRef.current = onTick;
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setShown(text);
      return;
    }
    indexRef.current = 0;
    setShown("");
    const timer = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setShown(text);
        clearInterval(timer);
        doneRef.current?.();
        return;
      }
      setShown(text.slice(0, indexRef.current));
      tickRef.current?.();
    }, TYPEWRITER_SPEED_MS);
    return () => clearInterval(timer);
  }, [text, active]);

  return (
    <Text style={style}>
      {shown}
      {active && shown.length < text.length ? (
        <Text style={{ opacity: 0.55 }}>▍</Text>
      ) : null}
    </Text>
  );
}
