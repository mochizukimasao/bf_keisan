
export interface CalculationResult {
  orderAmount: string;
  orderAmountSubtext?: string;
  feeAmount: string;
  feeRate: string;
  netAmount: string;
  netBTCAmount?: string;
  copyableValues: {
    orderAmount: string;
    feeAmount: string;
    netAmount: string;
    netBTCAmount?: string;
  };
}