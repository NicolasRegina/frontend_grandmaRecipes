import { AuthProvider } from "./context/AuthContext";
import { ModerationProvider } from "./context/ModerationContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <ModerationProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 4000,
            },
          }}
        />
      </ModerationProvider>
    </AuthProvider>
  );
}

export default App;
