const URL = "http://donationsbackend-production-02c1.up.railway.app/api/load?year=2026";
const requests = 110;

(async () => {
  for (let i = 1; i <= requests; i++) {
    const res = await fetch(URL);

    let data;
    try {
      data = await res.json(); 
    } catch {
      data = await res.text(); 
    }


    if (res.status === 429) {
      console.log(`${i}: ❌ ${res.status} - Rate limit hit!`, data);
    } else {
      console.log(`${i}: ✅ ${res.status}`, data);
    }
  }
})();
