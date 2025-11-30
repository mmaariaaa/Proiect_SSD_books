import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import ItemDetails from "./ItemDetails";
import AddItem from "./AddItem"; // your AddItem.js
import PersonalList from "./PersonalList"; // optional

function App() {
  return (
    <BrowserRouter>
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
