import React, { useState } from "react";

function WordInsert() {
    const backendHost = process.env.REACT_APP_BACKENsD_HOST || "localhost";
    const backendPort = process.env.REACT_APP_BACKEND_PORT || "8000";

    const [message, setMessage] = useState("");
    const insertWord = async (word) => {
        try {
            const response = await fetch(`http://${backendHost}:${backendPort}/insert`, {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ word })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return await response.json();
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        if (!formJson.wordInput) {
            setMessage("Please enter a word.");
            return;
        }

        try {
            await insertWord(formJson.wordInput);
            setMessage("Word inserted successfully!");
        } catch (error) {
            setMessage("Failed to insert word.");
        }

        form.reset();
    };

    return (
        <div className="container">
            <header className="WordInsert-header">
                <p>Insert Word:</p>

                <form method="post" onSubmit={handleSubmit}>
                    <label>
                        <input name="wordInput" placeholder="Type your word here" />
                    </label>
                    <button type="submit">Insert</button>
                </form>

                {message && <p>{message}</p>}
            </header>
        </div>
    );
}

export default WordInsert;
