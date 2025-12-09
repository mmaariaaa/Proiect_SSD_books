import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./SearchPage";
import ItemDetails from "./ItemDetails";
import AddItem from "./AddItem";
import PersonalList from "./PersonalList";

function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
        <nav>
          <Link to="/" style={{ marginRight: "1rem" }}>Search</Link>
          <Link to="/add" style={{ marginRight: "1rem" }}>Add Item</Link>
          <Link to="/my-list">My List</Link>
        </nav>
      </header>

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/my-list" element={<PersonalList />} />
          <Route path="*" element={<h2>404: Page Not Found</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
