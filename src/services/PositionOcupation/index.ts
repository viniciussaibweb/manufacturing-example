import { ApiService, ApiTypes } from "../api";
import { PositionOcupationData } from "./types";

export class PositionOcupationService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  async getAll(description?: string): Promise<Array<PositionOcupationData>> {
    const response = await this.api.get(`/industrial-maintenance/position-ocupation?filter=${description}`);

    return response.data;
  }

  async postPositionOcupation(description: string) {
    const objRequest = {
      description: description
    }

    return (await this.api.post("/industrial-maintenance/position-ocupation")).data
  }

  async deletePositionOcupation(id: number) {
    return (await this.api.delete(`/industrial-maintenance/position-ocupation/${id}`)).data
  }
}