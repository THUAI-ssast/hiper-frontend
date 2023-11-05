import { lazy } from "solid-js";
import { Routes,Route } from 'solid-app-router';
import { Container } from "solid-bootstrap";

const Product = lazy(() => import("./routes/Product"));
const Products = lazy(() => import("./routes/Products"));

function App() {
  return (
    <Container class="pb-5">      
      <Routes>
        <Route path="/Introduce" element={<Introduce />}   />
        <Route path="/ContestInfo" element={<ContestInfo />}   />
        <Route path="/PersonalSpace" element={<PersonalSpace />}   />
        <Route path="/ContestFound" element={<ContestFound />}   />
        <Route path="/MySubmit" element={<MySubmit />}   />
        {/*自定义*/}
        <Route path="/abc" element={<Introduce />}   />
        <Route path="/Isda" element={<Introduce />}   />
        <Route path="/asdae" element={<Introduce />}   />
      </Routes>
    </Container>
  );
}
export default App;