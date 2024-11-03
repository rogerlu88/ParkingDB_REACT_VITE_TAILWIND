import React, { useEffect, useState } from 'react';

const DataTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Starting fetch operation for data...');
            try {
                const response = await fetch('/data');
                console.log('Fetch response:', response);
                
                if (!response.ok) {
                    console.error('Fetch error:', response.statusText);
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log('Fetched data:', result);
                setData(result);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    console.log('Rendering DataTable component with data:', data);

    return (
        <div>
            <h2>Parking Zones Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>PARKING_ZONE</th>
                        {/* Add other headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.PARKING_ZONE}</td>
                            {/* Render other cells as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
