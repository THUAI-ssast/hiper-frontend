import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

const Dashboard = () => {
    const [user, setUser] = createSignal({}); // user details
    return (
       <div class="dashboard-section">
            <div class="user-detail">
                <h3>Dashboard</h3>
                <h4>Welcome, User</h4>
                <A href="/login">
                    <button type="button" class="logout">Log out</button>
                </A>
            </div>
        </div>
    )
}

export default Dashboard