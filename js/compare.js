document.addEventListener('DOMContentLoaded', function() {
    // Initialize comparison functionality
    initComparison();
    
    // Handle add tool button
    const addToolBtn = document.getElementById('addToolBtn');
    if (addToolBtn) {
        addToolBtn.addEventListener('click', function() {
            openAddToolModal();
        });
    }
    
    // Handle print comparison button
    const printBtn = document.getElementById('printComparisonBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Handle export comparison button
    const exportBtn = document.getElementById('exportComparisonBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportAsPDF();
        });
    }
    
    // Handle install buttons
    const installButtons = document.querySelectorAll('.install-btn');
    installButtons.forEach(button => {
        button.addEventListener('click', function() {
            const installCommand = this.getAttribute('data-install');
            if (installCommand) {
                // Get tool name from the closest comparison-tool
                const toolHeader = this.closest('.comparison-value').parentNode.querySelector('.tool-header');
                const toolName = toolHeader ? toolHeader.querySelector('h3').textContent : 'Tool';
                
                showInstallModal(toolName, installCommand);
            }
        });
    });
    
    // Handle URL parameters to load specific tools for comparison
    loadToolsFromURL();
});

function initComparison() {
    // Handle remove tool buttons
    const removeButtons = document.querySelectorAll('.remove-tool-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool-id');
            if (toolId) {
                removeTool(toolId);
            }
        });
    });
    
    // Handle category filter
    const categorySelect = document.getElementById('compareCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const category = this.value;
            filterComparisonByCategory(category);
        });
    }
}

function openAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        // Show modal
        modal.classList.add('show');
        
        // Focus search input
        const searchInput = document.getElementById('toolSearchInput');
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
        
        // Handle close button
        const closeBtn = document.getElementById('closeAddToolModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeAddToolModal();
            });
        }
        
        // Handle cancel button
        const cancelBtn = document.getElementById('cancelAddTool');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                closeAddToolModal();
            });
        }
        
        // Handle tool selection
        const toolItems = document.querySelectorAll('.tool-selection-item');
        toolItems.forEach(item => {
            item.addEventListener('click', function() {
                // Toggle selection
                toolItems.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                
                // Enable confirm button
                const confirmBtn = document.getElementById('confirmAddTool');
                if (confirmBtn) {
                    confirmBtn.removeAttribute('disabled');
                }
            });
        });
        
        // Handle confirm button
        const confirmBtn = document.getElementById('confirmAddTool');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const selectedTool = document.querySelector('.tool-selection-item.selected');
                if (selectedTool) {
                    const toolId = selectedTool.getAttribute('data-tool-id');
                    addToolToComparison(toolId);
                    closeAddToolModal();
                }
            });
        }
        
        // Handle search input - using the same searchInput variable from above
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                filterToolSelection(searchTerm);
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAddToolModal();
            }
        });
    }
}

function closeAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset selection
        const toolItems = document.querySelectorAll('.tool-selection-item');
        toolItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        // Reset search
        const searchInput = document.getElementById('toolSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Show all tools
        filterToolSelection('');
        
        // Disable confirm button
        const confirmBtn = document.getElementById('confirmAddTool');
        if (confirmBtn) {
            confirmBtn.setAttribute('disabled', 'disabled');
        }
    }
}

function filterToolSelection(searchTerm) {
    const toolItems = document.querySelectorAll('.tool-selection-item');
    
    toolItems.forEach(item => {
        const toolName = item.querySelector('h4').textContent.toLowerCase();
        const toolCategory = item.querySelector('.tool-category').textContent.toLowerCase();
        
        if (toolName.includes(searchTerm) || toolCategory.includes(searchTerm) || searchTerm === '') {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function addToolToComparison(toolId) {
    // In a real application, this would fetch tool data from the server
    // For this demo, we'll use a simple object with predefined tools
    const toolData = {
        'scikit-learn': {
            name: 'Scikit-learn',
            image: 'images/tools/scikit-learn.png',
            version: 'v1.0.2',
            description: 'Simple and efficient tools for predictive data analysis and machine learning.',
            primaryUse: 'Machine learning and data mining',
            stars: '49.3k',
            downloads: '28M / month',
            dataStructures: 'Estimators, Transformers, Predictors',
            dataImport: 'CSV, NumPy arrays',
            dataCleaning: 'Limited',
            statistical: 'Comprehensive',
            visualization: 'Limited',
            memoryEfficiency: '4/5',
            computationSpeed: '4/5',
            largeDatasets: '3.5/5',
            parallelProcessing: 'Good',
            documentation: '5/5',
            communitySupport: '4.5/5',
            integration: '4.5/5',
            beginnerFriendliness: '4/5',
            learningResources: '5/5',
            apiConsistency: '4.5/5',
            bestFor: 'Building machine learning models with a consistent API',
            overallRating: '4.5/5',
            installCommand: 'pip install scikit-learn',
            docsUrl: 'https://scikit-learn.org/stable/documentation.html'
        },
        'tensorflow': {
            name: 'TensorFlow',
            image: 'images/tools/tensorflow.png',
            version: 'v2.9.1',
            description: 'An end-to-end open source platform for machine learning.',
            primaryUse: 'Deep learning and neural networks',
            stars: '166k',
            downloads: '22M / month',
            dataStructures: 'Tensors, Variables, Graphs',
            dataImport: 'CSV, TFRecord, Images',
            dataCleaning: 'Limited',
            statistical: 'Good',
            visualization: 'TensorBoard',
            memoryEfficiency: '3.5/5',
            computationSpeed: '4.5/5',
            largeDatasets: '4.5/5',
            parallelProcessing: 'Excellent',
            documentation: '4.5/5',
            communitySupport: '5/5',
            integration: '4.5/5',
            beginnerFriendliness: '3/5',
            learningResources: '5/5',
            apiConsistency: '3.5/5',
            bestFor: 'Building and deploying deep learning models at scale',
            overallRating: '4.5/5',
            installCommand: 'pip install tensorflow',
            docsUrl: 'https://www.tensorflow.org/api_docs'
        },
        // Add more tools as needed
    };
    
    // Check if tool exists in our data
    if (toolData[toolId]) {
        const tool = toolData[toolId];
        
        // Check if we already have 4 tools in comparison
        const existingTools = document.querySelectorAll('.comparison-tool');
        if (existingTools.length >= 4) {
            alert('You can compare up to 4 tools at once. Please remove a tool before adding a new one.');
            return;
        }
        
        // Check if tool is already in comparison
        const existingTool = document.querySelector(`.remove-tool-btn[data-tool-id="${toolId}"]`);
        if (existingTool) {
            alert(`${tool.name} is already in the comparison.`);
            return;
        }
        
        // Create new tool column
        const toolColumn = document.createElement('div');
        toolColumn.className = 'comparison-tool';
        toolColumn.innerHTML = `
            <div class="tool-header">
                <img src="${tool.image}" alt="${tool.name}">
                <h3>${tool.name}</h3>
                <span class="tool-version">${tool.version}</span>
                <button class="remove-tool-btn" data-tool-id="${toolId}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add tool column to header
        const toolColumns = document.querySelector('.comparison-tool-columns');
        if (toolColumns) {
            toolColumns.appendChild(toolColumn);
        }
        
        // Add tool data to each row
        // This would be more dynamic in a real application
        // For this demo, we'll just show a success message
        showToast(`${tool.name} added to comparison.`, 'success');
        
        // Update URL to include this tool
        updateURL();
        
        // Reinitialize comparison functionality
        initComparison();
    } else {
        showToast(`Tool data not found for ${toolId}.`, 'error');
    }
}

function removeTool(toolId) {
    // Find all elements related to this tool
    const toolElements = document.querySelectorAll(`.comparison-tool:has(.remove-tool-btn[data-tool-id="${toolId}"])`);
    
    toolElements.forEach(element => {
        // Remove the tool column
        element.remove();
    });
    
    // Update URL to reflect changes
    updateURL();
    
    // Show confirmation
    showToast(`Tool removed from comparison.`, 'success');
}

function filterComparisonByCategory(category) {
    // In a real application, this would filter the comparison table
    // based on the selected category
    if (category === 'all') {
        showToast('Showing all categories.', 'info');
    } else {
        showToast(`Filtering by ${category} category.`, 'info');
    }
}

function exportAsPDF() {
    // In a real application, this would generate a PDF
    // For this demo, we'll just show a message
    showToast('Exporting comparison as PDF...', 'info');
    
    // Simulate PDF generation
    setTimeout(() => {
        showToast('Comparison exported as PDF.', 'success');
    }, 2000);
}

function updateURL() {
    // Get all tools in the comparison
    const toolButtons = document.querySelectorAll('.remove-tool-btn');
    const toolIds = Array.from(toolButtons).map(button => button.getAttribute('data-tool-id'));
    
    // Update URL with tool IDs
    const url = new URL(window.location.href);
    url.searchParams.delete('tools');
    
    if (toolIds.length > 0) {
        url.searchParams.set('tools', toolIds.join(','));
    }
    
    // Update browser history without reloading
    window.history.replaceState({}, '', url.toString());
}

function loadToolsFromURL() {
    // Get tools from URL
    const url = new URL(window.location.href);
    const toolsParam = url.searchParams.get('tools');
    
    if (toolsParam) {
        const toolIds = toolsParam.split(',');
        
        // Add each tool to comparison
        toolIds.forEach(toolId => {
            // In a real application, you would load the tool data
            // For this demo, we'll just show a message
            console.log(`Loading tool: ${toolId}`);
        });
    }
}

function showInstallModal(toolName, installCommand) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Install ${toolName}</h2>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>Run the following command to install ${toolName}:</p>
                <div class="code-block">
                    <pre><code>${installCommand}</code></pre>
                    <button class="copy-btn" data-clipboard-text="${installCommand}">
                        <i class="far fa-copy"></i> Copy
                    </button>
                </div>
                <div class="install-options">
                    <h3>Installation Options</h3>
                    <ul>
                        <li>
                            <strong>Using a virtual environment (recommended):</strong>
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
                <button class="btn btn-primary close-modal-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal to document
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Handle close button
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    // Handle close button in footer
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    // Handle copy buttons
    const copyButtons = modal.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-clipboard-text');
            copyToClipboard(textToCopy);
            
            // Show copied feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
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
    // Hide modal
    modal.classList.remove('show');
    
    // Remove modal after animation
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function copyToClipboard(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select and copy text
    textarea.select();
    document.execCommand('copy');
    
    // Remove temporary textarea
    document.body.removeChild(textarea);
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add toast to document
    const toastContainer = document.querySelector('.toast-container');
    if (toastContainer) {
        toastContainer.appendChild(toast);
    } else {
        // Create toast container if it doesn't exist
        const newToastContainer = document.createElement('div');
        newToastContainer.className = 'toast-container';
        newToastContainer.appendChild(toast);
        document.body.appendChild(newToastContainer);
    }
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Handle close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeToast(toast);
        });
    }
    
    // Auto-close toast after 5 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}

function closeToast(toast) {
    // Hide toast
    toast.classList.remove('show');
    
    // Remove toast after animation
    setTimeout(() => {
        const toastContainer = toast.parentNode;
        toastContainer.removeChild(toast);
        
        // Remove container if empty
        if (toastContainer.children.length === 0) {
            document.body.removeChild(toastContainer);
        }
    }, 300);
}
