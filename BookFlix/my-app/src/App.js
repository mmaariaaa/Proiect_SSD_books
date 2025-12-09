import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./SearchPage";
import ItemDetails from "./ItemDetails";
import AddItem from "./AddItem";
import PersonalList from "./PersonalList";

function App() {
  return (
      <BrowserRouter>
        <nav style={{ padding: "10px", marginBottom: "20px", background: "#eee" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Search</Link>
          <Link to="/add" style={{ marginRight: "15px" }}>add Item</Link>
          <Link to="/my-list">My List</Link>
        </nav>

        <Routes>
          <Route path="/" element={<SearchPage />} />

          <Route path="/item/:id" element={<ItemDetails />} />

          <Route path="/add" element={<AddItem />} />
          <Route path="/my-list" element={<PersonalList />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
