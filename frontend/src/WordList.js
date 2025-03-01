import React, { useState, useEffect } from "react";

function WordList() {
    const backendHost = process.env.REACT_APP_BACKEND_HOST;
    const backendPort = process.env.REACT_APP_BACKEND_PORT;

    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchWords = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://${backendHost}:${backendPort}/words`);
            if (!response.ok) throw new Error("Failed to fetch words.");
            const data = await response.json();
            setWords(data);
        } catch (error) {
            console.error(error);
            setMessage("Error fetching words.");
        } finally {
            setLoading(false);
        }
    };

    const deleteWord = async (word) => {
        try {
            const response = await fetch(`http://${backendHost}:${backendPort}/delete`, {
                method: "DELETE",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ word }),
            });

            if (!response.ok) throw new Error("Failed to delete word.");

            setWords(words.filter((w) => w !== word));
            setMessage(`Deleted "${word}" successfully!`);
        } catch (error) {
            console.error(error);
            setMessage(`Failed to delete "${word}".`);
        }
    };

    useEffect(() => {
        fetchWords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="container">
            <h2>Word List</h2>

            {loading && <p>Loading...</p>}

            {message && <p>{message}</p>}

            <ul className="word-list">
                {words.length > 0 ? (
                    words.map((word, index) => (
                        <li key={index} className="word-item">
                            <span>{word}</span>
                            <button className="delete-btn" onClick={() => deleteWord(word)}>❌</button>
                        </li>
                    ))
                ) : (
                    <p>No words found!</p>
                )}
            </ul>


            <button onClick={fetchWords}>Refresh Words</button>
        </div>
    );
}

export default WordList;
