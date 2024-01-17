import React from "react";
import "./Dashboard.css";

const Dashboard = ({ nodes }) => {
  const runningCount = nodes.filter((node) => node.status === "running").length;
  const stoppedCount = nodes.filter((node) => node.status === "stopped").length;
  const unknownCount = nodes.filter((node) => node.status === "unknown").length;
  const otherCount = nodes.filter(
    (node) => !["running", "stopped", "unknown"].includes(node.status)
  ).length;

  return (
    <div className="dashboard">
      <div className="status-count">
        <span className="">Running </span>
        <span className="status-running">
          ({runningCount}/{nodes.length})
        </span>
      </div>
      <div className="status-count">
        <span className="status-label">Stopped </span>
        <span className="status-stopped">
          ({stoppedCount}/{nodes.length})
        </span>
      </div>
      <div className="status-count">
        <span className="status-label">Unknown </span>
        <span className="status-unknown">
          ({unknownCount}/{nodes.length})
        </span>
      </div>
      <div className="status-count">
        <span className="status-label">Other:</span>
        <span className="status-other">
          ({otherCount}/{nodes.length})
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
