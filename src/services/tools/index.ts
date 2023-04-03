import { ApiService, ApiTypes } from "../api";
import { ToolData } from "./types";

export class ToolsService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  async getAll(filter?: string): Promise<Array<ToolData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(`/industrial-maintenance/tool`, {
      params: params,
    });

    return response.data;
  }

  async getById(id?: number): Promise<Array<ToolData>> {
    const response = await this.api.get(`/industrial-maintenance/tool/${id}`);

    if (Object.keys(response.data).length) {
      return [response.data];
    }
    return response.data;
  }

  async deleteTool(mafeId: number) {
    return await (
      await this.api.delete(`/industrial-maintenance/tool/${mafeId}`)
    ).data;
  }

  async postTool(paramsTool: { id?: number; description: string }) {
    const objRequest = {
      id: paramsTool.id,
      description: paramsTool.description,
    };
    return await (
      await this.api.post("/industrial-maintenance/tool", objRequest)
    ).data;
  }

  async patchTool(paramsTool: { id?: number; description: string }) {
    const objRequest = {
      description: paramsTool.description,
    };

    return await (
      await this.api.patch(
        `/industrial-maintenance/tool/${paramsTool.id}`,
        objRequest
      )
    ).data;
  }
}
