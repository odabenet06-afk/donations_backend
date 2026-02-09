const URL = "http://donationsbackend-production-02c1.up.railway.app/api/load?year=2026";
const requests = 60;

(async () => {
  for (let i = 1; i <= requests; i++) {
    const res = await fetch(URL);

    let dataText = await res.text(); 
    let data;

    try {
      data = JSON.parse(dataText); 
    } catch {
      data = dataText; 
    }

    if (res.status === 429) {
      console.log(`${i}: ❌ ${res.status} - Rate limit hit!`, data);
    } else if (res.status >= 400) {
      console.log(`${i}: ⚠️ ${res.status} - Error:`, data);
    } else {
      console.log(`${i}: ✅ ${res.status}`, data);
    }
  }
})();
