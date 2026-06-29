import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute/>}>
         <Route path="/" element={<div>Home (we'll build this next)</div>} />
        </Route>   
      </Routes>
    </BrowserRouter>
  );
}

export default App;