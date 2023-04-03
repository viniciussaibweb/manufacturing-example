import { ApiService, ApiTypes } from "../api";
import { MaintenaceTypeData } from "./types";

export class MaintenaceTypeService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE)

  async getAll(description?: string): Promise<Array<MaintenaceTypeData>> {
    const response = await this.api.get(`/industrial-maintenance/maintenance-type?filter=${description}`);

    return response.data;
  }

  async deleteMaitenanceType(id: number) {
    return (await this.api.delete(`/industrial-maintenance/maintenance-type/${id}`)).data
  }

  async postMaitenanceType(description: string) {
    const objRequest = {
      description: description,
    }

    return (await this.api.post("/industrial-maintenance/service-type")).data
  }
  async patchMaitenanceType(params: MaintenaceTypeData) {
    const id = params.id;

    const objRequest = {
      description: params.description
    }

    const response = await this.api.patch(`/industrial-maintenance/tool/${id}`, objRequest)
    return response
  }
}