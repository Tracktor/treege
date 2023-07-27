import { QueryClient } from "@tanstack/react-query";

const queryConfig = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default queryConfig;
