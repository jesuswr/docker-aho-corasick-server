import React, { useState } from "react";

function GetMatches() {
    const backendHost = process.env.REACT_APP_BACKEND_HOST;
    const backendPort = process.env.REACT_APP_BACKEND_PORT;

    const [queryText, setQueryText] = useState("");
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");

    const handleQuery = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!queryText.trim()) {
            setMessage("Please enter a query.");
            return;
        }

        try {
            const response = await fetch(`http://${backendHost}:${backendPort}/query`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ text: queryText }),
            });

            if (!response.ok) throw new Error("Query failed.");

            const data = await response.json();
            data.result.sort((a, b) => b.counter - a.counter);
            setResult(data.result || []);
            setMessage("Query successful!");
        } catch (error) {
            console.error(error);
            setMessage("Query failed.");
            setResult(null);
        }
    };

    return (
        <div className="container">
            <h2>Query Words</h2>

            <form onSubmit={handleQuery}>
                <input
                    type="text"
                    placeholder="Enter query text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {message && <p>{message}</p>}

            {result && result.length > 0 && (
                <div>
                    <h3>Query Result:</h3>
                    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>Counter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.word}</td>
                                    <td>{item.counter}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {result && result.length === 0 && <p>No results found.</p>}
        </div>
    );
}

export default GetMatches;
