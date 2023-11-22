import { Route, Router, Routes } from "@solidjs/router";
import Header from "./components/Header";

import "./index.css"
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Homepage from "./components/Homepage";
import Users from "./components/Users";
import Game from "./components/Game";
import { onMount } from "solid-js";
import { checkLoggedIn } from "./utils";
import { Flex } from "@hope-ui/solid";

function App() {
  return (
    <Flex direction="column" height="100%">
      <Header />
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset" component={ResetPassword} />
        <Route path="/users/:username" component={Users} />
        <Route path="/game" component={Game} />
        <Route path="/" element={Homepage} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </Flex>
  );
}

export default App;