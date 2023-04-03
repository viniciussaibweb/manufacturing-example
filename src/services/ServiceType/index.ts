import { ApiService, ApiTypes } from "../api";
import { TypeData } from "./types";

export class TypeService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);


  async getAll(): Promise<Array<TypeData>> {
    const response = await this.api.get(`/industrial-maintenance/service-type`)
    return response.data;
  }

  async getOneFilter(filter?: string): Promise<Array<TypeData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(`/industrial-maintenance/service-type`, {
      params: params,
    });

    return response.data;
  }

  async deleteServiceType(id: number) {
    return await (
      await this.api.delete(`/industrial-maintenance/service-type/${id}`
      )
    ).data;
  }
  async postServiceType(paramsTypes: { id?: number; description: string }) {
    const objRequest = {
      description: paramsTypes.description,
    }

    return (await this.api.post("/industrial-maintenance/service-type", objRequest)).data
  }

  async patchServiceType(paramsTypes: { id?: number; description: string }) {

    const objRequest = {
      description: paramsTypes.description
    }

    const response = await this.api.patch(`/industrial-maintenance/service-type/${paramsTypes.id}`, objRequest)
  }
}
