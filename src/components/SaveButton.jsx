import { useState, useContext } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ReactComponent as HeartOutLineIcon } from "../assets/svg/heart-outline.svg";
import { ReactComponent as HeartFilledIcon } from "../assets/svg/heart-filled.svg";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

function SaveButton({ docID, isFavorite }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
  const auth = getAuth();
  const navigate = useNavigate();

  //  favourite in user collection added
  const onClick = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
    setIsSubmitting(true);

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        favorites: arrayUnion(docID),
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
    if (isFavorite) {
      await removeFromFavorites(docID);
    } else {
      await addToFavorites(docID);
    }
    setIsSubmitting(false);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="btn btn-info"
      aria-label="Save this listing"
      disabled={isSubmitting}
    >
      {isFavorite ? (
        <HeartFilledIcon className="w-6 h-6 text-white" />
      ) : (
        <HeartOutLineIcon className="w-6 h-6 text-white" />
      )}
      <HeartOutLineIcon className="w-6 h-6 text-white" />
    </button>
  );
}

export default SaveButton;
