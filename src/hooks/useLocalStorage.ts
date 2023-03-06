import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, fallbackValue: string) {
  const [value, setValue] = useState(fallbackValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue || storedValue === 'undefined' || storedValue === 'null') {
      setValue(fallbackValue);
      return;
    }

    setValue(storedValue as unknown as string);
  }, [key, fallbackValue]);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
