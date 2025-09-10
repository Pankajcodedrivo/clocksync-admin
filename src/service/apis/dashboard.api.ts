import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getDashboardData = catchAsync(async () => {
  const data= await httpsCall.get("/admin/dashboard/get");
  return data; // return only the one-time code
});
