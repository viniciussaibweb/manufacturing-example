import { ApiService, ApiTypes } from "../../api";
import { CenterCostData } from "./types";

export class CenterCostService {

  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);


  async getAll(filter?: string): Promise<Array<CenterCostData>> {

    const params = {
      filter: filter
    }
    const response = await this.api.get(`/industrial-maintenance/center-cost`, {
      params: params
    })
    return response.data
  }

  async deleteCenterCost(id: number) {
    return (await this.api.delete(`/industrial-maintenance/center-cost/${id}`)).data
  }

  async postCenterCost(paramsCenterCost: { id?: number; description: string; tag: string }) {
    const objRequest = {
      description: paramsCenterCost.description,
      tag: paramsCenterCost.tag
    }

    const response = await this.api.post("/industrial-maintenance/center-cost", objRequest)

    return response;
  }

  async patchCenterCost(paramsCenterCost: { id?: number; description: string; tag: string }) {
    const objRequest = {
      description: paramsCenterCost.description,
      tag: paramsCenterCost.tag
    }

    const response = await this.api.patch(`/industrial-maintenance/center-cost/${paramsCenterCost.id}`, objRequest)

    return response;
  }
}