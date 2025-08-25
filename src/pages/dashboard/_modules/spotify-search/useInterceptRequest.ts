import { useAuthContext } from "@/stores";
import { request } from "@/utils/appHelpers";
import { useEffect } from "react";

const useInterceptRequest = () => {
  const { spotifyToken, setSpotifyToken } = useAuthContext();

  useEffect(() => {
    const requestIntercept = request.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${spotifyToken || "invalid token"}`;
        }

        return config;
      },
      (err) => Promise.reject(err), // Do something with response error
    );

    const responseIntercept = request.interceptors.response.use(
      (response) => response,
      async (err) => {
        // Do something with response error
        const prevRequest = err?.config;

        if (err?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const res = await request.get<{
            data: { access_token: string };
          }>("/spotify/token");

          if (res.data) {
            const token = res.data.data.access_token;
            setSpotifyToken(token);
            prevRequest.headers["Authorization"] = `Bearer ${token}`;
          }

          return request(prevRequest);
        }
        return Promise.reject(err);
      },
    );

    return () => {
      request.interceptors.request.eject(requestIntercept);
      request.interceptors.response.eject(responseIntercept);
    };
  }, [spotifyToken]);

  return request;
};

export default useInterceptRequest;
