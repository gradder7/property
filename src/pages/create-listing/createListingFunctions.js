import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { useState } from "react";

const auth = getAuth();

export const storeImage = async (image) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
    const storageRef = ref(storage, "images/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const submitListingData = async (values) => {
  try {
    const formData = {
      ...values,
      userRef: auth.currentUser.uid,
      postedOn: serverTimestamp(),
    };
    let location;
    if (!formData.geolocationEnabled) {
      const dataNew = await fetch(
        ` https://api.tomtom.com/search/2/geocode/${formData.address}.json?&key=fkbAuvtsShkE8UFas5Fu493TW6zDBhwj`
      );
      const data = await dataNew.json();
      console.log(dataNew);
      console.log(data);
      console.log(formData.address);

      formData.geolocation = {
        // ? give us an error if null
        latitude: data.results[0]?.position.lat ?? 0,
        longitude: data.results[0]?.position.lon ?? 0,
      };
      location =
        data.summary.totalResults === 0
          ? undefined
          : data.results[0]?.address.freeformAddress;
      if (location === undefined || location.includes("undefined")) {
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      formData.geolocation = {
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    }

    const imgUrls = await Promise.all(
      [...formData.images].map((image) => storeImage(image))
    ).catch((error) => {
      toast.error(error.message);
      return;
    });

    delete formData.latitude;
    delete formData.longitude;
    delete formData.geolocationEnabled;
    delete formData.images;

    const listingDocRef = await addDoc(collection(db, "listings"), {
      ...formData,
      imgUrls,
    });
    toast.success("Listing created successfully");
    //returns id to there
    return listingDocRef.id;
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteSelectedImage = (
  imageThumbs,
  path,
  setFieldValue,
  setImageThumbs
) => {
  const newImageThumbs = imageThumbs.filter((image) => image.path !== path);
  setImageThumbs(newImageThumbs);
  setFieldValue("images", newImageThumbs);
};
