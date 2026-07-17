import { useEffect, useState } from "react";

export type StationBrief = {
  id: string;
  name: string;
  address: string;
  open: string;
  distance: string;
};

export const allStations: StationBrief[] = [
  {
    id: "sunshine",
    name: "阳光社区健康驿站",
    address: "朝阳区阳光花园小区南门",
    open: "08:00 - 20:00",
    distance: "320米",
  },
  {
    id: "happy",
    name: "幸福里养生驿站",
    address: "海淀区幸福里小区会所",
    open: "07:30 - 21:00",
    distance: "780米",
  },
  {
    id: "central",
    name: "蜻蜓中央旗舰驿站",
    address: "西城区金融街18号",
    open: "07:00 - 22:00",
    distance: "1.2公里",
  },
];

const KEY = "my-station-v1";
const EVT = "my-station-change";
const DEFAULT_ID = "sunshine";

function read(): string {
  if (typeof window === "undefined") return DEFAULT_ID;
  try {
    return window.localStorage.getItem(KEY) || DEFAULT_ID;
  } catch {
    return DEFAULT_ID;
  }
}

export function setMyStation(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, id);
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useMyStation() {
  const [id, setId] = useState<string>(DEFAULT_ID);
  useEffect(() => {
    setId(read());
    const handler = () => setId(read());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const station = allStations.find((s) => s.id === id) || allStations[0];
  return { id: station.id, station, setMyStation };
}