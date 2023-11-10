import { Route, Router, Routes } from "@solidjs/router";
import Header from "./components/Header";

import "./index.css"
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset" component={ResetPassword} />
      </Routes>
    </>
  );
}

export default App;