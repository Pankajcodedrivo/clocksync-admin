import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";
import { ITeamsTable } from "../../interfaces/Itable";

export const teamsApi = catchAsync(async (values: any) => {
  const searchQuery = values.search || "";
  const data = await httpsCall.get(
    `/admin/team/get/${values.currentPage}/${values.limit}?search=${searchQuery}`,
    values
  );
  return data;
});
export const TeamDetails = catchAsync(async (id: any, values: any) => {
  const response = await httpsCall.get(`/admin/team/edit-team/${id}`);
  return response;
});

export const addTeam = catchAsync(async (values: any) => {
  const data = await httpsCall.post(`/admin/team/add-team`, values);
  return data;
});

export const deleteTeam = catchAsync(async (uid) => {
  const data = await httpsCall.delete(`/admin/team/delete-team/${uid}`);
  return data;
});

export const updateTeam = catchAsync(async (id, values: any) => {
  const data = await httpsCall.patch(`/admin/team/update-team/${id}`, values);
  return data;
});

export const resetAuctionApi= catchAsync(async ( values: any) => {
  const data = await httpsCall.patch(`/settings/teamStatus`, values);
  return data;
});