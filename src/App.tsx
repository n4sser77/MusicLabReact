import "./App.css";

import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Dashboard from "./components/ui/dashboard";
import { AuthForm } from "./components/ui/authForm";
import { useAuth } from "./contexts/AuthContext";
import { InvisibleFileDropProvider } from "./components/invisibleFileDropProvider";
import { getUserIdFromToken } from "./utils/token";

function App() {
  const { isAuthenticated, userId } = useAuth();
  


  return (
    <>
      <InvisibleFileDropProvider userId={userId}>
        {/* sidebar */}
        <SidebarProvider>
          <AppSidebar />
          {!isAuthenticated && <AuthForm />}

          <main className="p-5 ">
            <SidebarTrigger className="mb-2" />

            {/* maincontent */}

            {isAuthenticated && <Dashboard />}

            <audio id="audioPlayer"></audio>
          </main>
        </SidebarProvider>
      </InvisibleFileDropProvider>
    </>
  );
}

export default App;
