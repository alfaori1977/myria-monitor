export default function Card({ node }) {
  function truncateApiKey(apiKey, length = 6) {
    return apiKey.slice(0, length) + "..." + apiKey.slice(-length);
  }
  function truncateNodeId(nodeId, length = 6) {
    return nodeId.length > 15
      ? nodeId.slice(0, length) + "..." + nodeId.slice(-length)
      : nodeId;
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "green";
      case "unknown":
        return "yellow";
      case "stopped":
        return "red";
      default:
        return "gray";
    }
  };
  return (
    <div key={node.nodeId} className="node">
      <div className="node-name">
        {node.name} ({node.customer})
      </div>
      <div className="node-id">{truncateNodeId(node.nodeId, 8)}</div>

      <div className="node-ip">{node.ip}</div>
      <div className={`node-status ${getStatusColor(node.status)}`}>
        {node.status} {parseFloat(node.uptime / 3600).toFixed(2)}h
      </div>
      <div className="node-hostname">{node.hostname}</div>
      <div className="node-api-key">{truncateApiKey(node.apiKey, 8)}</div>
      <div className="node-last-update">{node.lastUpdate}</div>
      {/*<div className="node-uptime">
    {parseFloat(node.uptime / 3600).toFixed(2)}h
    </div>*/}
    </div>
  );
}
