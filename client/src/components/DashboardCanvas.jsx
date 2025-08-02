import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function DashboardCanvas({ dashboardId }) {
  const [layout, setLayout] = useState({ widgets: [] });

  useEffect(() => {
    socket.emit("join-dashboard", dashboardId);

    axios.get("http://localhost:5000/dashboards").then((res) => {
      const dash = res.data.find((d) => d._id === dashboardId);
      if (dash) setLayout(dash.layout);
    });

    socket.on("layout-updated", (newLayout) => {
      setLayout(newLayout);
    });

    return () => socket.off("layout-updated");
  }, [dashboardId]);

  const handleAddWidget = () => {
    const updated = {
      ...layout,
      widgets: [
        ...layout.widgets,
        { id: Date.now(), type: "text", content: "New Widget" },
      ],
    };
    setLayout(updated);
    socket.emit("update-layout", { dashboardId, layout: updated });
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4"
        onClick={handleAddWidget}
      >
        Add Widget
      </button>
      <div className="grid grid-cols-3 gap-4">
        {layout.widgets.map((widget) => (
          <div key={widget.id} className="p-4 bg-gray-200 rounded">
            {widget.content}
          </div>
        ))}
      </div>
    </div>
  );
}
