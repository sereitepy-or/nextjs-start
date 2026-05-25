"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase/clientApp";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function RestaurantsCRUD() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  // ✅ READ
  const fetchRestaurants = async () => {
    const snapshot = await getDocs(collection(db, "restaurants"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRestaurants(data);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ✅ CREATE
  const handleCreate = async () => {
    if (!name || !city) return;

    await addDoc(collection(db, "restaurants"), {
      name,
      city,
      createdAt: new Date(),
    });

    setName("");
    setCity("");
    fetchRestaurants();
  };

  // ✅ UPDATE
  const handleUpdate = async (id) => {
    const newName = prompt("Enter new name");
    if (!newName) return;

    await updateDoc(doc(db, "restaurants", id), {
      name: newName,
    });

    fetchRestaurants();
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "restaurants", id));
    fetchRestaurants();
  };

  return (
    <div className="bg-white flex items-center justify-center p-6 space-y-6">
      <h1 className="text-2xl font-bold text-pink-600">Restaurant CRUD</h1>

      {/* CREATE FORM */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleCreate}>Add</button>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {restaurants.map((r) => (
          <div key={r.id}>
            <div className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-gray-500">{r.city}</p>
              </div>
              <div className="flex gap-2">
                <button variant="outline" onClick={() => handleUpdate(r.id)}>
                  Edit
                </button>
                <button
                  //   variant="destructive"
                  onClick={() => handleDelete(r.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
