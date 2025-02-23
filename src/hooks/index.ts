import { useState, useCallback, useEffect } from "react";

export function useHotKeys(whiteListKeys?: string[]) {
  const [keyEvent, setKeyEvent] = useState<KeyboardEvent | null>(null);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && whiteListKeys?.includes(event.key)) {
        event.preventDefault();
      }

      setKeyEvent(event);
    },
    [whiteListKeys]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    ctrlKey: keyEvent?.ctrlKey ?? false,
    shiftKey: keyEvent?.shiftKey ?? false,
    key: keyEvent?.key ?? null,
  };
}
