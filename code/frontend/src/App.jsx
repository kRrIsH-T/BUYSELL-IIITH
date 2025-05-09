import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import Pagenotfound from './pages/Pagenotfound.jsx';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Items from './pages/Items.jsx';
import ListingForm from './pages/Listing.jsx';
import { useAuth } from './context/auth.jsx';
import PrivateRoute from './components/Routes/Private.jsx';
import Cart from './pages/Cart.jsx';
import './App.css';
import OrderHistory from './pages/OrderHistory.jsx';
import DeliverItems from './pages/DeliverItems.jsx';
import Search from './pages/Search.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import Support from './pages/Support.jsx';

function App() {
  const { auth } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={auth?.token ? <Navigate to="/dashboard" /> : <Homepage />} />
      <Route path="/register" element={ <Register />} />
      <Route path="/login" element={auth?.token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<Dashboard />} />
        </Route>
      <Route path="/items" element={<Items />} />
      <Route path="/sell" element={<ListingForm />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/History" element={<OrderHistory />} />
      <Route path="/deliveritems" element={<DeliverItems />} />
      <Route path="/search" element={<Search />} />
      <Route path="/item/:id" element={<ItemDetail />} />
      <Route path="/support" element={<Support />} />
      <Route path="*" element={<Pagenotfound />} />
    </Routes>
  );
}

export default App;