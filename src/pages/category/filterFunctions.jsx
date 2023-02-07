import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

import { db } from "../../firebase.config";

export const getListingsByCategory = async (categoryName) => {
  if (
    categoryName !== "sale" &&
    categoryName !== "rent" &&
    categoryName !== "all-category"
  ) {
    return [null, "Invalid category"];
  }
  try {
    let q;
    const listingsRef = collection(db, "listings");
    if (categoryName === "sale" || categoryName === "rent") {
      q = query(listingsRef, where("type", "==", categoryName));
    } else {
      q = query(listingsRef, orderBy("postedOn", "desc"));
    }
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      return data.push({
        docID: doc.id,
        data: doc.data(),
      });
    });
    if (data.length) {
      return [data, null];
    }
    return [null, "No listings found"];
  } catch (error) {
    return [null, error.message];
  }
};

export const getFilteredListings = async (categoryName, sortBy) => {
  if (
    categoryName !== "sale" &&
    categoryName !== "rent" &&
    categoryName !== "all-category"
  ) {
    return [null, "Invalid category"];
  }
  try {
    const listingsRef = collection(db, "listings");
    let q;
    if (sortBy === "price-asc") {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          orderBy("regularPrice", "asc")
        );
      } else {
        q = query(listingsRef, orderBy("regularPrice", "asc"));
      }
    } else if (sortBy === "Villa") {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          where("houseType", "==", "Villa"),
          orderBy("postedOn", "desc")
        );
      } else {
        q = query(
          listingsRef,
          where("houseType", "==", "Villa"),
          orderBy("postedOn", "desc")
        );
      }
    } else if (sortBy === "Apartment") {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          where("houseType", "==", "Apartment"),
          orderBy("postedOn", "desc")
        );
      } else {
        q = query(
          listingsRef,
          where("houseType", "==", "Apartment"),
          orderBy("postedOn", "desc")
        );
      }
    } else if (sortBy === "Penthouse") {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          where("houseType", "==", "Penthouse"),
          orderBy("postedOn", "desc")
        );
      } else {
        q = query(
          listingsRef,
          where("houseType", "==", "Penthouse"),
          orderBy("postedOn", "desc")
        );
      }
    } else if (sortBy === "default") {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          orderBy("postedOn", "desc")
        );
      } else {
        q = query(listingsRef, orderBy("postedOn", "desc"));
      }
    } else if (sortBy === "price-desc") {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          orderBy("regularPrice", "desc")
        );
      } else {
        q = query(listingsRef, orderBy("regularPrice", "desc"));
      }
    } else {
      if (categoryName === "sale" || categoryName === "rent") {
        q = query(
          listingsRef,
          where("type", "==", categoryName),
          orderBy(sortBy, "desc")
        );
      }else{
          q = query(
            listingsRef,
            orderBy(sortBy, "desc")
          );
      }
    }
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      return data.push({
        docID: doc.id,
        data: doc.data(),
      });
    });
    if (data.length) {
      return [data, null];
    }
    return [null, "No listings found"];
  } catch (error) {
    return [null, error.message];
  }
};
