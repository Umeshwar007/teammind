import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSocketConnection } from "./hooks/usesocketconnection";
import ChatPage from "./pages/ChatPage";
function App() {
  useSocketConnection();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute/>}>
         <Route path="/" element={<div>Home (we'll build this next)</div>} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>   
      </Routes>
    </BrowserRouter>
  );
}

export default App;