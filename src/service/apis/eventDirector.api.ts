import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";
export const getallEventDirectors = catchAsync(async () => {
  const response = await httpsCall.get(`/admin/user-management/eventdirector/all`);
  return response;
});