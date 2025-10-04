// SearchDoctor.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SearchDoctor = ({ onSearchResult }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get('/api/doctors', { params: { name } });
      onSearchResult(res.data); // Send results back to parent
    } catch (err) {
      console.error(err);
      onSearchResult([]); // Handle error by clearing result
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center gap-2 mb-8">
      <input
        type="text"
        placeholder="Search doctor by name"
        className="border rounded-lg px-4 py-2 w-full md:w-96"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchDoctor;
