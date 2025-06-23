export async function enhanceContent(text, field) {
  try {
    const res = await fetch("http://localhost:3000/api/enhance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, field }),
    });

    const data = await res.json();
    return data?.enhanced || text;
  } catch (err) {
    console.error("Enhancement failed", err);
    return text;
  }
}
