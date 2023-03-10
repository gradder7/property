import { useEffect, useState } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";

import MessageItem from "../components/MessageItem";

import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import MessageItemSkeleton from "../skeletons/MessageItemSkeleton";

function Messages() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    document.title = "Messages | Rent or Sell";

    const getMessages = async () => {
      try {
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where("sentTo", "==", auth.currentUser.uid),
          orderBy("sentAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          return data.push({
            docID: doc.id,
            data: doc.data(),
          });
        });
        setMessages(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-3 lg:py-24 md:py-20 py-14">
        <div className="space-y-6">
          {Array(9)
            .fill()
            .map((item) => (
              <MessageItemSkeleton key={uuidv4()} />
            ))}
        </div>
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
            Messages
          </h1>
        </div>

        <div className="space-y-6">
          {messages.length ? (
            messages.map(({ docID, data }) => (
              <MessageItem {...data} key={docID} />
            ))
          ) : (
            <p className="text-center text-lg lg:col-span-3 sm:col-span-2">
              No messages to show.
            </p>
          )}
        </div>
      </section>
    </main>
    // <div className="grid place-items-center h-screen">
    //   <h1 className="text-6xl font-bold text-gray-900">Work on Progress...</h1>
    // </div>
  );
}

export default Messages;
