// useSuggestion.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suggestionApi } from "./suggestionApi";
import { CreateSongSuggestionDTO } from "../../common/Types/apiTypes";

export function useSongSuggestions() {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: suggestionApi.getAll,
  });
}

export function useCreateSongSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSongSuggestionDTO) => suggestionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

export function useDeleteSongSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suggestionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}
