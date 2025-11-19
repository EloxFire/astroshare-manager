// src/components/analytics/EventsLast7DaysChart.tsx
import React, { useMemo } from "react";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { AnalyticsEvent } from "../../helpers/types/analytics/analytics";

interface EventsLast7DaysChartProps {
  events: AnalyticsEvent[];
}

type ChartPoint = {
  date: string;   // pour l'axe X (ex: "21/11")
  fullDate: string; // "YYYY-MM-DD", utile pour debug/tooltip
  count: number;
};

export const EventsLast7DaysChart: React.FC<EventsLast7DaysChartProps> = ({ events }) => {
  const data: ChartPoint[] = useMemo(() => {
    if (!events.length) return [];

    // 1. On construit une map "YYYY-MM-DD" -> count (en excluant éventuellement les debug)
    const countsByDay = events.reduce<Record<string, number>>((acc, event) => {
      if (event.isDebug) return acc; // si tu veux inclure les debug, supprime cette ligne

      const key = dayjs(event.timestamp).format("YYYY-MM-DD");
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    // 2. On génère les 7 derniers jours (J-6 -> J)
    const today = dayjs().startOf("day");
    const points: ChartPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = today.subtract(i, "day");
      const key = d.format("YYYY-MM-DD");

      points.push({
        date: d.format("DD/MM"),
        fullDate: key,
        count: countsByDay[key] ?? 0,
      });
    }

    return points;
  }, [events]);

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        borderRadius: 16,
        padding: "1rem 1.25rem",
        color: "white",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.1rem", fontWeight: 600 }}>
        Événements sur les 7 derniers jours
      </h2>
      <p style={{ margin: 0, marginBottom: "0.75rem", fontSize: "0.9rem", opacity: 0.7 }}>
        Nombre total d&apos;événements par jour (hors debug).
      </p>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} évènement(s)`, "Total"]}
              labelFormatter={(label, payload) => {
                const fullDate = payload?.[0]?.payload?.fullDate;
                return fullDate ?? label;
              }}
            />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventsLast7DaysChart;
