import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import {routes} from "./helpers/routes.ts";
import './styles/global.scss';
import { Navbar } from "./components/Navbar.tsx";

function App() {

  return (
    <div id='app'>
      <BrowserRouter>
      <Navbar />
        <Routes>
           <Route index path={routes.home.path} element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
