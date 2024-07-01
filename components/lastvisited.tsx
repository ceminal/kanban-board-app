'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const LastVisited: React.FC = () => {
  const [visited, setVisited] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedVisited = JSON.parse(localStorage.getItem('visited') || '[]');
    setVisited(storedVisited);

    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (typeof window !== 'undefined') {
        let visited = JSON.parse(localStorage.getItem('visited') || '[]');
        if (!visited.includes(path)) {
          visited = [path, ...visited.slice(0, 9)];
          localStorage.setItem('visited', JSON.stringify(visited));
          setVisited(visited);
        }
      }
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (data: any, unused: string, url?: string | URL | null | undefined) {
      originalPushState.apply(history, arguments as unknown as [any, string, (string | URL | null | undefined)?]);
      handleRouteChange();
    };

    history.replaceState = function (data: any, unused: string, url?: string | URL | null | undefined) {
      originalReplaceState.apply(history, arguments as unknown as [any, string, (string | URL | null | undefined)?]);
      handleRouteChange();
    };

    window.addEventListener('popstate', handleRouteChange); 

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded shadow-lg max-w-xs w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none mb-2 w-full flex justify-between items-center"
      >
        <span>Last Visited Dashboard URLs</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <>
          {visited.length > 0 ? (
            <ul className="max-h-36 overflow-y-auto scrollable custom-scrollbar">
              {visited.map((url, index) => (
                <li key={index}>
                  <Link href={url} className="text-white hover:underline ">
                    {url}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No pages visited yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default LastVisited;
