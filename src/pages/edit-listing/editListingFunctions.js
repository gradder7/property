import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { doc, updateDoc, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL,getStorage } from "firebase/storage";

import { db } from "../../firebase.config";
import { Auth, getAuth } from "firebase/auth";

// export const getCoordinates = async (address) => {
//   try {
//     const { data } = await axios({
//       method: "get",
//       url: "https://us1.locationiq.com/v1/search.php",
//       params: {
//         key: import.meta.env.VITE_GEOCODING_API_KEY,
//         q: address,
//         format: "json",
//       },
//     });
//     return [data, null];
//   } catch (error) {
//     return [null, error.message];
//   }
// };

export const storeImage = async (image) => {
    const auth=getAuth();
    const storage=getStorage();
  return new Promise((resolve, reject) => {
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

export const updateListing = async (values, listingId) => {
  try {
    const formData = { ...values };
    if (!formData.geolocationEnabled) {
      const dataNew = await fetch(
        ` https://api.tomtom.com/search/2/geocode/${formData.address}.json?&key=fkbAuvtsShkE8UFas5Fu493TW6zDBhwj`
      );
      const data = await dataNew.json();
      console.log(dataNew);
      console.log(data);
      console.log(formData.address);
      // console.log(dataNew);
      // console.log(dataNew);

      // https://api.tomtom.com/search/2/geocode/khari, bazar lohaghat,uttrakhand.json?&key=fkbAuvtsShkE8UFas5Fu493TW6zDBhwj
      // const [data, error] = await getCoordinates(formData.address);
      //  if (error) {
      //   throw new Error(error);
      // }

      // dataNew.results[0].position.lat;
      // dataNew.results[0].position.lon;
      formData.geolocation = {
        latitude: data.results[0].position.lat,
        longitude: data.results[0].position.lon,
      };
    } else {
      formData.geolocation = {
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
    }

    let newImgUrls = [...formData.imgUrls];

    if (formData.images) {
      const imgUrls = await Promise.all(
        [...formData.images].map((image) => storeImage(image))
      ).catch((error) => {
        toast.error(error.message);
        return;
      });

      newImgUrls = [...newImgUrls, ...imgUrls];
    }

    delete formData.latitude;
    delete formData.longitude;
    delete formData.geolocationEnabled;
    delete formData.images;
    delete formData.imgUrls;

    const listingDocRef = doc(db, "listings", listingId);
    await updateDoc(listingDocRef, { ...formData, imgUrls: newImgUrls });
    toast.success("Listing updated successfully");

    return listingDocRef.id;
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteUploadedImage = (setFieldValue, url, imgUrls) => {
  setFieldValue(
    "imgUrls",
    imgUrls.filter((imgUrl) => imgUrl !== url)
  );
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
