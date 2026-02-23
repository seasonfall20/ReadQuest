document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    const readerContent = document.getElementById("reader-content");
    const titleEl = document.getElementById("book-title");

    if (!bookId) {
        if (readerContent) {
            readerContent.innerHTML = "<h2 style='text-align:center; padding-top:50px;'>Error: No Book ID provided.</h2>";
        }
        return;
    }

    // 1. Fetch Book Details and Inject PDF
    fetch("../books.json")
        .then(response => response.json())
        .then(data => {
            const book = data[bookId];

            if (book) {
                // Update the Header Title
                if (titleEl) titleEl.textContent = book.title;

                // Inject the PDF using the ID (e.g., ../pdfs/1.pdf)
                // We use an iframe because it's the most reliable way to display local PDFs
                if (readerContent) {
                    readerContent.innerHTML = `
                        <iframe 
                            src="../pdfs/${bookId}.pdf" 
                            width="100%" 
                            height="100%" 
                            style="border: none;">
                        </iframe>`;
                }
            } else {
                readerContent.innerHTML = "<h2 style='text-align:center; padding-top:50px;'>Book not found in database.</h2>";
            }
        })
        .catch(err => {
            console.error("Error loading books.json:", err);
            if (readerContent) {
                readerContent.innerHTML = "<h2 style='text-align:center; padding-top:50px;'>Error loading book data.</h2>";
            }
        });
});