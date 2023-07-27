import { QueryClient } from "react-query";

const queryConfig = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default queryConfig;
