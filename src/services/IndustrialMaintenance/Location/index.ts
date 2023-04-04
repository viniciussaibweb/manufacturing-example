import { ApiService, ApiTypes } from "../../api";
import { LocationData } from "./types";

export class LocationService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE)

  async getAll(filter?: string): Promise<Array<LocationData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(`/industrial-maintenance/location`, {
      params: params,
    });

    return response.data;
  }

  async deleteLocation(id: number) {
    return (await this.api.delete(`/industrial-maintenance/location/${id}`)).data
  }

  async postLocation(paramsMaitenanceTypes: { id?: number; description: string }) {
    const objRequest = {
      description: paramsMaitenanceTypes.description,
    }

    return (await this.api.post("/industrial-maintenance/location", objRequest)).data
  }
  async patchLocation(paramsMaitenanceTypes: { id?: number; description: string }) {

    const objRequest = {
      description: paramsMaitenanceTypes.description
    }

    const response = await this.api.patch(`/industrial-maintenance/location/${paramsMaitenanceTypes.id}`, objRequest)
    return response
  }
}