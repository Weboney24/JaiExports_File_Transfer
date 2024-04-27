/* eslint-disable no-useless-catch */
import axios from "axios";

let base_url = import.meta.env.VITE_BASE_URL;

export let client_url = import.meta.env.VITE_CLIENT_URL;
export let server_url = import.meta.env.VITE_SERVER_URL;

const axiosCustomRequest = axios.create({
  baseURL: base_url,
});

axiosCustomRequest.interceptors.request.use((config) => {
  let token = localStorage.getItem("6F9d2H5s8R3g7P1w4T6s8P3w1R7g9D2h");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// administration

export const createUser = async (formData) =>
  await axiosCustomRequest.post(`${base_url}/user/create_new_user`, formData);

export const getAllUser = async () =>
  await axiosCustomRequest.get(`${base_url}/user/get_all_user`);

export const getAllUserWithAdmin = async () =>
  await axiosCustomRequest.get(`${base_url}/user/get_all_user_admin`);

export const updateUser = async (formData, id) =>
  await axiosCustomRequest.put(`${base_url}/user/update_user/${id}`, formData);

export const deleteUser = async (id) =>
  await axiosCustomRequest.delete(`${base_url}/user/delete_user/${id}`);

// authentication

export const authUser = async (formData) =>
  await axios.post(`${base_url}/auth/auth_user`, formData);

// file transfer

export const uploadFiles = async (formData, onUploadProgress) => {
  try {
    const response = await axiosCustomRequest.post(
      `${base_url}/transfer/make_transfer`,
      formData,
      {
        onUploadProgress: onUploadProgress,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransfer = async (id) =>
  await axiosCustomRequest.delete(
    `${base_url}/transfer/delete_one_user_files/${id}`
  );

export const removeTransferPassword = async (formData) =>
  await axiosCustomRequest.put(
    `${base_url}/transfer/remove_file_password`,
    formData
  );

export const updateTransferPassword = async (formData) =>
  await axiosCustomRequest.put(
    `${base_url}/transfer/remove_file_password`,
    formData
  );

// my files

export const getOneUserFiles = async () =>
  await axiosCustomRequest.get(`${base_url}/transfer/get_one_user_files`);

export const getAllUserFiles = async () =>
  await axiosCustomRequest.get(`${base_url}/transfer/get_all_user_files`);

// dashboard

export const getAllCounts = async () =>
  await axiosCustomRequest.get(`${base_url}/dashboard/get_all_counts`);

export const getTodayTransfers = async (formData) =>
  await axiosCustomRequest.get(
    `${base_url}/dashboard/get_today_transfer/${formData}`
  );

// file access
export const getPerticularFile = async (id) =>
  await axios.get(`${base_url}/get_shared_file/${id}`);

export const verifyFilePassword = async (formData) =>
  await axios.post(`${base_url}/verify_file_password`, formData);

export const getLinkStatus = async (id) =>
  await axios.get(`${base_url}/get_link_status/${id}`);

// send mail
export const sendMail = async (formData) =>
  await axiosCustomRequest.post(
    `${base_url}/dashboard/set_invitationmail`,
    formData
  );

export const updateDownloadCount = async (formData) =>
  await axios.put(`${base_url}/update_download_count`, formData);

// password

export const changePassword = async (formData) =>
  await axiosCustomRequest.put(
    `${base_url}/dashboard/update_password`,
    formData
  );

// user role

export const checkUserRole = async () =>
  await axiosCustomRequest.get(`${base_url}/dashboard/check_user_role`);


  export const deleteLinkParser = async (id) =>
  await axios.get(`${base_url}/delete_link_after_expire`);