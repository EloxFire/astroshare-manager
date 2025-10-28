import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import { routes } from "./helpers/routes";
import './styles/global.scss';
import { Navbar } from "./components/Navbar.tsx";
import { Sidebar } from "./components/Sidebar.tsx";

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
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App
