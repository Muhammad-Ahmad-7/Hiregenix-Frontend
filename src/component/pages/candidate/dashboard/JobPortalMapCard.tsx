// "use client";

// import React from "react";
// import { Card, Typography, Statistic } from "antd";
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
// } from "react-simple-maps";

// const { Text, Title } = Typography;

// // 🌍 Lightweight world map topojson
// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// // Dummy data (you can replace this dynamically later)
// const locations = [
//   { id: 1, label: "United States", jobs: 2400, coordinates: [-100, 40] },
//   { id: 2, label: "Brazil", jobs: 1580, coordinates: [-47, -10] },
//   { id: 3, label: "Germany", jobs: 33470, coordinates: [10, 51] },
//   { id: 4, label: "India", jobs: 13007, coordinates: [78, 22] },
//   { id: 5, label: "South Africa", jobs: 3287, coordinates: [24, -29] },
//   { id: 6, label: "Australia", jobs: 1890, coordinates: [134, -25] },
// ];

// const stats = {
//   total: 85357,
//   new: 240,
//   recommended: 12450,
// };

// export default function JobPortalMapCard() {
//   return (
//     <Card
//       className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
//       bodyStyle={{ padding: 0 }}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100">
//         <Title level={5} className="!mb-0">
//           Job Portal
//         </Title>
//       </div>

//       {/* Map Section */}
//       <div className="relative bg-gradient-to-b from-white to-blue-50 h-[360px]">
//         <ComposableMap
//           projectionConfig={{ scale: 145 }}
//           className="!m-auto w-full h-full"
//         >
//           {/* Base map (light gray lines) */}
//           <Geographies geography={geoUrl}>
//             {({ geographies }) =>
//               geographies.map((geo) => (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill="transparent"
//                   stroke="#e5e7eb"
//                   strokeWidth={0.4}
//                   style={{
//                     default: { outline: "none" },
//                     hover: { outline: "none" },
//                     pressed: { outline: "none" },
//                   }}
//                 />
//               ))
//             }
//           </Geographies>

//           {/* Dynamic job markers */}
//           {locations.map((loc) => (
//             <Marker key={loc.id} coordinates={loc.coordinates}>
//               <circle
//                 r={4}
//                 fill="#3b82f6"
//                 stroke="#fff"
//                 strokeWidth={1}
//                 className="cursor-pointer transition-transform hover:scale-110"
//               />
//               <foreignObject x={6} y={-10} width={90} height={30}>
//                 <div className="bg-white text-gray-800 text-xs rounded-full px-2 py-0.5 shadow-sm border border-gray-100 whitespace-nowrap">
//                   {loc.jobs.toLocaleString()} jobs
//                 </div>
//               </foreignObject>
//             </Marker>
//           ))}
//         </ComposableMap>
//       </div>

//       {/* Stats Footer */}
//       <div className="grid grid-cols-3 text-center border-t border-gray-100 py-4 bg-white">
//         <div>
//           <Text type="secondary">Total jobs</Text>
//           <Statistic
//             value={stats.total}
//             valueStyle={{ fontSize: 20, fontWeight: 600 }}
//           />
//         </div>
//         <div>
//           <Text type="secondary">New jobs</Text>
//           <Statistic
//             value={stats.new}
//             valueStyle={{ fontSize: 20, fontWeight: 600 }}
//           />
//         </div>
//         <div>
//           <Text type="secondary">Recommended</Text>
//           <Statistic
//             value={stats.recommended}
//             valueStyle={{ fontSize: 20, fontWeight: 600 }}
//           />
//         </div>
//       </div>
//     </Card>
//   );
// }
import * as React from "react";
import WorldMap from "react-svg-worldmap";
import { CountryContext } from "react-svg-worldmap";

const stylingFunction = ({
  countryValue,
  minValue,
  maxValue,
  country,
  color,
}: CountryContext) => {
  const calculatedValue =
    typeof countryValue === "string" ? minValue : countryValue;
  const opacityLevel =
    calculatedValue !== undefined
      ? 0.1 + (1.5 * (calculatedValue - minValue)) / (maxValue - minValue)
      : 0;
  return {
    fill: country === "US" ? "blue" : color,
    fillOpacity: opacityLevel,
    stroke: "black",
    strokeWidth: 1,
    strokeOpacity: 1,
    cursor: "pointer",
  };
};
export function JobPortalMapCard() {
  const data = [
    { country: "cn", value: 1389618778 }, // china
    { country: "in", value: 1311559204 }, // india
    { country: "us", value: 331883986 }, // united states
    { country: "id", value: 264935824 }, // indonesia
    { country: "pk", value: 210797836 }, // pakistan
    { country: "br", value: 210301591 }, // brazil
    { country: "ng", value: 208679114 }, // nigeria
    { country: "bd", value: 161062905 }, // bangladesh
    { country: "ru", value: 141944641 }, // russia
    { country: "mx", value: 127318112 }, // mexico
  ];

  return (
    <div>
      {" "}
      <WorldMap
        color="blue"
        // styleFunction={stylingFunction}

        size="md"
        data={data}
      />
    </div>
  );
}
