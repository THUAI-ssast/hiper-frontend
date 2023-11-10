import { Route, Router, Routes } from "@solidjs/router";
import Header from "./components/Header";

import "./index.css"
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Homepage from "./components/Homepage";
import Users from "./components/Users";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset" component={ResetPassword} />
        <Route path="/users/:username" component={Users} />
        <Route path="/" element={Homepage} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </>
  );
}

export default App;