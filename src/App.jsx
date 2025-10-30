import Protected from "./components/Protected";
import Public from "./components/Public";
import useAuth from "./hooks/useAuth";

function App() {
  const context = useAuth();

  if (!context) return <div>Cargando autenticación...</div>;

  const { auth } = context;

  return auth?.isLogin ? <Protected /> : <Public />;
}

export default App;

