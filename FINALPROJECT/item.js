import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");

if (!itemId) {
    document.getElementById("title").innerText = "No item ID provided!";
    throw new Error("Missing ID");
}


async function loadDetails() {
    const ref = doc(db, "items", itemId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        document.getElementById("title").innerText = "Item not found!";
        return;
    }

    const item = snap.data();

    
    document.getElementById("title").textContent = item.title;
    document.getElementById("author").textContent = item.authorOrDirector;
    document.getElementById("year").textContent = item.year;
    document.getElementById("rating").textContent = item.rating;
    document.getElementById("description").textContent = item.description;

    const cover = document.getElementById("cover");
    cover.src = item.coverUrl ?? "placeholder.png";

}



loadDetails();
