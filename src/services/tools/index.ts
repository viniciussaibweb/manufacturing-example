import { ApiService, ApiTypes } from "../api";
import { ToolData } from "./types";

export class ToolsService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  async getAll(description?: string): Promise<Array<ToolData>> {
    const response = await this.api.get(
      `/industrial-maintenance/tool?filter=${description}`
    );

    return response.data;
  }

  async deleteTool(mafeId: number) {
    return await (
      await this.api.delete(`/industrial-maintenance/tool/${mafeId}`)
    ).data;
  }

  async postTool(description: string) {
    const objRequest = {
      mafeDescricao: description,
    };
    return await (
      await this.api.post("/industrial-maintenance/tool", objRequest)
    ).data;
  }
}
