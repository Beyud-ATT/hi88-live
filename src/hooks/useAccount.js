import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { getMe } from "../services/accountAPI";

export default function useAccount() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["account"],
    queryFn: getMe,
    enabled: isAuthenticated,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
