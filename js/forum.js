document.addEventListener('DOMContentLoaded', function() {
    // Handle vote buttons
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const voteCount = this.parentElement.querySelector('.vote-count');
            const currentCount = parseInt(voteCount.textContent);
            
            // Check if upvote or downvote
            if (this.querySelector('.fa-chevron-up')) {
                voteCount.textContent = currentCount + 1;
                this.style.color = 'var(--primary-color)';
            } else {
                voteCount.textContent = currentCount - 1;
                this.style.color = 'var(--danger-color)';
            }
            
            // In a real application, this would send an AJAX request to the server
            console.log(`Vote recorded: ${this.querySelector('.fa-chevron-up') ? 'upvote' : 'downvote'}`);
            
            // Disable the button after voting (in a real app, this might be more sophisticated)
            this.disabled = true;
        });
    });
    
    // Handle forum search
    const searchForm = document.querySelector('.forum-search');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real application, this would redirect to search results
                console.log(`Searching for: ${searchTerm}`);
                
                // Simulate search
                document.querySelector('.forum-discussions').innerHTML = `
                    <div class="loading-indicator">
                        <div class="spinner"></div>
                        <p>Searching for "${searchTerm}"...</p>
                    </div>
                `;
                
                // Simulate search delay
                setTimeout(() => {
                    document.querySelector('.forum-discussions').innerHTML = `
                        <div class="search-results-header">
                            <h3>Search Results for "${searchTerm}"</h3>
                            <p>Found 3 discussions</p>
                        </div>
                        
                        <div class="discussion-item">
                            <div class="discussion-votes">
                                <button class="vote-btn"><i class="fas fa-chevron-up"></i></button>
                                <span class="vote-count">15</span>
                                <button class="vote-btn"><i class="fas fa-chevron-down"></i></button>
                            </div>
                            <div class="discussion-content">
                                <div class="discussion-meta">
                                    <span class="discussion-category">Data Science</span>
                                </div>
                                <h3 class="discussion-title"><a href="forum-post.html">How to optimize ${searchTerm} for large datasets?</a></h3>
                                <p class="discussion-excerpt">I'm working with a dataset of over 10GB and need to optimize my ${searchTerm} workflow. Has anyone had experience with this scale?</p>
                                <div class="discussion-info">
                                    <div class="discussion-author">
                                        <img src="images/avatars/user8.jpg" alt="User Avatar">
                                        <span>Posted by <a href="#">big_data_fan</a> 1 week ago</span>
                                    </div>
                                    <div class="discussion-stats">
                                        <span><i class="fas fa-comment"></i> 7 replies</span>
                                        <span><i class="fas fa-eye"></i> 142 views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- More simulated search results would go here -->
                    `;
                }, 1500);
            }
        });
    }
    
    // Handle category filters
    const categorySelect = document.querySelector('.forum-filters select:first-child');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            console.log(`Filtering by category: ${selectedCategory}`);
            
            // In a real application, this would filter the discussions
            // For demonstration, we'll just log the selected category
            if (selectedCategory !== 'All Categories') {
                alert(`Filtering discussions by ${selectedCategory} category`);
            }
        });
    }
    
    // Handle sort options
    const sortSelect = document.querySelector('.forum-filters select:last-child');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const selectedSort = this.value;
            console.log(`Sorting by: ${selectedSort}`);
            
            // In a real application, this would sort the discussions
            // For demonstration, we'll just log the selected sort option
            alert(`Sorting discussions by ${selectedSort}`);
        });
    }
    
    // Handle "New Discussion" button
    const newDiscussionBtn = document.querySelector('.forum-actions .btn-primary');
    if (newDiscussionBtn) {
        newDiscussionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would redirect to a new discussion form
            // For demonstration, we'll create a modal dialog
            showNewDiscussionModal();
        });
    }
});

function showNewDiscussionModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Add modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Start a New Discussion</h2>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <form id="newDiscussionForm">
                    <div class="form-group">
                        <label for="discussionTitle">Title</label>
                        <input type="text" id="discussionTitle" placeholder="Enter a descriptive title" required>
                    </div>
                    <div class="form-group">
                        <label for="discussionCategory">Category</label>
                        <select id="discussionCategory" required>
                            <option value="">Select a category</option>
                            <option value="data-science">Data Science</option>
                            <option value="web-development">Web Development</option>
                            <option value="automation">Automation</option>
                            <option value="devops">DevOps</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="discussionContent">Content</label>
                        <textarea id="discussionContent" rows="8" placeholder="Describe your question or topic in detail" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="discussionTags">Tags</label>
                        <input type="text" id="discussionTags" placeholder="Enter tags separated by commas">
                        <small>Example: python, pandas, data-visualization</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" id="cancelDiscussion">Cancel</button>
                <button class="btn btn-primary" i
