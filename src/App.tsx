import "./App.css";

import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Dashboard from "./components/ui/dashboard";

function App() {
  return (
    <>
      {/* sidebar */}

      <SidebarProvider>
        <AppSidebar />
        <main className="p-2">
          <SidebarTrigger className="mb-2" />
          
          

          {/* maincontent */}
          <Dashboard />
        </main>
      </SidebarProvider>
    </>
  );
}

export default App;
