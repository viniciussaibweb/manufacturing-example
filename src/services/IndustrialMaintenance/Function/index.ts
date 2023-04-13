import { ApiService, ApiTypes } from "../../api";
import { FunctionData } from "./types";

export class FunctionService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  async getAll(filter?: string): Promise<Array<FunctionData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(`/industrial-maintenance/function`, {
      params: params,
    });

    return response.data;
  }


  async deleteFunction(id: number) {
    return await (
      await this.api.delete(`/industrial-maintenance/function/${id}`)
    ).data;
  }

  async postFunction(paramsFunction: { id?: number; description: string }) {
    const objRequest = {
      id: paramsFunction.id,
      description: paramsFunction.description,
    };
    return await (
      await this.api.post("/industrial-maintenance/function", objRequest)
    ).data;
  }

  async patchFunction(paramsFunction: { id?: number; description: string }) {
    const objRequest = {
      description: paramsFunction.description,
    };

    return await (
      await this.api.patch(
        `/industrial-maintenance/function/${paramsFunction.id}`,
        objRequest
      )
    ).data;
  }
}
