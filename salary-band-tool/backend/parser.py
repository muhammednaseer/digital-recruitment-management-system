import pandas as pd
import numpy as np
from rapidfuzz import process, fuzz
import re

REQUIRED_COLUMNS = {
    'role': ['role', 'job title', 'position'],
    'location': ['location', 'city', 'country', 'region'],
    'level': ['experience level', 'level', 'experience', 'seniority'],
    'min_salary': ['min salary', 'minimum salary', 'min'],
    'mid_salary': ['mid salary', 'middle salary', 'mid', 'median salary'],
    'max_salary': ['max salary', 'maximum salary', 'max'],
    'currency': ['currency', 'symbol']
}

def clean_salary(value):
    if pd.isna(value):
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    # Remove currency symbols, commas and other non-numeric characters except dot
    cleaned = re.sub(r'[^\d.]', '', str(value))
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def find_columns(df_columns):
    column_mapping = {}
    for key, aliases in REQUIRED_COLUMNS.items():
        best_match = None
        highest_score = 0
        for col in df_columns:
            # Check exact match first (case-insensitive)
            if col.lower() in aliases:
                best_match = col
                highest_score = 100
                break

            # Fuzzy match
            match = process.extractOne(col.lower(), aliases, scorer=fuzz.WRatio)
            if match and match[1] > highest_score:
                highest_score = match[1]
                best_match = col

        if highest_score >= 70: # Threshold for fuzzy matching
            column_mapping[key] = best_match
    return column_mapping

def parse_excel(file_path):
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        return None, f"Error reading Excel file: {str(e)}"

    mapping = find_columns(df.columns)

    missing = []
    for col in ['role', 'location', 'level', 'min_salary', 'mid_salary', 'max_salary']:
        if col not in mapping:
            missing.append(col)

    if missing:
        return None, f"Missing required columns: {', '.join(missing)}"

    # Create a cleaned dataframe
    cleaned_data = pd.DataFrame()
    cleaned_data['role'] = df[mapping['role']].astype(str)
    cleaned_data['location'] = df[mapping['location']].astype(str)
    cleaned_data['level'] = df[mapping['level']].astype(str)
    cleaned_data['min_salary'] = df[mapping['min_salary']].apply(clean_salary)
    cleaned_data['mid_salary'] = df[mapping['mid_salary']].apply(clean_salary)
    cleaned_data['max_salary'] = df[mapping['max_salary']].apply(clean_salary)

    if 'currency' in mapping:
        cleaned_data['currency'] = df[mapping['currency']].fillna('USD').astype(str)
    else:
        cleaned_data['currency'] = 'USD'

    return cleaned_data, None
