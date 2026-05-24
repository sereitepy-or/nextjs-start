"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getRestaurantsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const RestaurantItem = ({ restaurant }) => (
  <li key={restaurant.id}>
    <Link href={`/restaurant/${restaurant.id}`}>
      <ActiveResturant restaurant={restaurant} />
    </Link>
  </li>
);

const ActiveResturant = ({ restaurant }) => (
  <div>
    <ImageCover photo={restaurant?.photo} name={restaurant?.name} />
    <ResturantDetails restaurant={restaurant} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo || "/placeholder.png"} alt={name || "restaurant"} />
  </div>
);

const ResturantDetails = ({ restaurant }) => (
  <div className="restaurant__details">
    <h2>{restaurant?.name || "Unnamed"}</h2>
    <RestaurantRating restaurant={restaurant} />
    <RestaurantMetadata restaurant={restaurant} />
  </div>
);

const RestaurantRating = ({ restaurant }) => (
  <div className="restaurant__rating">
    <ul>{renderStars(restaurant?.avgRating || 0)}</ul>
    <span>({restaurant?.numRatings || 0})</span>
  </div>
);

const RestaurantMetadata = ({ restaurant }) => (
  <div className="restaurant__meta">
    <p>
      {restaurant?.category || "Unknown"} | {restaurant?.city || "Unknown"}
    </p>
    <p>{"$".repeat(restaurant?.price || 1)}</p>
  </div>
);

export default function RestaurantListings({
  initialRestaurants,
  searchParams,
}) {
  const router = useRouter();

  const initialFilters = {
    city: searchParams?.city || "",
    category: searchParams?.category || "",
    price: searchParams?.price || "",
    sort: searchParams?.sort || "",
  };

  // ✅ FIX: default to empty array
  const [restaurants, setRestaurants] = useState(initialRestaurants || []);

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getRestaurantsSnapshot((data) => {
      setRestaurants(data || []);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />

      <ul className="restaurants">
        {(restaurants || []).map((restaurant) => (
          <RestaurantItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      queryParams.append(key, value);
    }
  }

  router.push(`?${queryParams.toString()}`);
}
