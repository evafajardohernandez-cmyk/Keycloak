// import { useEffect } from "react";
// import useAuth from "./useAuth";
// import { axiosPrivate } from "../../backend/axios";
// import useRefreshToken from "./useRefreshtoken";


// const useAxiosPrivate = () => {
//   const refresh = useRefreshToken();
//   const { auth } = useAuth();               

//   useEffect(() => {
//     const requestIntercept = axiosPrivate.interceptors.request.use(
//       config => {
//         if (!config.headers['Authorization']) {
//           config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
//         }
//         return config;
//       },
//       error => Promise.reject(error)
//     );

//     const responseIntercept = axiosPrivate.interceptors.response.use(
//       response => response,
//       async error => {
//         const prevRequest = error?.config;
//         if (error?.response?.status === 403 && !prevRequest?.sent) {
//           prevRequest.sent = true;
//           const newAccessToken = await refresh();
//           prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;           
//           return axiosPrivate(prevRequest);
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosPrivate.interceptors.request.eject(requestIntercept);
//       axiosPrivate.interceptors.response.eject(responseIntercept);
//     };
//   }, [auth, refresh]);

//   return axiosPrivate;
// };

// export default useAxiosPrivate;



import { useEffect } from "react";
import useAuth from "./useAuth";
import { axiosPrivate } from "../../backend/axios";
import useRefreshToken from "./useRefreshtoken";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers["authorization"]) {
          config.headers["authorization"] = `Bearer ${auth?.accessToken}`;
          console.log("🟡 [Request] Usando accessToken actual:", auth?.accessToken?.slice(0, 20) + "...");
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => {
        console.log("🟢 [Response OK]", response.status, response.config.url);
        return response;
      },
      async error => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.warn("🔴 [403] Token expirado o inválido, intentando refresh...");
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            console.log("🟢 [Refresh] Nuevo accessToken recibido:", newAccessToken?.slice(0, 20) + "...");
            prevRequest.headers["authorization"] = `Bearer ${newAccessToken}`;
            console.log("🔁 [Retry] Reintentando solicitud a:", prevRequest.url);
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            console.error("❌ [Error] Falló el refresh token:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        console.error("❌ [Response Error]", error.response?.status, error.config?.url);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;

