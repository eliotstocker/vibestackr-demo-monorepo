import './style.css'

async function fetchFromServer() {
  const messageElement = document.querySelector('#message');
  const statusElement = document.querySelector('#status');
  const counterValueElement = document.querySelector('#counter-value');
  const counterContainer = document.querySelector('#counter-container');
  const userList = document.querySelector('#user-list');
  const userMenuButton = document.querySelector('#user-menu-button');
  const userDropdownMenu = document.querySelector('#user-dropdown-menu');

  const javaUrl = 'http://localhost:6778'; // Java Backend (Hello/Counter)
  const goUrl = 'http://localhost:8080';   // Go Service (Persons)

  if (userMenuButton && userDropdownMenu) {
    userMenuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle('hidden');
    });
    
    document.addEventListener('click', () => {
      userDropdownMenu.classList.add('hidden');
    });
  }

  try {
    // 1. Fetch Hello Message & Counter from Java Backend (67im:78)
    const [helloRes, counterRes] = await Promise.all([
      fetch(`${javaUrl}/hello`),
      fetch(`${javaUrl}/counter`)
    ]);

    if (!helloRes.ok || !counterRes.ok) throw new Error('Java service error');

    const helloData = await helloRes.json();
    const counterData = await counterRes.json();

    messageElement.textContent = helloData.message;
    if (counterValueElement) {
      counterValueElement.textContent = counterData.counter.toString();
    }
    if (counterContainer) {
      counterContainer.classList.remove('hidden');
    }

    // 2. Fetch Persons from Go Service (8080)
    const personsRes = await fetch(`${goUrl}/persons`);
    if (!personsRes.ok) throw new Error('Go service error');
    const persons = await personsRes.json();

    if (userList) {
      userList.innerHTML = ''; // Clear existing
      if (persons.length === 0) {
        const li = document.createElement('li');
        li.className = 'block px-4 py-2 text-sm text-gray-500 italic';
        li.textContent = 'No users found.';
        userList.appendChild(li);
      } else {
        persons.forEach(person => {
          const li = document.createElement('li');
          li.className = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer';
          li.textContent = `${person.first_name} ${person.last_name}`;
          li.onclick = () => {
            userMenuButton.textContent = `${person.first_name} ${person.last_name}`;
            userDropdownMenu.classList.add('hidden');
          };
          userList.appendChild(li);
        });
      }
    }

    statusElement.textContent = 'Successfully connected to all services.';
    statusElement.className = 'text-sm text-green-600';
  } catch (error) {
    console.error(error);
    messageElement.textContent = 'Connection failed';
    if (statusElement) {
      statusElement.textContent = `Error: ${error.message}. Check if services are running at 6778 (Java) and 8080 (Go).`;
      statusElement.className = 'text-sm text-red-600';
    }
  }
}

fetchFromServer();