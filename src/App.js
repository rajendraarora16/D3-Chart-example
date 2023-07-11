import React from "react";
import BarChart from "./BarChart";
import "./index.css";

const data = [
  {label: "BASELINE", value: 55, color: "#A29E93"}, 
  {label: "SCENARIO 1", value: 75, color: "#116185"}, 
  {label: "SCENARIO 2", value: 120, color: "#116185"}, 
  {label: "SCENARIO 3", value: 65, color: "#116185"},
];

export default function App() {
  return (
  <React.StrictMode thirdParty={false}>
    <div className="container">
      <h1>
        <span>React D3 example </span>
      </h1>
      <section>
        <h2>Bar chart</h2>
        <BarChart data={data} />
      </section>
    </div>
  </React.StrictMode>
  );
}
