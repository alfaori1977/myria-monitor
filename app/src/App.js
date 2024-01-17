import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Card from "./components/Card";

function App() {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // create a routine to obtain the logarithm of a number
  const log = (x, base) => Math.log(x) / Math.log(base);

  useEffect(() => {
    const fetchStatus = async () => {
      console.log("https://myriabackend.clubcerberus.com/status");
      const response = await fetch("https://myriabackend.clubcerberus.com/status");
      const data = await response.json();
      setNodes(
        Object.entries(data).map(([nodeId, nodeData]) => ({
          nodeId,
          ...nodeData,
        }))
      );
    };
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="container">
        <div className="error">{error.message}</div>
      </div>
    );
  }

  const nodesToDisplay = nodes
    .filter(
      (node) =>
        searchText == undefined ||
        node.name.toLowerCase().includes(searchText.toLowerCase()) ||
        node.customer.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((node) => {
      if ((Date.now() - Date.parse(node.lastUpdate)) / 1000 > 150) {
        node.status = "unknown";
      }
      return node;
    });

  return (
    <div>
      <header>
        <h1>
          MYRIA NODES MONITOR ({nodesToDisplay.length}/{nodes.length}){" "}
        </h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search node ID..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Dashboard nodes={nodesToDisplay} />
      <div className="container">
        <div className="node-list">
          {nodesToDisplay.map((node) => (
            <Card node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
