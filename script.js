async function fetchServices() {
    try {
        const response = await fetch('getServices.php');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const textData = await response.text();
        try {
            return JSON.parse(textData);
        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            return [];
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

async function initialize() {
    services = await fetchServices();
    filteredServices = [...services];
    renderTable(1);
}

function renderTable(page = 1) {
    const rowsPerPage = 5;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedServices = filteredServices.slice(start, end);

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    paginatedServices.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1 + start}</td>
            <td>${service.seksi}</td>
            <td>${service.nama}</td>
            <td><button class="action-btn" onclick="showDetails('${service.id}')">Persyaratan</button></td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredServices.length / 5);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.innerText = i;
        btn.onclick = () => renderTable(i);
        pagination.appendChild(btn);
    }
}

function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    filteredServices = services.filter(service => 
        service.seksi.toLowerCase().includes(searchInput) || 
        service.nama.toLowerCase().includes(searchInput)
    );
    renderTable(1);
}

function showDetails(id) {
    const service = services.find(s => s.id === id);
    if (!service) {
        console.error('Service not found for ID:', id);
        return;
    }

    const modalBody = document.getElementById('modal-body');
    const hardcopyClass = service.hardcopy === "Wajib Diserahkan" ? 'hardcopy-green' : 'hardcopy-red';
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h4>${service.nama}</h4>
            <button class="close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-detail-item">
                <strong>Seksi:</strong>
                <span class="detail-value">${service.seksi}</span>
            </div>
            <div class="modal-detail-item">
                <strong>Janji Layanan:</strong>
                <span class="detail-value">${service.janlay}</span>
            </div>
            <div class="modal-detail-item">
                <strong>Hardcopy:</strong>
                <span class="${hardcopyClass}">${service.hardcopy}</span>
            </div>
        </div>
        <h5>Persyaratan</h5>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Uraian</th>
                </tr>
            </thead>
            <tbody>
                ${JSON.parse(service.persyaratan).map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    const modal = document.getElementById('detailModal');
    modal.style.display = 'flex';
    modal.querySelector('.close-btn').onclick = () => {
        modal.style.display = 'none';
    };
}

initialize();
