import { addDoc, collection, Timestamp } from "firebase/firestore";

export async function createRestaurant(db, restaurant) {
  const docRef = await addDoc(collection(db, "restaurants"), {
    ...restaurant,
    avgRating: 0,
    numRatings: 0,
    timestamp: Timestamp.now(),
  });

  return docRef.id;
}
