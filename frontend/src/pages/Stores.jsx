import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores");
      setStores(
        res.data.map(store => {
          const ratings = store.ratings ? JSON.parse(store.ratings) : [];
          return {
            ...store,
            ratings,
            user_rating: ratings.find(r => r.user_id === user.id)?.rating || 0,
            total_ratings: ratings.length
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const addStore = async () => {
    const name = prompt("Enter store name:");
    const address = prompt("Enter store address:");
    if (!name || !address) return;
    try {
      await api.post("/stores", { name, address, role: user.role });
      fetchStores();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStore = async id => {
    try {
      await api.delete(`/stores/${id}`, { data: { role: user.role } });
      fetchStores();
    } catch (err) {
      console.error(err);
    }
  };

  const rateStore = async (id, rating) => {
    try {
      let newRating = rating;
      const store = stores.find(s => s.id === id);
      if (store.user_rating === rating) {
        newRating = 0;
      }

      await api.post(`/stores/${id}/rate`, {
        rating: newRating,
        user_id: user.id,
        role: user.role
      });

      setStores(prev =>
        prev.map(s => {
          if (s.id === id) {
            const existingIndex = s.ratings.findIndex(r => r.user_id === user.id);
            let newRatings;
            if (newRating === 0) {
              newRatings = s.ratings.filter(r => r.user_id !== user.id);
            } else if (existingIndex >= 0) {
              newRatings = [...s.ratings];
              newRatings[existingIndex] = { user_id: user.id, rating: newRating };
            } else {
              newRatings = [...s.ratings, { user_id: user.id, rating: newRating }];
            }
            const sum = newRatings.reduce((acc, r) => acc + r.rating, 0);
            const avg = newRatings.length ? +(sum / newRatings.length).toFixed(1) : 0;
            return { ...s, user_rating: newRating, average_rating: avg, ratings: newRatings, total_ratings: newRatings.length };
          }
          return s;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto" }}>
      <h1>Stores</h1>

      {user?.role === "admin" && (
        <button onClick={addStore} className="btn btn-success mb-3">➕ Add Store</button>
      )}

      {stores.map(s => (
        <div key={s.id} className="card mb-3 p-3" style={{ backgroundColor: "#eee1e1ff" }}>
          <h4>{s.name}</h4>
          <p>{s.address}</p>
          <p>Avg Rating: {s.average_rating} ({s.total_ratings} {s.total_ratings === 1 ? "user" : "users"})</p>

          {user?.role === "admin" ? (
            <button onClick={() => deleteStore(s.id)} className="btn btn-danger">❌ Delete Store</button>
          ) : (
            <div>
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  onClick={() => rateStore(s.id, r)}
                  className={`btn ${r <= s.user_rating ? "btn-warning" : "btn-outline-warning"} me-1 mb-1`}
                  style={{ borderColor: "#38251fff" }}
                >
                  {r}★
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
