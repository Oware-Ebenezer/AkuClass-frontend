import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/apiClient';

export function useAsync<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    loader().then(setData).catch((e: unknown) => setError(e instanceof ApiError ? e : new ApiError('unknown')))
      .finally(() => setLoading(false));
  }, [loader]);

  useEffect(load, [load]);
  return { data, error, loading, reload: load };
}
