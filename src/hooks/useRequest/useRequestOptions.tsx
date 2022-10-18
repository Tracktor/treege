import { useContext } from "react";
import { AuthContext } from "@/context/Auth/AuthConext";

const useRequestOptions = () => {
  const { authToken } = useContext(AuthContext);

  const headers = { Authorization: `Bearer ${authToken}` };

  return {
    headers,
  };
};

export default useRequestOptions;
