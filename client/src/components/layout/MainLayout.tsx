import { Outlet } from "react-router-dom";
import PageContainer from "./PageContainer";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <h1> Main Layout HEre</h1>
      <Sidebar />
      <main>
        <TopNav />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
