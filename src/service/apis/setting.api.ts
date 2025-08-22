import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getsettings = catchAsync(async () => {
  const response = await httpsCall.get(`/admin/setting/getsettings`);
  return response;
});

export const savesettings = catchAsync(async (values, id) => {
  const data = await httpsCall.patch(
    `/admin/setting/savesettings/${id}`,
    values
  );
  return data;
});

export const updateHeaderLogo = catchAsync(async (values, id) => {
  const data = await httpsCall.patch(
    `/admin/setting/header-logo-update/${id}`,
    values
  );
  return data;
});

export const updateFooterLogo = catchAsync(async (values, id) => {
  const data = await httpsCall.patch(
    `/admin/setting/footer-logo-update/${id}`,
    values
  );
  return data;
});

export const PauseAuction = catchAsync(async (values, id) => {
  const data = await httpsCall.patch(
    `/admin/setting/saveTimeSetting/${id}`,
    values
  );
  return data;
});