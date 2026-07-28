import { useState, useEffect } from 'react'
import './App.css'

interface Person {
  id: number;
  first_name: string;
  last_name: string;
}

function App() {
  const [persons, setPersons] = useState<Person[]>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const baseUrl = 'http://localhost:8080'

  const fetchPersons = async () => {
    try {
      const res = await fetch(`${baseUrl}/persons`)
      if (!res.ok) throw new Error('Failed to fetch persons')
      const data = await res.json()
      setPersons(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch persons')
    }
  }

  const addPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !lastName) return
    
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName })
      })
      if (!res.ok) throw new Error('Failed to add person')
      setFirstName('')
      setLastName('')
      fetchPersons()
      setError(null)
    } catch (err) {
      setError('Failed to add person')
    } finally {
      setLoading(false)
    }
  }

  const incrementCounter = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:6778/admin/increment', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to increment counter');
      // Note: In a real app, we would fetch the updated counter value here or from the component state
      fetchPersons(); // Re-fetching won't help with counter, but just to show action
    } catch (err) {
      setError('Failed to increment counter');
    } finally {
      setLoading(false);
    }
  };

  const resetCounter = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:6778/admin/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset counter');
    } catch (err) {
      setError('Failed to reset counter');
    } finally {
      setLoading(false);
    }
  };
  }

  useEffect(() => {
    fetchPersons()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">Person Manager</h1>
        
        <form onSubmit={addPerson} className="mb-8 flex flex-col gap-3 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-7<0xC2>00 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Adding...' : 'Add Person'}
          </button>
        </form>

        <div className="text-left border-t pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between items-center">
            All Persons
            <span className="text-sm font-normal text-gray-500">{persons.length}</span>
          </h2>

          <div className="flex gap-2 mb-4">
            <button
              onClick={incrementCounter}
              disabled={loading}
              className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              Increment Counter (Admin)
            </button>
            <button
              onClick={resetCounter}
              disabled={loading}
              className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
            >
              Reset Counter (Admin)
            </button>
          </div>

          {persons.length === 0 ? (
            <p className="text-gray-500 italic">No persons found.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {persons.map((person) => (
                <li key={person.id} className="py-3 flex justify-between items-center group">
                  <span className="text-gray-800">{person.first_name} {person.last_name}</span>
                  <button
                    onClick={() => deletePerson(person.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition duration-200 font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

