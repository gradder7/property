import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/profile/Profile";
import CreateListing from "./pages/create-listing/CreateListing";
import ListingDetails from "./pages/listing-details/ListingDetails";
import MyListings from "./pages/MyListing";
import EditListing from "./pages/edit-listing/EditListing";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import Category from "./pages/Category";

function App() {
  return (
    <div className="App font-sans">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* private Routes */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/listing/:listingId" element={<ListingDetails />} />
          <Route path="/my-listings" element={<PrivateRoute />}>
            <Route path="/my-listings" element={<MyListings />} />
          </Route>
          <Route path="/edit-listing/:listingId" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route path="/category/:categoryName" element={<Category />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer position="top-center" />
    </div>
  );
}
export default App;
