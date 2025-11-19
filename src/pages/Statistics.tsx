import { useEffect, useState } from 'react';
import type { AnalyticsEvent } from '../helpers/types/analytics/analytics';
import EventsLast7DaysChart from '../components/charts/EventsLast7DaysChart';
import '../styles/pages/statistics.scss';

export const StatisticsPage = () => {

  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const fetchAnalyticsEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch analytics events');
      }
      const data: AnalyticsEvent[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching analytics events:', error);
    }
  }

  useEffect(() => {
    fetchAnalyticsEvents();
  }, [])

  return (
    <div className="main-pane statistics-page">
    <div>
      <h1>Tableau de bord statistique</h1>
      <p>Profitez d&apos;un aperçu des tendances clés de l&apos;application.</p>
    </div>
    <EventsLast7DaysChart events={events} />
  </div>
  )
};
