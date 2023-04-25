import { ApiService, ApiTypes } from "../../api";
import { TaskData } from "./types";

export class TaksService {

  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);


  async getAll(filter?: string): Promise<Array<TaskData>> {

    const params = {
      filter: filter
    }
    const response = await this.api.get(`/industrial-maintenance/task`, {
      params: params
    })
    return response.data
  }

  async deleteTask(id: number) {
    return (await this.api.delete(`/industrial-maintenance/task/${id}`)).data
  }

  async postTask(paramsTaks: {
    id?: number; description: string;
    detail: string
  }) {
    const objRequest = {
      description: paramsTaks.description,
      detail: paramsTaks.detail
    }

    const response = await this.api.post("/industrial-maintenance/task", objRequest)

    return response;
  }

  async patchTask(paramsTaks: {
    id?: number; description: string;
    detail: string

  }) {
    const objRequest = {
      description: paramsTaks.description,
      detail: paramsTaks.detail
    }


    const response = await this.api.patch(`/industrial-maintenance/task/${paramsTaks.id}`, objRequest)

    return response;
  }
}