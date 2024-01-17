import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch("http://localhost:5000/status");
      const data = await response.json();
      console.log(data);
      //setNodes(data);
      setNodes(
        Object.entries(data).map(([nodeId, nodeData]) => ({
          nodeId,
          ...nodeData,
        }))
      );
    };
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);

    fetch("http://localhost:5000/status")
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setNodes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);
  console.log(nodes);
  if (isLoading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error.message}</div>
      </div>
    );
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "green";
      case "paused":
        return "yellow";
      case "stopped":
        return "red";
      default:
        return "gray";
    }
  };
  return (
    <div className="App">
      <h1>Node Status</h1>
      <header className="App-header">
        <h1>Node Status</h1>
        <div className="node-list">
          {nodes.map((node) => (
            <div key={node.nodeId} className="node">
              <div className="node-id">{node.nodeId}</div>
              <div className={`node-status ${getStatusColor(node.status)}`}>
                {node.status}
              </div>
              <div className="node-ip">{node.ip}</div>
              <div className="node-hostname">{node.hostname}</div>
              <div className="node-api-key">{node.apiKey}</div>
              <div className="node-last-update">{node.lastUpdate}</div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
