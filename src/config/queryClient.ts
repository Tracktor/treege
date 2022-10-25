import { QueryClient } from "react-query";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export default queryClient;
