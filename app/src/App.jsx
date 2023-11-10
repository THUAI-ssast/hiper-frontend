import { Route, Router, Routes } from "@solidjs/router";
import Header from "./components/Header";

import "./index.css"
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </Routes>
    </>
  );
}

export default App;