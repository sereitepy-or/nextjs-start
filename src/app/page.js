import RestaurantListings from "@/src/components/RestaurantListings.jsx";
import RestaurantsCRUD from "@/src/components/Crud.jsx";
import {
  getRestaurants,
  getRateLimit,
  readRateLimit,
} from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

// This line also forces this route to be server-side rendered
// export const revalidate = 0;

export default async function Home(props) {
  const searchParams = await props.searchParams;

  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const serverDb = getFirestore(firebaseServerApp);

  const restaurants = await getRestaurants(serverDb, searchParams);

  const rate_limits = await getRateLimit(serverDb);

  const r = await readRateLimit(serverDb);

  return (
    <main className="main__home">
      <RestaurantListings
        initialRestaurants={restaurants}
        searchParams={searchParams}
      />
      <p>{rate_limits}</p>
      <p>{r}</p>
      <RestaurantsCRUD />
    </main>
  );
}
