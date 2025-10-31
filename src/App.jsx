import Protected from "./components/Protected";
import useAuth from "./hooks/useAuth";

function App() {
  const context = useAuth();

  if (!context) return <div>Cargando autenticación...</div>;

  const { auth } = context;

  return auth?.isLogin ? <Protected /> : <use />;
}

export default App;

