import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export const useFetch = (url: string) => {
  const { data, error } = useSWR(url, fetcher);

  return { data, loading: !error && !data, error };
};
