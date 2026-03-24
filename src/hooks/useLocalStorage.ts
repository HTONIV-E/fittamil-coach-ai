import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const keyRef = useRef(key);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  // Re-read from localStorage when key changes
  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      try {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch {
        setStoredValue(initialValue);
      }
    }
  }, [key, initialValue]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const next = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(keyRef.current, JSON.stringify(next));
      return next;
    });
  }, []);

  return [storedValue, setValue];
}
