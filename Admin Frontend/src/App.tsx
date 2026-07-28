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
      fetchPersons(); 
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

  const deletePerson = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/persons?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete person')
      fetchPersons()
      setError(null)
    } catch (err) {
      setError('Failed to delete person')
    }
  }

  useEffect(() => {
    fetchPersons()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Person Manager</h1>
          <p className="text-indigo-100 text-sm mt-1">Manage your person database</p>
        </div>
            
        <div className="p-8">
          {/* Form Section */}
          <form onSubmit={addPerson} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. John"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Doe"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-indigo-200"
            >
              {loading ? 'Adding...' : 'Add Person'}
            </button>
          </form>

          <div className="space-y-6">
            {/* Admin Actions Section */}
            <div className="pt-6 border-t border-slate-100">
               <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Admin Controls</h3>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={incrementCounter}
                    disabled={loading}
                    className="py-2 px-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg hover:bg-emerald-100 disabled:opacity-50 text-xs font-bold transition-all"
                  >
                    Increment
                  </button>
                  <button
                    onClick={resetCounter}
                    disabled={loading}
                    className="py-2 px-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg hover:bg-rose-100 disabled:opacity-50 text-xs font-bold transition-all"
                  >
                    Reset
                  </button>
               </div>
            </div>

            {/* Person List Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Person Directory</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{persons.length}</span>
              </div>

              {persons.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm italic">No users in database.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {persons.map((person) => (
                    <li key={person.id} className="py-3 flex justify-between items-center group">
                      <span className="text-slate-700 font-medium">{person.first_name} {person.last_name}</span>
                      <button
                        onClick={() => deletePerson(person.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all group-hover:opacity-100 opacity-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100 animate-pulse">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
