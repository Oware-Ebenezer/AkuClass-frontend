import {SessionProvider} from "./context/SessionContext"
import {AppRoutes} from "./routes";

const App = () => {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  );
};

export default App;
