import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

type LoginData = {
  email: string;
  password: string;
};

type ForgotPaawordData = {
  email: string;
};

type ResetPasswordData = {
  password: string;
  cpassword: string;
};

type changePasswordData = {
  password_old: string;
  password_new: string;
};

export const logInApi = catchAsync(async (values: LoginData) => {
  try {
    const data = await httpsCall.post(`/admin/login`, values);
    return data;
  } catch (error) {
    throw error; // Re-throw the error to propagate it
  }
});

export const forgotPasswordApi = catchAsync(
  async (values: ForgotPaawordData) => {
    const data = await httpsCall.post(`/admin/forgot-password`, values);
    return data;
  }
);

export const resetPasswordApi = catchAsync(
  async (values: ResetPasswordData) => {
    const data = await httpsCall.patch(`/admin/reset-password`, values);
    return data;
  }
);

export const changePasswordApi = catchAsync(
  async (values: changePasswordData) => {
    const data = await httpsCall.patch(
      `/admin/profile/change-password`,
      values
    );
    return data;
  }
);

export const dashboardApi = catchAsync(async (values: any) => {
  const data = await httpsCall.get(`/admin/dashboard/get`, values);
  return data;
});
