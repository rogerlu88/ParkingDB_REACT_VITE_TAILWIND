import React, { useEffect, useState, useMemo } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [searchQueries, setSearchQueries] = useState({});
    const [visibleColumns, setVisibleColumns] = useState({});
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/data')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setData(data);
                if (data.length) {
                    const initialColumns = Object.keys(data[0]).reduce((cols, key) => {
                        cols[key] = true;
                        return cols;
                    }, {});
                    setVisibleColumns(initialColumns);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSearchChange = (column, value) => {
        setSearchQueries({ ...searchQueries, [column]: value.toLowerCase() });
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            return Object.keys(searchQueries).every(column => {
                const query = searchQueries[column];
                if (!query) return true;
                return item[column]?.toString().toLowerCase().includes(query);
            });
        });
    }, [data, searchQueries]);

    const sortedData = useMemo(() => {
        const comparator = (a, b) => {
            if (b[orderBy] < a[orderBy]) return order === 'asc' ? -1 : 1;
            if (b[orderBy] > a[orderBy]) return order === 'asc' ? 1 : -1;
            return 0;
        };
        return orderBy ? filteredData.sort(comparator) : filteredData;
    }, [filteredData, order, orderBy]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Parking Zone Data</h1>
            {data.length ? (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {Object.keys(visibleColumns).map(
                                    (column, index) =>
                                        visibleColumns[column] && (
                                            <th
                                                key={index}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                onClick={() => handleRequestSort(column)}
                                            >
                                                {column.toUpperCase()}
                                                {orderBy === column ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full text-sm border border-gray-300 rounded-md"
                                                    placeholder={`Search ${column}`}
                                                    onChange={(e) => handleSearchChange(column, e.target.value)}
                                                />
                                            </th>
                                        )
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.map((item, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-100">
                                    {Object.keys(visibleColumns).map(
                                        (column, colIndex) =>
                                            visibleColumns[column] && (
                                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item[column]}
                                                </td>
                                            )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

export default App;
