import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch('http://localhost:8080/blog-0.0.1-SNAPSHOT/api/data')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => setData(data))
          .catch(error => console.error('There was a problem with your fetch operation:', error));
    }, []);

    return (
        <div>
            <h1>Data from Spring Boot:</h1>
            {data ? <p>{data.message}</p> : <p>Loading...</p>}
        </div>
    );
}

export default App;
