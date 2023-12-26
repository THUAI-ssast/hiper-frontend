import { Route, Routes } from "@solidjs/router";
import { Flex } from "@hope-ui/solid";
import { createSignal, onMount } from "solid-js";

import "./index.css"

import Login from "./components/Login";
import Header from "./components/Header";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Homepage from "./components/Homepage";
import Users from "./components/Users";
import Contest from "./components/Contest";
import Contests from "./components/Contests";
import Game from "./components/Game";
import Games from "./components/Games";
import Admin from "./components/Admin";
import { apiUrl } from "./utils";
import ResetEmail from "./components/ResetEmail";

export const [myself, setMyself] = createSignal(null);

export function getCurrentUser() {
  if (localStorage.getItem('jwt')) {
    fetch(`${apiUrl}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setMyself(data);
      })
  }
}

function App() {
  onMount(() => {
    getCurrentUser();
  }
  );


  return (
    <Flex direction="column" height="100%">
      <Header />
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset_password" component={ResetPassword} />
        <Route path="/reset_email" component={ResetEmail} />
        <Route path="/contests" component={Contests} />
        <Route path="/games" component={Games} />
        <Route path="/users/:username" component={Users} />
        <Route path="/contest/:id/:page?" component={Contest} />
        <Route path="/game/:id/:page?" component={Game} />
        <Route path="/admin/:type/:id" component={Admin} />
        <Route path="/" element={Homepage} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </Flex>
  );
}

export default App;