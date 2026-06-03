# Salary Band Automation Tool

A full-stack web application that automates salary band lookups and recommendations based on role, location, and experience level.

## Features
- **Excel Parsing**: Automatically reads and cleans salary data from `.xlsx` files.
- **Fuzzy Matching**: Uses `rapidfuzz` to find the best match even with slight typos or variations in role and location.
- **Visual Range Bar**: Displays the Min-Mid-Max salary range visually.
- **Excel Upload**: Update the salary data on the fly via the web interface.

## Setup Instructions

### Prerequisites
- Python 3.12+
- `pip`

### Installation
1. Navigate to the project root:
   ```bash
   cd salary-band-tool
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application
1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```
   The server will start on `http://localhost:5000`.

2. Open the frontend:
   Simply open `salary-band-tool/frontend/index.html` in your web browser.

## Excel File Format
The tool expects an `.xlsx` file with the following columns (fuzzy matching is supported for column names):
- **Role**: (e.g., Software Engineer, Product Manager)
- **Location**: (e.g., London, Dubai, Remote)
- **Experience Level**: (Junior, Mid, Senior, Lead, Principal)
- **Min Salary**: Numeric value
- **Mid Salary**: Numeric value
- **Max Salary**: Numeric value
- **Currency**: (Optional, defaults to USD)

## API Usage Example

### Lookup Salary Band
**Endpoint**: `POST /lookup`
**Body**:
```json
{
  "role": "Software Engineer",
  "location": "London",
  "level": "Mid"
}
```
**Response**:
```json
{
  "confidence": 100.0,
  "found": true,
  "match": {
    "currency": "GBP",
    "level": "Mid",
    "location": "London",
    "max_salary": 90000.0,
    "mid_salary": 75000.0,
    "min_salary": 60000.0,
    "role": "Software Engineer"
  }
}
```

## Folder Structure
```
salary-band-tool/
├── backend/
│   ├── app.py              # Main API
│   ├── matcher.py          # Fuzzy matching logic
│   ├── parser.py           # Excel parsing
│   └── data/
│       └── salary_bands.xlsx
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── requirements.txt
└── README.md
```
