import { useFetch } from '@/hooks/useFetch';

export default function getMessages({ onlyCount = false } = {}) {
  if (onlyCount) {
    const { data, loading, error } = useFetch('/api/contact/messages/count');

    if (loading) return { loading: true };
    if (error) return { error };

    return { data };
  }

  const { data, loading, error } = useFetch('/api/contact/messages');

  if (loading) return loading;
  if (error) return error;

  return { data };
}
