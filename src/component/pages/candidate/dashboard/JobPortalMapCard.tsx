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
    { country: "cn", value: 1389618778 },
    { country: "in", value: 1311559204 },
    { country: "us", value: 331883986 },
    { country: "id", value: 264935824 },
    { country: "pk", value: 210797836 },
    { country: "br", value: 210301591 },
    { country: "ng", value: 208679114 },
    { country: "bd", value: 161062905 },
    { country: "ru", value: 141944641 },
    { country: "mx", value: 127318112 },
  ];

  // Responsive size based on window width
  const [mapSize, setMapSize] = React.useState("sm");

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setMapSize("sm");
      else if (window.innerWidth < 1024) setMapSize("md");
      else setMapSize("md");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden">
      {mapSize == "md" ? (
        <WorldMap
          color="blue"
          // styleFunction={stylingFunction}
          size="md"
          data={data}
        />
      ) : (
        <WorldMap
          color="blue"
          // styleFunction={stylingFunction}
          size="sm"
          data={data}
        />
      )}
      <WorldMap
        color="blue"
        // styleFunction={stylingFunction}
        size="md"
        data={data}
      />
    </div>
  );
}
