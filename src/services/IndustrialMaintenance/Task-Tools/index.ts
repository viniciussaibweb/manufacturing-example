import { ApiService, ApiTypes } from "../../api";
import { TaskToolsData } from "./types";

export class TaskToolService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  async getAll(idTask?: number): Promise<Array<TaskToolsData>> {
    const response = await this.api.get(
      `/industrial-maintenance/task-tool?idTask=${idTask}`
    );
    return response.data;
  }

  async deleteTaskTool(id: number){
    const response = await this.api.delete(`/industrial-maintenance/task-tool?idTask=${id}`)
  }

  async postTaskTool(
    paramsTaskTool: {
      quantity: number;
      idTask: number;
      idTool: number;
    }[]
  ) {
    const response = await this.api.post(
      "/industrial-maintenance/task-tool",
      paramsTaskTool
    );
  }
}
