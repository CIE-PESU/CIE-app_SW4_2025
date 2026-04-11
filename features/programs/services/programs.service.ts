import { BaseProgram, ProgramYear, ProgramStatus, YearStatus, ProgramStage } from "../types/program.types";

const getHeaders = (userId: string) => ({
  "Content-Type": "application/json",
  "x-user-id": userId,
});

async function apiFetch(url: string, userId: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(userId),
      ...options.headers,
    },
    cache: "no-store",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {};
  }
  
  return response.json();
}

export const programsService = {
  async getPrograms(userId: string): Promise<BaseProgram[]> {
    const data = await apiFetch("/api/programs", userId);
    return data.programs;
  },

  async getProgram(userId: string, programId: string): Promise<BaseProgram> {
    const data = await apiFetch(`/api/programs/${programId}`, userId);
    return data.program;
  },

  async createProgram(userId: string, data: Partial<BaseProgram>): Promise<BaseProgram> {
    const result = await apiFetch("/api/programs", userId, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.program;
  },

  async updateProgram(userId: string, programId: string, data: Partial<BaseProgram>): Promise<BaseProgram> {
    const result = await apiFetch(`/api/programs/${programId}`, userId, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result.program;
  },

  async archiveProgram(userId: string, programId: string): Promise<void> {
    await apiFetch(`/api/programs/${programId}`, userId, {
      method: "DELETE",
    });
  },

  async getProgramYears(userId: string, programId: string): Promise<ProgramYear[]> {
    const data = await apiFetch(`/api/programs/${programId}/years`, userId);
    return data.years;
  },

  async addProgramYear(userId: string, programId: string, data: any): Promise<ProgramYear> {
    const result = await apiFetch(`/api/programs/${programId}/years`, userId, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.year;
  },

  async updateProgramYear(userId: string, programId: string, yearId: string, data: any): Promise<ProgramYear> {
    const result = await apiFetch(`/api/programs/${programId}/years/${yearId}`, userId, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result.year;
  },

  async deleteProgramYear(userId: string, programId: string, yearId: string): Promise<void> {
    await apiFetch(`/api/programs/${programId}/years/${yearId}`, userId, {
      method: "DELETE",
    });
  },

  async getProgramYear(userId: string, programId: string, yearId: string): Promise<ProgramYear> {
    const data = await apiFetch(`/api/programs/${programId}/years/${yearId}`, userId);
    return data.year;
  },

  async enrollInYear(userId: string, programId: string, yearId: string): Promise<void> {
    await apiFetch(`/api/programs/${programId}/years/${yearId}/enroll`, userId, {
      method: "POST",
    });
  },

  async getProgramStages(userId: string, programId: string, yearId: string): Promise<ProgramStage[]> {
    const data = await apiFetch(`/api/programs/${programId}/years/${yearId}/stages`, userId);
    return data.stages;
  },

  async createStage(userId: string, programId: string, yearId: string, data: Partial<ProgramStage>): Promise<ProgramStage> {
    const result = await apiFetch(`/api/programs/${programId}/years/${yearId}/stages`, userId, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.stage;
  },

  async updateStage(userId: string, programId: string, yearId: string, stageId: string, data: Partial<ProgramStage>): Promise<ProgramStage> {
    const result = await apiFetch(`/api/programs/${programId}/years/${yearId}/stages/${stageId}`, userId, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result.stage;
  },

  async deleteStage(userId: string, programId: string, yearId: string, stageId: string): Promise<void> {
    await apiFetch(`/api/programs/${programId}/years/${yearId}/stages/${stageId}`, userId, {
      method: "DELETE",
    });
  },

  async reorderStages(userId: string, programId: string, yearId: string, orderedIds: string[]): Promise<void> {
    await apiFetch(`/api/programs/${programId}/years/${yearId}/stages/reorder`, userId, {
      method: "PATCH",
      body: JSON.stringify({ orderedIds }),
    });
  }
};
