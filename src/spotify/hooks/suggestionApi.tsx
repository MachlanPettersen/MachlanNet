import { axiosInstance } from "../../common/Networking/apiConfig";
import {
  SongSuggestion,
  CreateSongSuggestionDTO,
} from "../../common/Types/apiTypes";

export const suggestionApi = {
  getAll: async (): Promise<SongSuggestion[]> => {
    const { data } = await axiosInstance.get("/suggestions");
    return data;
  },

  create: async (
    suggestion: CreateSongSuggestionDTO
  ): Promise<SongSuggestion> => {
    const { data } = await axiosInstance.post("/suggestions", suggestion);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/suggestions/${id}`);
  },
};
