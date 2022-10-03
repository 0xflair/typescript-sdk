import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { createWebStoragePersister } from 'react-query/createWebStoragePersister';
import { persistQueryClient } from 'react-query/persistQueryClient';

const localStoragePersister =
  typeof window !== 'undefined'
    ? createWebStoragePersister({
        storage: window?.localStorage,
      })
    : undefined;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1_000 * 60 * 60 * 24,
      staleTime: 1_000 * 60 * 60 * 2,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 0,
    },
  },
});

if (localStoragePersister) {
  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
  });
}

type Props = {
  children?: React.ReactNode;
};

export const CommonProvider = (props: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};
