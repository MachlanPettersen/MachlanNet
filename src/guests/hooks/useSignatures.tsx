import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSignatureDTO } from "../../common/Types/apiTypes";
import { signatureApi } from "./signaturesApi";

export function useSignatures() {
  return useQuery({
    queryKey: ["signatures"],
    queryFn: signatureApi.getAll,
  });
}

export function useCreateSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSignatureDTO) => signatureApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
    },
  });
}

export function useDeleteSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => signatureApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
    },
  });
}
