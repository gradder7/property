import { useState, useEffect, useContext, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";

import ListingItem from "../components/ListingItem";
import { FavoritesContext } from "../context/FavoritesContext";
import { db } from "../firebase.config";

function SavedListings() {
  const initalRender = useRef(true);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [error, setError] = useState("");
  const [listingTypeOption, setListingTypeOption] = useState("all");

  const { favorites, checkFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    document.title = "Saved Listings | Rent or Sell";
  }, []);
  useEffect(() => {
    const getSavedListings = async () => {
      const savedListingDocs = await Promise.all(
        favorites.map((docID) => getDoc(doc(db, "listings", docID)))
      ).catch((error) => setError(error.message));
      const savedListings = savedListingDocs.map((doc) => ({
        docID: doc.id,
        data: doc.data(),
      }));
      setListings(savedListings);
      setFilteredListings(savedListings);
      setLoading(false);
    };

    getSavedListings();
  }, [favorites]);

  useEffect(() => {
    if (!initalRender.current) {
      if (listingTypeOption === "all") {
        setFilteredListings(listings);
      } else {
        const filterResults = listings.filter(
          (listing) => listing.data.type === listingTypeOption
        );
        setFilteredListings(filterResults);
      }
    } else {
      initalRender.current = false;
    }
  }, [listingTypeOption]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-3 lg:py-24 md:py-20 py-14">
        <p>Loading....</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-3 lg:py-24 md:py-20 py-14">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <main className="min-h-screen max-w-7xl px-3 mx-auto">
      <section className="lg:py-24 md:py-20 py-14">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
            Saved Listings
          </h1>
          <select
            className="select select-bordered w-full max-w-xs mb-8 mx-auto md:mx-0 block"
            value={listingTypeOption}
            onChange={(e) => setListingTypeOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.length ? (
            filteredListings.map(({ docID, data }) => (
              <ListingItem
                {...data}
                key={docID}
                docID={docID}
                isFavorite={checkFavorite(docID)}
              />
            ))
          ) : (
            <p className="text-center text-lg lg:col-span-3 sm:col-span-2">
              No listings to show.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
export default SavedListings;
