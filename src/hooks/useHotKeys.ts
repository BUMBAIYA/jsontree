import React from "react";
import { useEffect } from "react";

type HotKey = {
  key?: string;
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  mod: boolean;
  shift: boolean;
};

export type HotkeyOptions = {
  preventDefault?: boolean;
};

export type HotkeyItem = [
  string,
  (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => void,
  { preventDefault?: boolean }?,
];

export function useHotkeys(
  hotkeys: HotkeyItem[],
  tagsToIgnore = ["INPUT", "TEXTAREA", "SELECT"],
  triggerOnContentEditable = false,
) {
  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      hotkeys.forEach(
        ([hotkey, handler, options = { preventDefault: true }]) => {
          if (
            getHotkeyMatcher(hotkey)(event) &&
            shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
          ) {
            if (options.preventDefault) {
              event.preventDefault();
            }
            handler(event);
          }
        },
      );
    };
    document.documentElement.addEventListener("keydown", keydownListener);
    return () =>
      document.documentElement.removeEventListener("keydown", keydownListener);
  }, [hotkeys, tagsToIgnore, triggerOnContentEditable]);
}

function parseHotkey(hotkey: string): HotKey {
  const keys = hotkey
    .toLowerCase()
    .split(",")
    .map((key) => key.trim());
  const modifierKeys = {
    alt: keys.includes("alt"),
    ctrl: keys.includes("ctrl"),
    meta: keys.includes("meta"),
    mod: keys.includes("mod"),
    shift: keys.includes("shift"),
  };
  const reservedKeys = ["alt", "ctrl", "meta", "shift", "mod"];
  const freeKey = keys.find((key) => !reservedKeys.includes(key));
  return { ...modifierKeys, key: freeKey };
}

function isExactHotkey(hotkeys: HotKey, event: KeyboardEvent) {
  const { alt, ctrl, meta, mod, shift, key } = hotkeys;
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey } = event;

  if (alt !== altKey) {
    return false;
  }
  if (mod) {
    if (!ctrlKey && !metaKey) {
      return false;
    }
  } else {
    if (ctrl !== ctrlKey) {
      return false;
    }
    if (meta !== metaKey) {
      return false;
    }
  }
  if (shift !== shiftKey) {
    return false;
  }
  if (
    key &&
    (pressedKey.toLowerCase() === key.toLowerCase() ||
      event.code.replace("Key", "").toLowerCase() === key.toLowerCase())
  ) {
    return true;
  }
  return false;
}

function getHotkeyMatcher(hotkey: string): (event: KeyboardEvent) => boolean {
  return (event) => isExactHotkey(parseHotkey(hotkey), event);
}

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false,
) {
  if (event.target instanceof HTMLElement) {
    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(event.target.tagName);
    }
    return (
      !event.target.isContentEditable &&
      !tagsToIgnore.includes(event.target.tagName)
    );
  }
  return true;
}

export function getHotkeyHandler(hotkeys: HotkeyItem[]) {
  return (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
    const _event = "nativeEvent" in event ? event.nativeEvent : event;
    hotkeys.forEach(([hotkey, handler, options = { preventDefault: true }]) => {
      if (getHotkeyMatcher(hotkey)(_event)) {
        if (options.preventDefault) {
          event.preventDefault();
        }
        handler(_event);
      }
    });
  };
}
