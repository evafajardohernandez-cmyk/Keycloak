import { createContext, useContext, useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const AuthContext = createContext(null);

export const  AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const isRun = useRef(false);
  const keycloak = useRef(null);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const redirectUri = window.location.origin;
    const origin = window.location.origin;
    const silentCheckSsoRedirectUri = `${origin}/silent-check-sso.html`;

    keycloak.current = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
    });

    keycloak.current
      .init({
      onLoad: 'check-sso',
      checkLoginIframe: true,
      silentCheckSsoRedirectUri: silentCheckSsoRedirectUri,
      enableLogging: false,
      redirectUri: redirectUri,
      })
      .then((authenticated) => {
        if (authenticated) {
          setAuth({
            accessToken: keycloak.current.token,
            refreshToken: keycloak.current.refreshToken,
            isLogin: true,
          });
        } else {
          setAuth({ isLogin: false });
        }
      })
      .catch((err) => console.error("Error inicializando Keycloak:", err));
  }, []);
  
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export default useAuth;


// https://keycloakgd.millenium.com.co/realms/ProductionKCAuthetication/protocol/openid-connect/auth?client_id=40805f1d-fff9-411e-baa8-fee23a320a26&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F&state=bc4a50e6-28e6-4593-a6c9-15c9d77a1e3e&response_mode=fragment&response_type=code&scope=openid&nonce=fe0ec9dc-e5c5-4ec6-80e9-e9baebee3ece&code_challenge=4Zbs3IAPxVQXJHBTva8rbl2SEMNBtJEgWJtrLS-SHg0&code_challenge_method=S256


