export type EntityType = "individual" | "company";

export interface Company {
  id: string;
  name: string;
  registrationNumber?: string;
  country?: string;
  description?: string;
}

export interface Individual {
  id: string;
  name: string;
  country?: string;
  remarks?: string;
}

export interface Shareholding {
  id: string;
  companyId: string; // owned company
  holderId: string; // owner (company or individual id)
  holderType: EntityType;
  ownership: number;
  voting?: number;
  control?: number;
}

export interface UboState {
  companies: Company[];
  individuals: Individual[];
  shareholdings: Shareholding[];
  threshold: number;
  rootCompanyId: string | null;
}
