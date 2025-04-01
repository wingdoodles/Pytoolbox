document.addEventListener('DOMContentLoaded', function() {
    // Initialize tool filters
    initToolFilters();
    
    // Handle tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        // Add click event to the whole card
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button or link inside the card
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const toolId = this.getAttribute('data-tool-id');
                if (toolId) {
                    window.location.href = `tool-details.html?id=${toolId}`;
                }
            }
        });
        
        // Handle favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                
                const toolId = card.getAttribute('data-tool-id');
                const isFavorite = this.classList.contains('active');
                
                if (isFavorite) {
                    this.classList.remove('active');
                    this.innerHTML = '<i class="far fa-heart"></i>';
                    showToast(`Removed ${card.querySelector('.tool-name').textContent} from favorites`);
                } else {
                    this.classList.add('active');
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                    showToast(`Added ${card.querySelector('.tool-name').textContent} to favorites`);
                }
                
                // In a real application, this would update the user's favorites on the server
                console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites: ${toolId}`);
            });
        }
    });
    
    // Handle tool search
    const searchForm = document.querySelector('.tools-search');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Filter tools based on search term
                filterTools(searchTerm);
            } else {
                // Reset filters if search is empty
                resetToolFilters();
            }
        });
    }
    
    // Handle tool comparison
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    if (compareCheckboxes.length > 0) {
        // Track selected tools
        let selectedTools = [];
        
        // Create compare button container if it doesn't exist
        let compareContainer = document.querySelector('.compare-container');
        if (!compareContainer) {
            compareContainer = document.createElement('div');
            compareContainer.className = 'compare-container';
            document.body.appendChild(compareContainer);
        }
        
        // Handle checkbox changes
        compareCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation(); // Prevent card click
                
                const toolId = this.closest('.tool-card').getAttribute('data-tool-id');
                const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
                
                if (this.checked) {
                    // Add to selected tools
                    if (selectedTools.length >= 4) {
                        // Limit to 4 tools for comparison
                        this.checked = false;
                        showToast('You can compare up to 4 tools at once', 'error');
                        return;
                    }
                    
                    selectedTools.push({ id: toolId, name: toolName });
                } else {
                    // Remove from selected tools
                    selectedTools = selectedTools.filter(tool => tool.id !== toolId);
                }
                
                // Update compare button
                updateCompareButton(selectedTools, compareContainer);
            });
        });
    }
    
    // Handle tool installation instructions
    const installButtons = document.querySelectorAll('.install-btn');
    installButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            
            const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
            const installCommand = this.getAttribute('data-install');
            
            if (installCommand) {
                showInstallModal(toolName, installCommand);
            }
        });
    });
});

function initToolFilters() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const sortOptions = document.querySelector('.sort-select');
    
    // Handle category filter clicks
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Toggle active state
                categoryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                filterToolsByCategory(category);
            });
        });
    }
    
    // Handle sort selection
    if (sortOptions) {
        sortOptions.addEventListener('change', function() {
            const sortBy = this.value;
            sortTools(sortBy);
        });
    }
}

function filterTools(searchTerm) {
    const toolCards = document.querySelectorAll('.tool-card');
    let matchCount = 0;
    
    searchTerm = searchTerm.toLowerCase();
    
    toolCards.forEach(card => {
        const toolName = card.querySelector('.tool-name').textContent.toLowerCase();
        const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
        const toolTags = card.getAttribute('data-tags')?.toLowerCase() || '';
        
        if (toolName.includes(searchTerm) || 
            toolDescription.includes(searchTerm) || 
            toolTags.includes(searchTerm)) {
            card.style.display = '';
            matchCount++;
            
            // Highlight matching text
            highlightMatches(card.querySelector('.tool-name'), searchTerm);
            highlightMatches(card.querySelector('.tool-description'), searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    updateResultsCount(matchCount);
    
    // Show no results message if needed
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        if (matchCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

function filterToolsByCategory(category) {
    const toolCards = document.querySelectorAll('.tool-card');
    let matchCount = 0;
    
    toolCards.forEach(card => {
        const toolCategory = card.getAttribute('data-category');
        
        if (category === 'all' || toolCategory === category) {
            card.style.display = '';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    updateResultsCount(matchCount);
}

function sortTools(sortBy) {
    const toolsContainer = document.querySelector('.tools-grid');
    const toolCards = Array.from(document.querySelectorAll('.tool-card'));
    
    // Sort the tools based on the selected option
    toolCards.sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.querySelector('.tool-name').textContent.localeCompare(
                    b.querySelector('.tool-name').textContent
                );
            case 'name-desc':
                return b.querySelector('.tool-name').textContent.localeCompare(
                    a.querySelector('.tool-name').textContent
                );
            case 'popularity':
                return parseFloat(b.getAttribute('data-popularity') || 0) - 
                       parseFloat(a.getAttribute('data-popularity') || 0);
            case 'newest':
                return new Date(b.getAttribute('data-date') || 0) - 
                       new Date(a.getAttribute('data-date') || 0);
            default:
                return 0;
        }
    });
    
    // Reappend the sorted cards
    toolCards.forEach(card => {
        toolsContainer.appendChild(card);
    });
    
    // Show animation effect
    toolCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function resetToolFilters() {
    // Reset search input
    const searchInput = document.querySelector('.tools-search input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.classList.remove('active');
        if (filter.getAttribute('data-category') === 'all') {
            filter.classList.add('active');
        }
    });
    
    // Show all tools
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.style.display = '';
        
        // Reset highlighted text
        const toolName = card.querySelector('.tool-name');
        const toolDescription = card.querySelector('.tool-description');
        
        toolName.innerHTML = toolName.textContent;
        toolDescription.innerHTML = toolDescription.textContent;
    });
    
    // Update results count
    updateResultsCount(toolCards.length);
    
    // Hide no results message
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = 'none';
    }
}

function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} tool${count !== 1 ? 's' : ''} found`;
    }
}

function highlightMatches(element, searchTerm) {
    if (!element) return;
    
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark>$1</mark>');
}

function updateCompareButton(selectedTools, container) {
    if (selectedTools.length >= 2) {
        // Show compare button
        container.innerHTML = `
            <div class="compare-button-wrapper">
                <span>${selectedTools.length} tools selected</span>
                <button class="btn btn-primary compare-btn">
                    <i class="fas fa-exchange-alt"></i> Compare Tools
                </button>
            </div>
        `;
        
        container.classList.add('show');
        
        // Handle compare button click
        const compareBtn = container.querySelector('.compare-btn');
        compareBtn.addEventListener('click', function() {
            // In a real application, this would redirect to a comparison page
            const toolIds = selectedTools.map(tool => tool.id).join(',');
            window.location.href = `compare-tools.html?tools=${toolIds}`;
        });
    } else {
        // Hide compare button
        container.classList.remove('show');
    }
}

function showInstallModal(toolName, installCommand) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Add modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Install ${toolName}</h2>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>Run the following command in your terminal:</p>
                <div class="code-block">
                    <pre><code>${installCommand}</code></pre>
                    <button class="copy-btn" data-clipboard-text="${installCommand}">
                        <i class="far fa-copy"></i> Copy
                    </button>
                </div>
                <div class="install-options">
                    <h4>Additional Options</h4>
                    <ul>
                        <li>
                            <strong>Install in a virtual environment:</strong>
                            <div class="code-block">
                                <pre><code>python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\\Scripts\\activate
${installCommand}</code></pre>
                                <button class="copy-btn" data-clipboard-text="python -m venv myenv\nsource myenv/bin/activate  # On Windows: myenv\\Scripts\\activate\n${installCommand}">
                                    <i class="far fa-copy"></i> Copy
                                </button>
                            </div>
                        </li>
                        <li>
                            <strong>Install a specific version:</strong>
                            <div class="code-block">
                                <pre><code>${installCommand.replace(/^pip install/, 'pip install')}==X.Y.Z</code></pre>
                                <button class="copy-btn" data-clipboard-text="${installCommand.replace(/^pip install/, 'pip install')}==X.Y.Z">
                                    <i class="far fa-copy"></i> Copy
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <a href="https://pypi.org/project/${toolName.toLowerCase()}" target="_blank" class="btn btn-outline">
                    <i class="fas fa-external-link-alt"></i> View on PyPI
                </a>
                <button class="btn btn-primary" id="closeModal">Got it</button>
            </div>
        </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Show the modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Handle close button
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Handle "Got it" button
    const gotItBtn = modal.querySelector('#closeModal');
    gotItBtn.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Handle copy buttons
    const copyButtons = modal.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-clipboard-text');
            copyToClipboard(textToCopy);
            
            // Show copied feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.classList.add('copied');
            
            // Reset after a delay
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('copied');
            }, 2000);
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textarea);
}

function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Handle close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        removeToast(toast);
    });
    
    // Auto-remove after delay
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}
