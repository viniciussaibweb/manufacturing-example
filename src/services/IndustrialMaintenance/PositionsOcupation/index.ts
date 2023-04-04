import { ApiService, ApiTypes } from "../../api";
import { PositionsOcupationData } from "./types";

export class PositionOcupationService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  async getAll(filter?: string): Promise<Array<PositionsOcupationData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(`/industrial-maintenance/position-ocupation`, {
      params: params
    });

    return response.data;
  }

  async postPositionOcupation(paramsTypes: { id?: number; description: string }) {
    const objRequest = {
      description: paramsTypes.description
    }

    return (await this.api.post("/industrial-maintenance/position-ocupation", objRequest)).data
  }

  async deletePositionOcupation(id: number) {
    return (await this.api.delete(`/industrial-maintenance/position-ocupation/${id}`)).data
  }
  async patchPositionOcupation(paramsTypes: { id?: number; description: string }) {
    const objRequest = {
      description: paramsTypes.description
    }

    return (await this.api.patch(`/industrial-maintenance/position-ocupation/${paramsTypes.id}`, objRequest)).data
  }
}  