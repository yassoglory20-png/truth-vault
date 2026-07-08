import { useMemo } from 'react';

export function useReadingTime(content) {
  return useMemo(() => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [content]);
}
