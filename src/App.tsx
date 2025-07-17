import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import {routes} from "./helpers/routes.ts";
import './styles/global.scss';
import Sidebar from "./components/Sidebar.tsx";

function App() {

  return (
    <div id='app'>
      <Sidebar/>
      <BrowserRouter>
        <Routes>
           <Route index path={routes.home.path} element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
