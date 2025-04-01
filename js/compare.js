document.addEventListener('DOMContentLoaded', function() {
    const compareTools = document.querySelectorAll('.compare-checkbox');
    const compareButton = document.getElementById('compareSelectedTools');
    const comparisonTable = document.getElementById('comparisonTable');
    
    // Track selected tools
    let selectedTools = [];
    
    // Add event listeners to checkboxes
    compareTools.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const toolId = this.dataset.toolId;
            const toolName = this.dataset.toolName;
            
            if (this.checked) {
                if (selectedTools.length < 3) {
                    selectedTools.push({
                        id: toolId,
                        name: toolName
                    });
                } else {
                    this.checked = false;
                    alert('You can compare up to 3 tools at once');
                }
            } else {
                selectedTools = selectedTools.filter(tool => tool.id !== toolId);
            }
            
            // Update compare button state
            if (selectedTools.length >= 2) {
                compareButton.disabled = false;
            } else {
                compareButton.disabled = true;
            }
        });
    });
    
    // Compare button functionality
    compareButton.addEventListener('click', function() {
        // Fetch tool data and build comparison table
        fetchToolData(selectedTools).then(data => {
            buildComparisonTable(data);
            comparisonTable.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Fetch tool data from API or static JSON
    async function fetchToolData(tools) {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        return new Promise(resolve => {
            setTimeout(() => {
                const mockData = {
                    tools: {
                        'pandas': {
                            name: 'Pandas',
                            version: '1.4.2',
                            category: 'Data Analysis',
                            features: ['Data frames', 'Time series', 'CSV/Excel support'],
                            performance: 4.2,
                            learning_curve: 3.5,
                            community: 4.8
                        },
                        'numpy': {
                            name: 'NumPy',
                            version: '1.22.3',
                            category: 'Scientific Computing',
                            features: ['N-dimensional arrays', 'Linear algebra', 'Random number generation'],
                            performance: 4.7,
                            learning_curve: 3.2,
                            community: 4.9
                        },
                        'matplotlib': {
                            name: 'Matplotlib',
                            version: '3.5.1',
                            category: 'Data Visualization',
                            features: ['Static plots', 'Interactive figures', 'Publication-quality output'],
                            performance: 4.0,
                            learning_curve: 3.8,
                            community: 4.5
                        }
                        // More tools...
                    }
                };
                
                const result = tools.map(tool => mockData.tools[tool.id]);
                resolve(result);
            }, 500);
        });
    }
    
    // Build comparison table from data
    function buildComparisonTable(toolsData) {
        let tableHTML = `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${toolsData.map(tool => `<th>${tool.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Version</td>
                        ${toolsData.map(tool => `<td>${tool.version}</td>`).join('')}
                    </tr>
                    <tr>
                        <td>Category</td>
                        ${toolsData.map(tool => `<td>${tool.category}</td>`).join('')}
                    </tr>
                    <tr>
                        <td>Key Features</td>
                        ${toolsData.map(tool => `
                            <td>
                                <ul>
                                    ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td>Performance</td>
                        ${toolsData.map(tool => `
                            <td>
                                <div class="rating-bar">
                                    <div class="rating-fill" style="width: ${tool.performance * 20}%"></div>
                                </div>
                                <span>${tool.performance}/5</span>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td>Learning Curve</td>
                        ${toolsData.map(tool => `
                            <td>
                                <div class="rating-bar">
                                    <div class="rating-fill" style="width: ${tool.learning_curve * 20}%"></div>
                                </div>
                                <span>${tool.learning_curve}/5</span>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td>Community Support</td>
                        ${toolsData.map(tool => `
                            <td>
                                <div class="rating-bar">
                                    <div class="rating-fill" style="width: ${tool.community * 20}%"></div>
                                </div>
                                <span>${tool.community}/5</span>
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
            </table>
            <div class="comparison-actions">
                <button class="btn btn-outline" id="resetComparison">Reset Comparison</button>
                <button class="btn btn-primary" id="downloadComparison">Download as PDF</button>
            </div>
        `;
        
        comparisonTable.innerHTML = tableHTML;
        comparisonTable.style.display = 'block';
        
        // Add event listener for reset button
        document.getElementById('resetComparison').addEventListener('click', function() {
            comparisonTable.style.display = 'none';
            selectedTools = [];
            compareTools.forEach(checkbox => {
                checkbox.checked = false;
            });
            compareButton.disabled = true;
        });
        
        // Add event listener for download button
        document.getElementById('downloadComparison').addEventListener('click', function() {
            alert('PDF download functionality would be implemented here');
            // In a real implementation, this would generate a PDF using a library like jsPDF
        });
    }
});
