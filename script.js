async function fetchServices() {
    try {
        const response = await fetch('getServices.php');
        if (!response.ok) throw new Error('Network response was not ok');

        const textData = await response.text();
        console.log('Raw response:', textData); // Log response dari server
        try {
            const parsedData = JSON.parse(textData);
            console.log('Parsed data:', parsedData); // Log data yang sudah di-parse
            return parsedData;
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
    const rowsPerPage = 10;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedServices = filteredServices.slice(start, end);

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    paginatedServices.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1 + start}</td>
            <td>${service.teams_nama}</td>  <!-- teams_nama digunakan untuk seksi -->
            <td>${service.layanan_nama}</td> <!-- layanan_nama digunakan untuk nama layanan -->
            <td><button class="action-btn" onclick="showDetails('${service.layanan_id}')">Persyaratan</button></td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredServices.length / 10);
    let currentPage = 1;

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.innerText = i;
        btn.onclick = () => {
            currentPage = i;
            renderTable(currentPage);
            updatePaginationButtons();
        };
        pagination.appendChild(btn);
    }

    function updatePaginationButtons() {
        const buttons = pagination.getElementsByClassName('pagination-btn');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
            if (buttons[i].innerText == currentPage) {
                buttons[i].classList.add('active');
            }
        }
        prevBtn.disabled = (currentPage === 1);
        nextBtn.disabled = (currentPage === totalPages);
    }
}

function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    filteredServices = services.filter(service =>
        service.teams_nama.toLowerCase().includes(searchInput) ||
        service.layanan_nama.toLowerCase().includes(searchInput)
    );
    renderTable(1);
}

function showDetails(id) {
    const service = services.find(s => s.layanan_id === String(id)); // Cast id to string
    if (!service) {
        console.error('Service not found for ID:', id);
        return;
    }

    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h4>${service.layanan_nama}</h4>  <!-- layanan_nama -->
            <button class="close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-detail-item">
                <strong>Format Surat:</strong>
                <span class="detail-value">${service.layanan_format}</span>
            </div>
            <div class="modal-detail-item">
                <strong>Janji Layanan:</strong>
                <span class="detail-value">${service.layanan_janji}</span>
            </div>
            <div class="modal-detail-item">
    <strong>Hardcopy:</strong>
    
        ${service.layanan_hardcopy === '1'
            ? '<span class="hardcopy-green">Wajib Diajukan</span>'
            : service.layanan_hardcopy === '2'
                ? '<span class="hardcopy-red">Tidak Wajib Diajukan</span>'
                : service.layanan_hardcopy
        }
   
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
                    ${service.ceklist_uraian.map((item, index) => `  <!-- ceklist_uraian -->
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    const modal = document.getElementById('detailModal');
    modal.style.display = 'flex';

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

initialize();
