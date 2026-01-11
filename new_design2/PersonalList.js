import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";
import "./App.css";

const makeSig = (data) => {
    const title = (data?.title || "").toLowerCase().trim();
    const author = (data?.author || data?.director || "").toLowerCase().trim();
    const year = String(data?.year || "").trim();
    return `sig:${title}|${author}|${year}`;
};

function PersonalList() {
    const [myList, setMyList] = useState([]);

    const loadMyList = async () => {
        try {
            const snapshot = await getDocs(collection(db, "personalList"));

            const items = [];
            const seen = new Set();

            for (const entry of snapshot.docs) {
                const personalId = entry.id;
                const data = entry.data();
                const saved = data.itemId;


                if (saved && typeof saved === "object") {
                    const sig = makeSig(saved);
                    if (seen.has(sig)) continue;
                    seen.add(sig);

                    items.push({
                        personalId,
                        _sig: sig,
                        _itemDocId: null,
                        id: sig,
                        ...saved,
                    });
                    continue;
                }


                if (typeof saved === "string" && saved.trim()) {
                    const itemDocId = saved.trim();

                    const itemSnap = await getDoc(doc(db, "item", itemDocId));
                    if (!itemSnap.exists()) continue;

                    const itemData = itemSnap.data();
                    const sig = data.sig || makeSig(itemData);

                    if (seen.has(sig)) continue;
                    seen.add(sig);

                    items.push({
                        personalId,
                        _sig: sig,
                        _itemDocId: itemDocId,
                        id: itemSnap.id,
                        ...itemData,
                    });
                }
            }

            setMyList(items);
        } catch (err) {
            console.error("Error loading personal list:", err);
        }
    };

    useEffect(() => {
        loadMyList();
    }, []);


    const handleRemove = async (itemToRemove) => {
        try {
            const deletes = [];


            if (itemToRemove._sig) {
                const qSig = query(
                    collection(db, "personalList"),
                    where("sig", "==", itemToRemove._sig)
                );
                const snapSig = await getDocs(qSig);
                snapSig.forEach((d) =>
                    deletes.push(deleteDoc(doc(db, "personalList", d.id)))
                );
            }


            if (itemToRemove._itemDocId) {
                const qId = query(
                    collection(db, "personalList"),
                    where("itemId", "==", itemToRemove._itemDocId)
                );
                const snapId = await getDocs(qId);
                snapId.forEach((d) =>
                    deletes.push(deleteDoc(doc(db, "personalList", d.id)))
                );
            }


            const all = await getDocs(collection(db, "personalList"));
            all.forEach((d) => {
                const v = d.data().itemId;
                if (v && typeof v === "object") {
                    const sig = makeSig(v);
                    if (sig === itemToRemove._sig) {
                        deletes.push(deleteDoc(doc(db, "personalList", d.id)));
                    }
                }
            });

            await Promise.all(deletes);


            setMyList((prev) => prev.filter((x) => x._sig !== itemToRemove._sig));
        } catch (err) {
            console.error(err);
            alert("Failed to remove item");
        }
    };

    return (
        <div
            className="fadeSlide"
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f5dc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
            }}
        >
            <h2 style={{ marginBottom: 10 }}>My Personal List</h2>

            <h3 style={{ marginTop: 10 }}>Your Saved Books / Movies</h3>

            <div style={{ maxWidth: 600, width: "100%", marginTop: 10 }}>
                {myList.length === 0 ? (
                    <p>You haven't added anything yet.</p>
                ) : (
                    myList.map((item) => (
                        <div
                            key={item._sig}
                            style={{
                                background: "white",
                                padding: 15,
                                marginBottom: 12,
                                borderRadius: 8,
                                display: "flex",
                                gap: 15,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={item.coverUrl || "/placeholder.png"}
                                alt={item.title}
                                width={80}
                                height={120}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                            />

                            <div style={{ flexGrow: 1 }}>
                                <h3 style={{ margin: 0 }}>{item.title}</h3>
                                <p style={{ margin: 0 }}>{item.author || item.director}</p>
                                {item.year && <p style={{ margin: 0 }}>{item.year}</p>}
                            </div>

                            <button
                                onClick={() => handleRemove(item)}
                                style={{
                                    backgroundColor: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PersonalList;
