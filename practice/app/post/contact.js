"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Contact = ({ email }) => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLink() {
      try {
        const res = await fetch("/api/user/wnumber", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
          setLink(data.link);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLink();
  }, [email]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="ml-4 px-2 py-2 bg-green-400 text-white font-semibold text-sm rounded-2xl shadow-md hover:bg-green-500 hover:shadow-lg active:scale-95 transition-all duration-200 ease-in-out">
      <Link href={link} target="_blank">Contact</Link>
    </div>
  );
};

export default Contact;