export interface CompanyDetails {
  portalId: string;
  name: string;
  legalName: string | null;
  gstin: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  financialYearStartMonth: number;
  businessType: string | null;
}

export interface CompanyDetailsUpdateRequest {
  legalName: string;
  gstin: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  financialYearStartMonth: number;
  businessType: string;
}
