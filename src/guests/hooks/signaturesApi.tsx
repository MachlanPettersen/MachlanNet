import { axiosInstance } from "../../common/Networking/apiConfig";
import { CreateSignatureDTO, Signature } from "../../common/Types/apiTypes";

export const signatureApi = {
  getAll: async (): Promise<Signature[]> => {
    const { data } = await axiosInstance.get("/signatures");
    return data;
  },

  create: async (signature: CreateSignatureDTO): Promise<Signature> => {
    const { data } = await axiosInstance.post("/signatures", signature);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/signatures/${id}`);
  },
};
