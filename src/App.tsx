import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import { routes } from "./helpers/routes";
import { Navbar } from "./components/Navbar.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import { Contents } from "./pages/Contents.tsx";
import { UsersPage } from "./pages/Users.tsx";

import './styles/global.scss';


function App() {

  return (
    <div id='app'>
      <BrowserRouter>
        {/* SIDEBAR */}
        <Sidebar />
        {/* MAIN CONTENT */}
        <main className="main-content">
          <Navbar />
          <Routes>
            <Route index path={routes.home.path} element={<Home />}/>
            <Route index path={routes.contents.path} element={<Contents />}/>
            <Route index path={routes.users.path} element={<UsersPage />}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App
