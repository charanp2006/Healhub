export type BillingStatus = "Pending" | "Paid";

export interface Billing {
  _id: string;
  hospitalId: string | { _id: string; name: string; city: string; image?: string };
  totalAppointments: number;
  totalRevenue: number;
  commissionPercentage: number;
  commissionAmount: number;
  netPayable: number;
  bedAllocations: number;
  bedRevenue: number;
  grandTotal: number;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  status: BillingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
