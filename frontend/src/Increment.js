import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function Increment() {
  
    const [number, setNumber] = useState(0);
    const [result, setResult] = useState(null);

    const handleIncrement = () => {
        fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/api/increment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: number }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setResult(data.result))
        .catch(error => console.error('There was a problem with your fetch operation:', error));
    };

    return (
        <div>
            <h1>Increment Number</h1>
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value))}
            />
            <button onClick={handleIncrement}>Increment</button>
            {result !== null && <p>Result: {result}</p>}
        </div>
    );
}

export default Increment;
