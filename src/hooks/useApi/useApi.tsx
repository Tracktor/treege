import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "@/context/Auth/AuthConext";
import { TreegeContext } from "@/features/Treege/context/TreegeContext";

const useApi = () => {
  const { authToken } = useContext(AuthContext);
  const { endPoint } = useContext(TreegeContext);

  const api = axios.create({
    baseURL: endPoint,
    headers: { Authorization: `Bearer ${authToken}` },
  });

  return { api };
};

export default useApi;
