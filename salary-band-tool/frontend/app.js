const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
const excelFileInput = document.getElementById('excelFile');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const fileInfo = document.getElementById('fileInfo');
const fileNameSpan = document.getElementById('fileName');
const rowCountSpan = document.getElementById('rowCount');

const roleInput = document.getElementById('roleInput');
const locationInput = document.getElementById('locationInput');
const levelInput = document.getElementById('levelInput');
const lookupBtn = document.getElementById('lookupBtn');

const roleOptions = document.getElementById('roleOptions');
const locationOptions = document.getElementById('locationOptions');

const resultSection = document.getElementById('resultSection');
const lookupError = document.getElementById('lookupError');
const matchBadge = document.getElementById('matchBadge');

const minSalarySpan = document.getElementById('minSalary');
const midSalarySpan = document.getElementById('midSalary');
const maxSalarySpan = document.getElementById('maxSalary');
const currencyLabel = document.getElementById('currencyLabel');

const barMin = document.getElementById('barMin');
const barMid = document.getElementById('barMid');
const barMax = document.getElementById('barMax');

const matchedRole = document.getElementById('matchedRole');
const matchedLocation = document.getElementById('matchedLocation');
const matchedLevel = document.getElementById('matchedLevel');

// Initialize
async function init() {
    await fetchMetadata();
}

async function fetchMetadata() {
    try {
        const [roles, locations] = await Promise.all([
            fetch(`${API_BASE_URL}/roles`).then(r => r.json()),
            fetch(`${API_BASE_URL}/locations`).then(r => r.json())
        ]);

        roleOptions.innerHTML = roles.map(r => `<option value="${r}">`).join('');
        locationOptions.innerHTML = locations.map(l => `<option value="${l}">`).join('');
    } catch (err) {
        console.error('Error fetching metadata:', err);
    }
}

// Upload File
uploadBtn.addEventListener('click', async () => {
    const file = excelFileInput.files[0];
    if (!file) {
        uploadStatus.innerText = 'Please select a file first.';
        uploadStatus.className = 'error-message';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        uploadStatus.innerText = 'Uploading...';
        uploadStatus.className = '';

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            uploadStatus.innerText = 'Upload successful!';
            uploadStatus.className = '';
            fileInfo.classList.remove('hidden');
            fileNameSpan.innerText = result.filename;
            rowCountSpan.innerText = result.row_count;

            await fetchMetadata();
        } else {
            uploadStatus.innerText = result.error || 'Upload failed.';
            uploadStatus.className = 'error-message';
        }
    } catch (err) {
        uploadStatus.innerText = 'An error occurred during upload.';
        uploadStatus.className = 'error-message';
        console.error(err);
    }
});

// Lookup Salary
lookupBtn.addEventListener('click', async () => {
    const role = roleInput.value;
    const location = locationInput.value;
    const level = levelInput.value;

    if (!role || !location || !level) {
        showLookupError('Please fill in all fields.');
        return;
    }

    try {
        lookupError.classList.add('hidden');
        resultSection.classList.add('hidden');

        const response = await fetch(`${API_BASE_URL}/lookup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, location, level })
        });

        const result = await response.json();

        if (response.ok) {
            if (result.found) {
                displayResult(result);
            } else {
                showLookupError(result.message);
            }
        } else {
            showLookupError(result.error || 'Lookup failed.');
        }
    } catch (err) {
        showLookupError('An error occurred while fetching salary data.');
        console.error(err);
    }
});

function showLookupError(msg) {
    lookupError.innerText = msg;
    lookupError.classList.remove('hidden');
    resultSection.classList.add('hidden');
}

function formatCurrency(val, curr) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr,
        maximumFractionDigits: 0
    }).format(val);
}

function displayResult(data) {
    const { match, confidence } = data;
    const curr = match.currency || 'USD';

    resultSection.classList.remove('hidden');

    // Confidence Badge
    if (confidence === 100) {
        matchBadge.innerText = 'Exact Match';
        matchBadge.className = 'badge badge-exact';
    } else {
        matchBadge.innerText = `${Math.round(confidence)}% Match`;
        matchBadge.className = 'badge badge-fuzzy';
    }

    // Salary Boxes
    minSalarySpan.innerText = formatCurrency(match.min_salary, curr);
    midSalarySpan.innerText = formatCurrency(match.mid_salary, curr);
    maxSalarySpan.innerText = formatCurrency(match.max_salary, curr);
    currencyLabel.innerText = curr;

    // Range Bar
    barMin.innerText = formatCurrency(match.min_salary, curr);
    barMid.innerText = formatCurrency(match.mid_salary, curr);
    barMax.innerText = formatCurrency(match.max_salary, curr);

    const range = match.max_salary - match.min_salary;
    const midPos = range > 0 ? ((match.mid_salary - match.min_salary) / range) * 100 : 50;
    document.querySelector('.range-point.mid').style.left = `${midPos}%`;

    // Matched Details
    matchedRole.innerText = match.role;
    matchedLocation.innerText = match.location;
    matchedLevel.innerText = match.level;
}

init();
