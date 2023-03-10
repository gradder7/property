import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import { getListingsByCategory, getFilteredListings } from "./filterFunctions";
import ListingItem from "../../components/ListingItem";
import ListingItemSkeleton from "../../skeletons/ListingItemSkeleton";
import { v4 as uuidv4 } from "uuid";
import Loader from "../../components/Loader";

function Category() {
  const initalRender = useRef(true);
  const [sortBy, setSortBy] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [isAllListing, setisAllListing] = useState(true);
  const { checkFavorite } = useContext(FavoritesContext);
  const { categoryName } = useParams();

  useEffect(() => {
    document.title =
      categoryName === "sale"
        ? "For Sale | Rent or Sell"
        : categoryName === "rent"
        ? "For Rent | Rent or Sell"
        : "All | Rent or Sell";
    const getListingsData = async () => {
      const [data, error] = await getListingsByCategory(categoryName);
      if (error) {
        setError(error);
      } else {
        setListings(data);
      }
      setLoading(false);
    };
    getListingsData();
  }, [categoryName]);

  useEffect(() => {
    if (!initalRender.current) {
      if (sortBy) {
        setListings([]);
        setLoading(true);
        setError("");
        const filteredListingsData = async () => {
          const [data, error] = await getFilteredListings(categoryName, sortBy);
          if (error) {
            setError(error);
          } else {
            setListings(data);
          }
          setLoading(false);
        };
        filteredListingsData();
      } else {
        getListingsByCategory();
      }
    } else {
      initalRender.current = false;
    }
  }, [sortBy]);

  const pageTitle =
    categoryName === "sale"
      ? "For Sale"
      : categoryName === "rent"
      ? "For Rent"
      : "All Listings";

  const isAllListing = categoryName === "all-category" ? true : false;

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <main className="min-h-screen max-w-7xl px-3 mx-auto">
      <section className="lg:py-24 md:py-20 py-14">
        <div className="sm:flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center sm:mb-0 mb-5">
            {pageTitle}
          </h1>
          <div className="flex items-center justify-start gap-5 flex-1 max-w-sm sm:mx-0 mx-auto">
            <label htmlFor="sortby" className="label flex-shrink-0 text-sm">
              Sort by
            </label>
            <select
              name="sortby"
              id="sortby"
              className="select select-bordered flex-1 font-medium"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              {!isAllListing && (
                <>
                  <option value="price-asc">Price : Low to High</option>
                  <option value="price-desc">Price : High to Low</option>
                </>
              )}
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Penthouse">PentHouse</option>
              <option value="bedrooms">Bedrooms</option>
              <option value="bathrooms">Bathrooms</option>
              <option value="carspace">Car space</option>
              <option value="listingSize">Area</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array(9)
              .fill()
              .map((item) => (
                <ListingItemSkeleton key={uuidv4()} />
              ))}
          </div>
        )}
        {error && <p>{error}</p>}

        {listings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map(({ docID, data }) => {
              return (
                <ListingItem
                  key={docID}
                  docID={docID}
                  isFavorite={checkFavorite(docID)}
                  {...data}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Category;
