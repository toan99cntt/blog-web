import { axios } from 'src/boot/axios';
import {AxiosError, AxiosResponse, Method, ResponseType} from 'axios';
import {ApiResponse, Params} from 'src/models/api';
import {useRouter} from 'vue-router';
import { pushNotify } from 'src/helper/notify';
import {useAuthStore} from 'src/stores/auth/authStore';

export const apiRequest = (url: string, methodType: Method = 'get', requestData = {}, multipart = false, responseType: ResponseType = 'json') => {
  const authStore = useAuthStore();
  const accessToken = authStore.getAccessToken();
  const isOnline = window.navigator.onLine;
  const router = useRouter();
  let params: Params = {};
  let data = {};
  const headers: {'Content-Type'?: string, Authorization?: string} = {
    'Content-Type': 'application/json'
  };
  const source = axios.CancelToken.source();

  if (multipart)
    headers['Content-Type'] = 'multipart/form-data';

  if (!!accessToken)
    headers['Authorization'] = `Bearer ${accessToken}`;

  if(!isOnline)
    pushNotify('danger', 'Lỗi ngoại tuyến.');

  if (methodType === 'get' || methodType === 'GET')
    params = requestData;
  else
    data = requestData

  return new Promise<ApiResponse>(
      (resolve, reject) => {
          axios({
              baseURL: 'http://127.0.0.1:8000',
              method: methodType,
              url: url,
              data,
              params,
              headers,
              responseType: responseType,
              cancelToken: source.token
          })
              .then(async function (response: AxiosResponse<ApiResponse>) {
                  resolve(response.data);

              })
              .catch(function (error: AxiosError) {
                if (axios.isCancel(error)) {
                }
                else {
                  reject(error.response);
                }
              });
      });
};

export const buildParams = (params: Params) =>  {
    const arr: string[] = [];
    Object.keys(params).forEach(function(key: keyof Params) {
        arr.push(`${key as String}=${params[key]}`)
    });
    return '?' + arr.join('&');
};

export const buildFormData = (data: {[n: string]: string | number | [] | Blob | Blob[]}) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)){
      value.forEach(item => {
        
        formData.append(`${key}[]`, item);
        console.log(formData);
      });
    }
    else if (value instanceof Blob) {
      formData.append(key, value);
    }
    else {
      formData.append(key, !!value ? value.toString() : '');
    }

  }
  
  return formData;
};
