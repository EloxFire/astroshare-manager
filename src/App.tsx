import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import {routes} from "./helpers/routes.ts";

function App() {

  return (
    <BrowserRouter>
      <Routes>
         <Route index path={routes.home.path} element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
