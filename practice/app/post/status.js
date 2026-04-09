"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Contact = ({ email }) => {
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLink() {
            try {
                const res = await fetch("/api/user/status", {
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
    <>
        <span>
        {link=="Active" ?
            <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            </span>
            :
            <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            </span>
            }
        </span>

    <span>
        {link} User
    </span>
    </>
  );
};

export default Contact;