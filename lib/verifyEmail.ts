import axios from "axios";
import { baseURL } from "@/lib/utils/utils";

export const verifyEmail = async (email: string, verificationCode: string) => {
  try {
    const response = await axios.post(
      `${baseURL}user/verify/email`,
      {},
      {
        params: { email, verificationCode },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Email verification failed. Please try again.");
    }
  }
};


export const ConfirmEmail = async (email: string, verificationCode: string) => {
  try {
    const response = await axios.post(
      `${baseURL}user/match/code`,
      {},
      {
        params: { email, verificationCode },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Email verification failed. Please try again.");
    }
  }
};

export const resetPassword = async (id: string, password: string) => {
  try {
    const response = await axios.patch(
      `${baseURL}user/${id}`,
      {
        "password":password
      },
     
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Email verification failed. Please try again.");
    }
  }
};
