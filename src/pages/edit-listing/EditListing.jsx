import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc } from "firebase/firestore";

import TextInput from "../../components/TextInput";
import TextAreaInput from "../../components/TextAreaInput";
import ToggleInput from "../../components/ToggleInput";
import RadioInput from "../../components/RadioInput";
import FileInput from "../../components/FileInput";
import UploadedImageThumb from "../../components/UploadedImageThumb";

import validationSchema from "./validationSchema";
import {
  updateListing,
  deleteUploadedImage,
  deleteSelectedImage,
} from "./editListingFunctions";
import { db } from "../../firebase.config";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

function EditListing() {
  const [imageThumbs, setImageThumbs] = useState([]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { listingId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Edit listing | Rent or Sell";
  }, []);
  useEffect(() => {
    const getListing = async () => {
      try {
        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          data.latitude = data.geolocation.latitude;
          data.longitude = data.geolocation.longitude;
          delete data.geolocation;
          setListing(data);
        } else {
          throw new Error("Listing does not exist");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getListing();
  }, [listingId]);

  const onDropHanlder = (acceptedFiles, setFieldValue) => {
    setImageThumbs(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    setFieldValue("images", acceptedFiles);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    await updateListing(values, listingId);
    setLoading(false);
    navigate(`/listing/${listingId}`);
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return toast.error(error);
  }
  return (
    <main className="min-h-screen max-w-7xl px-3 mx-auto">
      <section className="lg:py-24 md:py-20 py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">
          Edit listing
        </h1>
        <div className="max-w-3xl mx-auto">
          <Formik
            initialValues={listing}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, values, resetForm, setFieldValue }) => {
              return (
                <Form className="space-y-4">
                  <div>
                    <span id="listing-type">Listing type</span>
                    <div
                      role="group"
                      aria-labelledby="listing-type"
                      className="grid grid-cols-2 gap-9 max-w-md mt-2"
                    >
                      <RadioInput
                        id="forSale"
                        label="For sale"
                        name="type"
                        value="sale"
                        checked={values.type === "sale"}
                      />
                      <RadioInput
                        id="forRent"
                        label="For rent"
                        name="type"
                        value="rent"
                        checked={values.type === "rent"}
                      />
                    </div>
                  </div>
                  <div>
                    <TextInput
                      label="Title"
                      id="title"
                      name="title"
                      type="text"
                    />
                  </div>
                  <div>
                    <TextAreaInput
                      label="Description"
                      id="description"
                      name="description"
                    />
                  </div>
                  <div>
                    <TextAreaInput
                      label="Address"
                      id="address"
                      name="address"
                    />
                    <div className="inline-block mt-2">
                      <ToggleInput
                        label="Enter geolocation manually"
                        id="customGeolocationEnabled"
                        name="customGeolocationEnabled"
                      />
                    </div>
                  </div>
                  {values.customGeolocationEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <TextInput
                          label="Latitude"
                          id="latitude"
                          name="latitude"
                          type="text"
                        />
                      </div>
                      <div>
                        <TextInput
                          label="Longitude"
                          id="longitude"
                          name="longitude"
                          type="text"
                        />
                      </div>
                    </div>
                  )}
                  {/* bhk */}
                  <div>
                    <span id="listing-type">BHK type</span>
                    <br />
                    <div
                      role="group"
                      aria-labelledby="listing-type"
                      className="grid grid-cols-3 gap-2 w-full max-w-screen-sm mt-2"
                    >
                      <RadioInput
                        id="villa"
                        label="Villa "
                        name="houseType"
                        value="Villa"
                        checked={values.houseType === "Villa"}
                      />
                      <RadioInput
                        id="apartment"
                        label="Apartment "
                        name="houseType"
                        value="Apartment"
                        checked={values.houseType === "Apartment"}
                      />
                      <RadioInput
                        id="penthouse"
                        label="Penthouse "
                        name="houseType"
                        value="Penthouse"
                        checked={values.houseType === "Penthouse"}
                      />
                    </div>
                  </div>
                  {/* bhk */}
                  <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                    <div>
                      <TextInput
                        label="No. of bedrooms"
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        min="1"
                      />
                    </div>
                    <div>
                      <TextInput
                        label="No. of bathrooms"
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        min="1"
                      />
                    </div>
                    <div>
                      <TextInput
                        label="Car space"
                        id="carspace"
                        name="carspace"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <TextInput
                        label="Area (in SQFT)"
                        id="listingSize"
                        name="listingSize"
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <TextInput
                      label="Price (in INR)"
                      id="regularPrice"
                      name="regularPrice"
                      type="number"
                      min="0"
                    />
                    <div className="inline-block mt-2">
                      <ToggleInput
                        label="On offer"
                        id="onOffer"
                        name="onOffer"
                      />
                    </div>
                  </div>
                  {values.onOffer && (
                    <div>
                      <TextInput
                        label="Discount price (in INR)"
                        id="discountPrice"
                        name="discountPrice"
                        type="number"
                        min="0"
                      />
                    </div>
                  )}

                  <FileInput
                    accept="image/jpg, image/png, image/jpeg"
                    onDrop={(acceptedFiles) =>
                      onDropHanlder(acceptedFiles, setFieldValue)
                    }
                    dropZoneText="Select images"
                    id="images"
                    name="images"
                    label="Upload listing images (.jpg, .png)"
                  />

                  {imageThumbs.length > 0 && (
                    <ul className="flex items-center justify-start flex-wrap gap-4 mt-4">
                      {imageThumbs.map((file) => (
                        <li
                          key={uuidv4()}
                          className="flex-shrink-0 relative w-24 h-24"
                        >
                          <UploadedImageThumb
                            src={file.preview}
                            onClick={() =>
                              deleteSelectedImage(
                                imageThumbs,
                                file.path,
                                setFieldValue,
                                setImageThumbs
                              )
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {values.imgUrls.length > 0 && (
                    <div>
                      <p>Current images:</p>
                      <ul className="flex items-center justify-start flex-wrap gap-4 mt-4">
                        {values.imgUrls.map((url) => (
                          <li
                            key={uuidv4()}
                            className="flex-shrink-0 relative w-24 h-24"
                          >
                            <UploadedImageThumb
                              src={url}
                              onClick={() =>
                                deleteUploadedImage(
                                  setFieldValue,
                                  url,
                                  values.imgUrls
                                )
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="btn btn-neutral btn-block mt-3 mx-0"
                      onClick={() => resetForm()}
                      disabled={isSubmitting}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary md:mt-3 btn-block mx-0"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </section>
    </main>
  );
}
export default EditListing;
