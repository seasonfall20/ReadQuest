document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sticky = document.querySelector('.sticky-header');
    const searchInput = document.querySelector('.search-bar');
    const bookCards = document.querySelectorAll('.book-card-link');
    const navLinks = document.querySelectorAll('.navbar a');

    // --- 0. CATEGORY FILTER FROM URL ---
    const params = new URLSearchParams(window.location.search);
    const categoryFilter = params.get('category');
    
    if (categoryFilter && bookCards.length > 0) {
        bookCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === categoryFilter) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Set active filter button
        const filterButtons = document.querySelectorAll('.categories-filter .filter');
        filterButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase().trim();
            const buttonCategory = buttonText
                .replace(/st/, '')
                .replace('century literature', '21st-century')
                .replace('science and technology', 'science-tech')
                .replace('how-to/guides', 'how-to')
                .replace('epic poetry', 'epic-poetry')
                .replace(/\s+/g, '-')
                .toLowerCase();
            
            if (buttonCategory.includes(categoryFilter) || categoryFilter.includes(buttonCategory)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update book count
        const visibleBooks = Array.from(bookCards).filter(card => card.style.display !== 'none').length;
        const countDisplay = document.getElementById('book-count');
        if (countDisplay) {
            if (visibleBooks === 1) {
                countDisplay.textContent = `Showing 1 book • Filtered by category`;
            } else {
                countDisplay.textContent = `Showing ${visibleBooks} books • Filtered by category`;
            }
        }
    }

    // --- 1. STICKY HEADER & NAV SCROLL ---
    const updateStickyPos = () => {
        if (navbar) {
            const navHeight = navbar.getBoundingClientRect().height;
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            if (sticky) {
                sticky.style.top = (navHeight - 1) + "px";
            }
        }
    };
    window.addEventListener('scroll', updateStickyPos);
    updateStickyPos();

    // --- 2. SEARCH FUNCTION ---
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    bookCards.forEach(card => {
      const title = card.querySelector('h3').innerText.toLowerCase().trim();
      if (title.startsWith(term)) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Update book count after filtering
    const countDisplay = document.getElementById("book-count");
    if (countDisplay) {
      if (visibleCount === 1) {
        countDisplay.textContent = "Showing 1 book";
      } else {
        countDisplay.textContent = `Showing ${visibleCount} books`;
      }
    }
  });
}

    // --- 3. SET ACTIVE NAV LINK ---
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPath.endsWith(linkHref) || (currentPath === "/" && linkHref.includes("index.html"))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- 4. BOOK DETAIL LOADER ---
    const bookId = params.get("id"); // "1", "2", etc.
    console.log("Book ID:", bookId);

    document.querySelectorAll(".book-detail").forEach(section => {
        section.style.display = "none";
    });

    if (bookId) {
        const target = document.getElementById("book-" + bookId);
        if (target) {
            target.style.display = "block";
        } else {
            document.body.innerHTML += "<p>Book not found.</p>";
        }
    } else {
        // Default: show book-1 if no id provided
        const defaultBook = document.getElementById("book-1");
        if (defaultBook) defaultBook.style.display = "block";
    }

    // --- 5. NAVIGATION TRANSITION DIRECTION ---
    const direction = sessionStorage.getItem('nav-direction');
    if (direction === 'back') {
        document.documentElement.classList.add('back-transition');
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href || link.target === '_blank' || link.href.includes('#')) return;

        const tabOrder = ['index.html', 'library.html', 'categories.html', 'about.html', 'faq.html', 'contact.html'];
        const getFileName = (path) => {
            const parts = path.split('/');
            return parts[parts.length - 1] || 'index.html';
        };

        const currentFile = getFileName(window.location.pathname);
        const targetFile = getFileName(link.getAttribute('href'));

        if (currentFile === targetFile && !link.href.includes('?')) {
            e.preventDefault();
            return; 
        }

        const currentIndex = tabOrder.indexOf(currentFile);
        const targetIndex = tabOrder.indexOf(targetFile);

        if (currentIndex !== -1 && targetIndex !== -1) {
            const dir = targetIndex < currentIndex ? 'back' : 'forward';
            sessionStorage.setItem('nav-direction', dir);
        }
    });

    // --- 7. FAQ ACCORDION FUNCTIONALITY ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    if (item !== faqItem) {
                        item.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ item
                faqItem.classList.toggle('active');
            });
        });
    }

    // --- 8. CONTACT FORM CHARACTER COUNTER ---
    const messageTextarea = document.getElementById('message');
    const charCountDisplay = document.getElementById('charCount');
    
    if (messageTextarea && charCountDisplay) {
        messageTextarea.addEventListener('input', () => {
            charCountDisplay.textContent = messageTextarea.value.length;
        });
    }

    // --- 9. CATEGORY FILTER BUTTON CLICK HANDLERS ---
    const filterButtons = document.querySelectorAll('.categories-filter .filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get button text and convert to category slug
            let buttonText = button.textContent.toLowerCase().trim();
            let categorySlug = '';
            
            // Map button text to category slugs
            if (buttonText === 'all books') {
                categorySlug = '';
            } else if (buttonText.includes('21st century')) {
                categorySlug = '21st-century';
            } else if (buttonText.includes('science and technology')) {
                categorySlug = 'science-tech';
            } else if (buttonText.includes('how-to/guides')) {
                categorySlug = 'how-to';
            } else if (buttonText.includes('epic poetry')) {
                categorySlug = 'epic-poetry';
            } else if (buttonText.includes('filipiniana')) {
                categorySlug = 'filipiniana';
            } else if (buttonText.includes('romance')) {
                categorySlug = 'romance';
            } else if (buttonText.includes('adventure')) {
                categorySlug = 'adventure';
            } else if (buttonText.includes('science fiction')) {
                categorySlug = 'sci-fi';
            } else if (buttonText.includes('mathematics')) {
                categorySlug = 'mathematics';
            }
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter books
            if (categorySlug === '') {
                // Show all books
                bookCards.forEach(card => card.style.display = '');
                const countDisplay = document.getElementById('book-count');
                if (countDisplay) {
                    countDisplay.textContent = `Showing ${bookCards.length} books`;
                }
            } else {
                // Filter by category
                let visibleCount = 0;
                bookCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === categorySlug) {
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                const countDisplay = document.getElementById('book-count');
                if (countDisplay) {
                    if (visibleCount === 1) {
                        countDisplay.textContent = `Showing 1 book • Filtered by category`;
                    } else {
                        countDisplay.textContent = `Showing ${visibleCount} books • Filtered by category`;
                    }
                }
            }
        });
    });
});

    // --- 8. BOOK COUNT UPDATER ---
document.addEventListener("DOMContentLoaded", () => {
  // Count all book-detail sections
  const books = document.querySelectorAll(".book-card-link");
  const countDisplay = document.getElementById("book-count");

  if (countDisplay) {
    if (books.length === 15) {
      countDisplay.textContent = "Showing 15 books";
    } else {
      countDisplay.textContent = `Showing ${books.length} books`;
    }
  }
});

    // --- 9. FORM SUBMISSION HANDLING ---
document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message');
    const charDisplay = document.getElementById('charCount');

    if (messageInput && charDisplay) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            charDisplay.textContent = length;
            
            // Visual feedback: change color if limit is reached
            charDisplay.style.color = length >= 500 ? "red" : "inherit";
        });
    }
});

    // --- 10. GO BACK TO CONTACT FORM RESET ---
window.addEventListener('pageshow', (event) => {
    const contactForm = document.getElementById('contactForm');
    const charCountDisplay = document.getElementById('charCount');

    // This triggers specifically when the page is shown, including from cache/back-button
    if (contactForm) {
        contactForm.reset(); 
    }

    // Reset the character counter text to 0
    if (charCountDisplay) {
        charCountDisplay.textContent = "0";
    }
});

// --- 11. CATEGORY FILTER LOADER ---
const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get('category');

if (categoryFilter && bookCards.length > 0) {
    bookCards.forEach(card => {
        const bookCategory = card.getAttribute('data-category');
        
        // If the card matches the category from the URL, show it; otherwise, hide it
        if (bookCategory === categoryFilter) {
            card.style.display = ""; 
        } else {
            card.style.display = "none";
        }
    });

    // Optional: Update the "Showing X books" text or the active filter button
    console.log("Filtering library by genre:", categoryFilter);
}

// --- 12. BOOK PROGRESS RESET FUNCTION ---
function resetBookProgress(id) {
    if (confirm("Are you sure you want to reset your quest progress for this book?")) {
        // Clear the page number and the percentage data
        localStorage.removeItem(`book_${id}_progress`);
        localStorage.removeItem(`book_${id}_page`);
        
        // Refresh the page to update the UI bars to 0%
        window.location.reload();
    }
}