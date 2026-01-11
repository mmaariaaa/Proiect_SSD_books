import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./SearchPage";
import ItemDetails from "./ItemDetails";
import AddItem from "./AddItem";
import PersonalList from "./PersonalList";
import HomePage from "./HomePage";
import "./Navbar.css";
import Login from "./Login";


function App() {
  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          <h2 className="logo">BookFlix</h2>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/add">Add Item</Link>
            <Link to="/my-list">My List</Link>
            <Link to="/login">Login</Link> {/* link login */}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/my-list" element={<PersonalList />} />
          <Route path="*" element={<h2>404: Page Not Found</h2>} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
