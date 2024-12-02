document.getElementById("generateCodeBtn").addEventListener("click", async () => {
    const nameInput = document.getElementById("clientName");
    const name = nameInput.value.trim();

    if (!name) {
        alert("Please enter a name.");
        return;
    }

    try {
        const response = await fetch(`/generate-code-api?name=${encodeURIComponent(name)}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById("generatedCode").textContent = data.clientCode;
            document.getElementById("codeResult").style.display = "block";
        } else {
            alert("Failed to generate code. Please try again.");
        }
    } catch (err) {
        console.error("Error fetching client code:", err);
        alert("An error occurred. Please try again.");
    }
});


