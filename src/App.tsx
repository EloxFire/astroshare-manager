import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router';
import Home from './pages/Home.tsx';
import { routes } from './helpers/routes.ts';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Contents } from './pages/Contents.tsx';
import { UsersPage } from './pages/Users.tsx';
import { Changelogs } from './pages/contents/Changelogs.tsx';
import { AppNewsPage } from './pages/contents/AppNews.tsx';
import { LoginPage } from './pages/Login.tsx';
import { useAuth } from './context/AuthContext.tsx';
import { UserRoles } from './helpers/types/User.ts';
import { ResourcesPage } from './pages/contents/Resources.tsx';

const AppLayout = () => (
  <div id="app">
    <Sidebar />
    <main className="main-content">
      <Navbar />
      <Outlet />
    </main>
  </div>
);

const RequireAuth = () => {
  const { currentUser, isAuthReady } = useAuth();
  const isAdmin = Boolean(currentUser && currentUser.role === UserRoles.ADMIN);

  console.log('[RequireAuth] currentUser:', currentUser);

  if (!isAuthReady) {
    return null;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path={routes.home.path} element={<Home />} />
            <Route path={routes.contents.path} element={<Contents />} />
            <Route path={routes.users.path} element={<UsersPage />} />
            <Route path={routes.changelogs.path} element={<Changelogs />} />
            <Route path={routes.newsBanners.path} element={<AppNewsPage />} />
            <Route path={routes.resources.path} element={<ResourcesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={routes.home.path} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
