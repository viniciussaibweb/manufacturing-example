import { ApiService, ApiTypes } from "../api";
import { MaintenaceTypeData } from "./types";

export class MaintenaceTypeService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE)

  async getAll(filter?: string): Promise<Array<MaintenaceTypeData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(`/industrial-maintenance/maintenance-type`, {
      params: params,
    });

    return response.data;
  }

  async deleteMaitenanceType(id: number) {
    return (await this.api.delete(`/industrial-maintenance/maintenance-type/${id}`)).data
  }

  async postMaitenanceType(paramsMaitenanceTypes: { id?: number; description: string }) {
    const objRequest = {
      description: paramsMaitenanceTypes.description,
    }

    return (await this.api.post("/industrial-maintenance/maintenance-type", objRequest)).data
  }
  async patchMaitenanceType(paramsMaitenanceTypes: { id?: number; description: string }) {

    const objRequest = {
      description: paramsMaitenanceTypes.description
    }

    const response = await this.api.patch(`/industrial-maintenance/maintenance-type/${paramsMaitenanceTypes.id}`, objRequest)
    return response
  }
}