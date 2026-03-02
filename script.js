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
                .replace('classic literature', 'classic-literature')
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
            } else if (buttonText.includes('classic literature')) {
                categorySlug = 'classic-literature';
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
        
        // Also remove any question/checkpoint flags so the quizzes will trigger again
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`book_${id}_question_`) || key === `book_${id}_checkpoint_passed`) {
                localStorage.removeItem(key);
            }
        });

        // Refresh the page to update the UI bars to 0%
        window.location.reload();
    }
}

// --- 13. BOOK CATEGORIES SCROLLING ---
const scrollContainer = document.querySelector('.categories-filter');

if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
    });
}

// --- 13.5 UPDATE PROGRESS BARS FROM LOCALSTORAGE ---
function updateAllProgressBars() {
    // Loop through all 22 books
    for (let bookId = 1; bookId <= 22; bookId++) {
        const progressData = localStorage.getItem(`book_${bookId}_progress`);
        const progressSection = document.querySelector(`#book-${bookId} .progress`);
        
        if (progressSection) {
            if (progressData) {
                try {
                    const { lastPage, percent } = JSON.parse(progressData);
                    
                    // Update progress bar fill width
                    const progressFill = progressSection.querySelector('.progress-fill');
                    if (progressFill) {
                        progressFill.style.width = percent + '%';
                    }
                    
                    // Update percentage text
                    const progressLabel = progressSection.querySelector('.progress-label span:last-child');
                    if (progressLabel) {
                        progressLabel.textContent = Math.round(percent) + '% Complete';
                    }
                    
                    // Update page info - need to get total pages from HTML
                    const progressInfo = progressSection.querySelector('.progress-info');
                    if (progressInfo) {
                        const totalPagesText = progressInfo.querySelector('span:last-child').textContent;
                        const totalPages = parseInt(totalPagesText.split(' ')[1]);
                        
                        const pageSpan = progressInfo.querySelector('span:first-child');
                        if (pageSpan) {
                            pageSpan.textContent = `Page ${lastPage} `;
                        }
                    }
                } catch (e) {
                    console.error(`Error parsing progress for book ${bookId}:`, e);
                }
            }
        }
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateAllProgressBars);

// Also call when page becomes visible (tab switch)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateAllProgressBars();
    }
});

// --- 14. CHAT WIDGET - TALK WITH US ---
document.addEventListener('DOMContentLoaded', () => {
    const talkBtn = document.querySelector('.talk-btn');
    
    if (talkBtn) {
        talkBtn.addEventListener('click', initializeChatWidget);
    }

    function initializeChatWidget() {
        // Remove existing chat if any
        const existingChat = document.getElementById('chat-widget-popup');
        if (existingChat) {
            existingChat.remove();
            return;
        }

        // Create chat widget HTML
        const chatHTML = `
            <div id="chat-widget-popup" style="
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 5px 40px rgba(0,0,0,0.16);
                border: 1px solid #e2e8f0;
                display: flex;
                flex-direction: column;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    padding: 15px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 1rem;">ReadQuest Support</h3>
                    <button onclick="document.getElementById('chat-widget-popup').remove()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.2rem;
                        cursor: pointer;
                        padding: 0;
                    ">&times;</button>
                </div>
                
                <div id="chat-messages" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                ">
                </div>
                
                <div style="
                    padding: 10px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 8px;
                ">
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="Type your message..." 
                        style="
                            flex: 1;
                            padding: 10px;
                            border: 1px solid #e2e8f0;
                            border-radius: 4px;
                            font-family: inherit;
                            font-size: 0.9rem;
                        "
                    />
                    <button onclick="sendChatMessage()" style="
                        background: #0d9488;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#0f766e'" onmouseout="this.style.background='#0d9488'">
                        Send
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Welcome message
        setTimeout(() => {
            displayChatMessage('support', 'Hello! 👋 Welcome to ReadQuest Support. How can I help you today?');
        }, 300);

        // Add enter key functionality
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });

        document.getElementById('chat-input').focus();
    }

    window.sendChatMessage = function() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Display user message
        displayChatMessage('user', message);
        input.value = '';

        // Generate response
        setTimeout(() => {
            const response = generateChatResponse(message);
            displayChatMessage('support', response);
        }, 500);
    };

    function displayChatMessage(sender, message) {
        const messagesDiv = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        
        if (sender === 'user') {
            messageElement.style.cssText = `
                background: #0d9488;
                color: white;
                padding: 10px 12px;
                border-radius: 8px;
                align-self: flex-end;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 0.9rem;
            `;
        } else {
            messageElement.style.cssText = `
                background: #f1f5f9;
                color: #334155;
                padding: 10px 12px;
                border-radius: 8px;
                align-self: flex-start;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 0.9rem;
            `;
        }

        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function generateChatResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        // Greetings
        if (msg.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
            return '👋 Hello! Welcome to ReadQuest. How can I assist you with your reading journey?';
        }

        // Finding books
        if (msg.match(/\b(can't find|cannot find|where is|how do i find|looking for)\b/)) {
            return '📚 No problem! You can browse all available books in our Library. Click on "Library" in the navigation menu, or use the search bar to find the book you\'re looking for. You can also filter by category!';
        }

        // Understanding books
        if (msg.match(/\b(can't understand|cannot understand|don't understand|confused|hard to understand|difficult)\b/)) {
            return '🤔 I understand! Our books have different difficulty levels. Try starting with books marked "Beginner" or "Intermediate". You can also check out the FAQ section for tips on improving your reading skills. Would you like me to recommend an easier book?';
        }

        // Connection issues
        if (msg.match(/\b(connection|error|broken|not working|problem|bug)\b/)) {
            return '⚠️ Sorry to hear you\'re experiencing issues! Please try refreshing the page or clearing your browser cache. If the problem persists, please contact us through the "Contact" page with details about the issue.';
        }

        // Progress/reading help
        if (msg.match(/\b(progress|stuck|skip|help understanding|explain)\b/)) {
            return '📖 You can track your reading progress with our progress bars. If you\'re stuck on a particular section, take the checkpoint quiz - it helps reinforce key concepts! For detailed help, visit our Help Center or FAQ.';
        }

        // Game/quiz help
        if (msg.match(/\b(quiz|game|bonus|checkpoint|questions)\b/)) {
            return '🎮 Our quizzes help you test your knowledge of each book! After reading a section, you\'ll encounter a checkpoint quiz. Correct answers help you progress. For bonus games, look for special challenges in select books like "The Hobbit"!';
        }

        // Account/profile
        if (msg.match(/\b(account|profile|login|sign up|password|reset)\b/)) {
            return '👤 Currently, ReadQuest uses browser storage to track your progress. Your reading history and progress are saved locally on your device. No account creation needed!';
        }

        // Recommendations
        if (msg.match(/\b(recommend|suggestion|what should|what book)\b/)) {
            return '⭐ Great question! Try browsing our Library by category. We have classic literature, Filipino literature, science fiction, romance, and more. What genre interests you most?';
        }

        // Help/support general
        if (msg.match(/\b(help|support|can you help|need assistance|assistance)\b/)) {
            return '✋ Of course! I\'m here to help. I can assist with:\n• Finding books\n• Understanding content\n• Quiz/game guidance\n• Technical issues\n\nWhat do you need help with?';
        }

        // Thank you
        if (msg.match(/\b(thank|thanks|appreciate|thx)\b/)) {
            return '😊 You\'re welcome! Happy reading! If you need anything else, feel free to ask.';
        }

        // Default response
        return 'Thanks for your message! 📝 I can help with:\n• Finding & recommending books\n• Understanding content\n• Quiz & game guidance\n• Account & progress questions\n\nWhat can I help you with?';
    }
});
