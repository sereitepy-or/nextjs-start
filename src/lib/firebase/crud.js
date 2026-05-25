import {
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

export async function createRestaurant(db, restaurant) {
  const docRef = await addDoc(collection(db, "restaurants"), {
    ...restaurant,
    avgRating: 0,
    numRatings: 0,
    timestamp: Timestamp.now(),
  });

  return docRef.id;
}

export async function updateRestaurant(db, restaurantId, data) {
  const ref = doc(db, "restaurants", restaurantId);

  await updateDoc(ref, {
    ...data,
  });

  return true;
}

export async function updateReview(db, restaurantId, reviewId, data) {
  const ref = doc(db, "restaurants", restaurantId, "ratings", reviewId);

  await updateDoc(ref, data);

  return true;
}

export async function deleteReview(db, restaurantId, reviewId) {
  const ref = doc(db, "restaurants", restaurantId, "ratings", reviewId);

  await deleteDoc(ref);

  return true;
}

export async function deleteRestaurant(db, restaurantId) {
  const ref = doc(db, "restaurants", restaurantId);

  await deleteDoc(ref);

  return true;
}

export async function deleteRestaurantWithReviews(db, restaurantId) {
  const ratingsRef = collection(db, "restaurants", restaurantId, "ratings");

  const snapshot = await getDocs(ratingsRef);

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }

  await deleteDoc(doc(db, "restaurants", restaurantId));
}
