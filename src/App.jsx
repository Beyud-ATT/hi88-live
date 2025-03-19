import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home/Index";
import LivestreamDetail from "./pages/Live/Index";
import LivestreamDetailMobile from "./pages/LiveMobile/Index";
import { BaseLayout } from "./layout/Index";
import NotFound from "./pages/404";
import User from "./pages/User/Index";
import Profile from "./pages/User/Profile/Index";
import ChangePasswordForm from "./pages/User/ForgotPassword/Index";
import LivestreamsConfig from "./pages/User/LivestreamsConfig/Index";
import Rule from "./pages/Rule/Index.jsx";
import Privacy from "./pages/Privacy/Index.jsx";
import { BareChatFrame } from "./pages/Live/Chat.jsx";
import BlackList from "./pages/User/BlackList/Index.jsx";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  const { isIdol } = useAuth();
  return (
    <>
      <Routes>
        <Route
          element={
            <ErrorBoundary fallback={<h1> Something went wrong !!!</h1>}>
              <BaseLayout />
            </ErrorBoundary>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/live/:id" element={<LivestreamDetail />} />
          <Route path="/live-mobile/:id" element={<LivestreamDetailMobile />} />
          <Route path="/user" element={<User />}>
            <Route index path="profile" element={<Profile />} />
            <Route path="forgot-password" element={<ChangePasswordForm />} />
            {isIdol && (
              <Route
                path="livestreams-config"
                element={<LivestreamsConfig />}
              />
            )}
            <Route path="black-list" element={<BlackList />} />
          </Route>
          <Route path="/rule" element={<Rule />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/chat-box/:id" element={<BareChatFrame />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
