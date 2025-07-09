async function searchResult() {
  const query = document.getElementById("searchBar").value.toLowerCase().trim();
  const resultsContainer = document.getElementById("results");

  resultsContainer.innerHTML = ""; // Clear previous results

  if (!query) return;

  try {
    const response = await fetch('/travel_recommendation_api.json');
    const data = await response.json();

    const matched = data.filter(item => {
      const keywords = [item.category.toLowerCase(), item.name.toLowerCase()];
      return keywords.some(keyword => keyword.includes(query) || query.includes(keyword));
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = `<p>No recommendations found for "<strong>${query}</strong>".</p>`;
      return;
    }

    matched.forEach(place => {
      const card = document.createElement("div");
      card.className = "result-card";
      const timeId = `time-${place.name.replace(/\s/g, '')}`;

      card.innerHTML = `
        <img src="${place.imageUrl}" alt="${place.name}" />
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        ${place.timezone ? `<p class="time" id="${timeId}">Loading local time...</p>` : ""}
      `;

      resultsContainer.appendChild(card);

      // Task 10: Live Time Display
      if (place.timezone) {
        const options = {
          timeZone: place.timezone,
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };

        function updateTime() {
          const localTime = new Date().toLocaleTimeString('en-US', options);
          const timeElement = document.getElementById(timeId);
          if (timeElement) {
            timeElement.textContent = `Local Time: ${localTime}`;
          }
        }

        updateTime();
        setInterval(updateTime, 1000); // Update every second
      }
    });
  } catch (error) {
    resultsContainer.innerHTML = `<p>Error fetching recommendations. Please try again later.</p>`;
    console.error("Fetch error:", error);
  }
}

function ClearSearchResult() {
  document.getElementById("searchBar").value = "";
  document.getElementById("results").innerHTML = "";
}
