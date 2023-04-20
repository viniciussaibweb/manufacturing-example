import { ApiService, ApiTypes } from "../../api";
import { ShiftData } from "./types";

export class ShiftService {

  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);


  async getAll(filter?: string): Promise<Array<ShiftData>> {

    const params = {
      filter: filter
    }
    const response = await this.api.get(`/industrial-maintenance/shift`, {
      params: params
    })
    return response.data
  }

  async deleteShift(id: number) {
    return (await this.api.delete(`/industrial-maintenance/shift/${id}`)).data
  }

  async postShift(paramsShift: {
    id?: number; description: string;
    startTime: string;
    endTime: string;
    startBreakTime: string; endBreakTime: string
  }) {
    const objRequest = {
      description: paramsShift.description,
      startTime: paramsShift.startTime,
      endTime: paramsShift.endTime,
      startBreakTime: paramsShift.startBreakTime,
      endBreakTime: paramsShift.endBreakTime
    }

    const response = await this.api.post("/industrial-maintenance/shift", objRequest)

    return response;
  }

  async patchShift(paramsShift: {
    id?: number; description: string;
    startTime: string;
    endTime: string;
    startBreakTime: string; endBreakTime: string
  }) {
    const objRequest = {
      description: paramsShift.description,
      startTime: paramsShift.startTime,
      endTime: paramsShift.endTime,
      startBreakTime: paramsShift.startBreakTime,
      endBreakTime: paramsShift.endBreakTime
    }

    const response = await this.api.patch(`/industrial-maintenance/shift/${paramsShift.id}`, objRequest)

    return response;
  }
}