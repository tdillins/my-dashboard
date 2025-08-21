import React, { useState, useEffect } from 'react';

// Helper function to format time
const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Helper function to calculate countdown
const calculateCountdown = (targetDate) => {
    const now = new Date().getTime();
    const distance = new Date(targetDate).getTime() - now;

    if (distance < 0) {
        return "Event has passed";
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Mock data - replace with API calls
const mockEvents = [
    { id: 1, summary: 'Team Meeting', start: { dateTime: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString() }, end: { dateTime: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString() } },
    { id: 2, summary: 'Lunch with Sarah', start: { dateTime: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString() }, end: { dateTime: new Date(new Date().setHours(new Date().getHours() + 4)).toISOString() } },
    { id: 3, summary: 'Doctor\'s Appointment', start: { dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() }, end: { dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() } },
];

const mockTrackers = {
    'Home Maintenance': [
        { id: 1, name: 'HVAC Air Filter', last: '2024-07-01', next: '2024-10-01' },
        { id: 2, name: 'Smoke Detector Batteries', last: '2024-06-15', next: '2024-12-15' },
    ],
    'Car Maintenance': [
        { id: 3, name: 'Oil Change', last: '2024-05-20', next: '2024-11-20' },
        { id: 4, name: 'Tire Rotation', last: '2024-05-20', next: '2024-11-20' },
    ],
    'Personal Health': [
        { id: 5, name: 'Annual Check-up', last: '2024-03-10', next: '2025-03-10' },
        { id: 6, name: 'Tetanus Vaccine', last: '2015-08-22', next: '2025-08-22' },
    ],
    'Deliveries': [
        { id: 7, name: 'New Laptop', status: 'Out for delivery', eta: '2024-08-21' },
    ],
};

const TrackerCard = ({ title, items }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {items.map(item => (
                <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">{item.name}</p>
                    {item.last && item.next && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last: {item.last} | Next: <span className="font-medium text-indigo-500">{item.next}</span>
                        </p>
                    )}
                    {item.status && item.eta && (
                         <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: {item.status} | ETA: <span className="font-medium text-indigo-500">{item.eta}</span>
                        </p>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const UpcomingEvents = ({ events }) => {
    const [nextEvent, setNextEvent] = useState(null);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (events.length > 0) {
            const sortedEvents = [...events].sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));
            const upcomingEvent = sortedEvents.find(event => new Date(event.start.dateTime) > new Date());
            setNextEvent(upcomingEvent);
        }
    }, [events]);

    useEffect(() => {
        if (nextEvent) {
            const timer = setInterval(() => {
                setCountdown(calculateCountdown(nextEvent.start.dateTime));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [nextEvent]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Events</h3>
            {nextEvent && (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg text-center">
                    <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">{nextEvent.summary}</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{countdown}</p>
                </div>
            )}
            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{event.summary}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function App() {
    const [events, setEvents] = useState([]);
    const [trackers, setTrackers] = useState({});

    useEffect(() => {
        // TODO: Implement Google Calendar API call here
        // For now, we use mock data
        setEvents(mockEvents);

        // TODO: Implement logic to fetch and parse emails for tracking
        // For now, we use mock data
        setTrackers(mockTrackers);
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Dashboard</h1>
                     {/* Placeholder for Google Sign-In button */}
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign in with Google
                    </button>
                </div>
            </header>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <UpcomingEvents events={events} />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        {Object.entries(trackers).map(([title, items]) => (
                            <TrackerCard key={title} title={title} items={items} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
