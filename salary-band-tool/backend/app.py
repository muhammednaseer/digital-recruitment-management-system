import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from parser import parse_excel
from matcher import find_best_match
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

DATA_FOLDER = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_FOLDER, exist_ok=True)
FILE_PATH = os.path.join(DATA_FOLDER, 'salary_bands.xlsx')

# Global variable to store the loaded data
salary_data = None

def load_data():
    global salary_data
    if os.path.exists(FILE_PATH):
        df, error = parse_excel(FILE_PATH)
        if df is not None:
            salary_data = df
            print(f"Loaded {len(salary_data)} rows from {FILE_PATH}")
            return True, None
        return False, error
    return False, "No salary bands file found."

# Initial load
load_data()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not file.filename.endswith('.xlsx'):
        return jsonify({'error': 'Invalid file format. Please upload an .xlsx file.'}), 400

    filename = secure_filename('salary_bands.xlsx')
    save_path = os.path.join(DATA_FOLDER, filename)
    file.save(save_path)

    success, error = load_data()
    if success:
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': file.filename,
            'row_count': len(salary_data)
        })
    else:
        return jsonify({'error': f'Failed to parse uploaded file: {error}'}), 400

@app.route('/roles', methods=['GET'])
def get_roles():
    if salary_data is None:
        return jsonify([])
    roles = sorted(salary_data['role'].unique().tolist())
    return jsonify(roles)

@app.route('/locations', methods=['GET'])
def get_locations():
    if salary_data is None:
        return jsonify([])
    locations = sorted(salary_data['location'].unique().tolist())
    return jsonify(locations)

@app.route('/levels', methods=['GET'])
def get_levels():
    if salary_data is None:
        return jsonify([])
    levels = sorted(salary_data['level'].unique().tolist())
    return jsonify(levels)

@app.route('/lookup', methods=['POST'])
def lookup():
    if salary_data is None:
        return jsonify({'error': 'No salary data available. Please upload an Excel file.'}), 400

    data = request.json
    role = data.get('role', '')
    location = data.get('location', '')
    level = data.get('level', '')

    if not role or not location or not level:
        return jsonify({'error': 'Missing role, location, or level'}), 400

    match, confidence = find_best_match(salary_data, role, location, level)

    if match:
        return jsonify({
            'found': True,
            'match': match,
            'confidence': confidence
        })
    else:
        return jsonify({
            'found': False,
            'message': 'No data found for this combination'
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
