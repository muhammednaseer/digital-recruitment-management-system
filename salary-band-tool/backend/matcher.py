from rapidfuzz import process, fuzz
import pandas as pd

def find_best_match(df, role, location, level):
    """
    Finds the best matching row in the dataframe based on role, location, and level.
    Returns (match_row, confidence)
    """
    # 1. Try exact match first
    exact_match = df[
        (df['role'].str.lower() == role.lower()) &
        (df['location'].str.lower() == location.lower()) &
        (df['level'].str.lower() == level.lower())
    ]

    if not exact_match.empty:
        return exact_match.iloc[0].to_dict(), 100.0

    # 2. Try exact match for level and fuzzy for others
    # Experience level usually has a fixed set of values, so we should be more strict
    level_matches = df[df['level'].str.lower() == level.lower()]

    if level_matches.empty:
        # If level doesn't match exactly, try fuzzy level match
        levels = df['level'].unique()
        best_level_match = process.extractOne(level, levels, scorer=fuzz.WRatio)
        if best_level_match and best_level_match[1] >= 80:
            level_matches = df[df['level'] == best_level_match[0]]
        else:
            # If still no level match, we can't reliably find a band
            return None, 0.0

    # Create a combined string for matching
    level_matches = level_matches.copy()
    level_matches['combined'] = level_matches['role'] + " " + level_matches['location']
    query = f"{role} {location}"

    choices = level_matches['combined'].tolist()
    best_match = process.extractOne(query, choices, scorer=fuzz.WRatio)

    if best_match and best_match[1] >= 60:
        match_idx = choices.index(best_match[0])
        result_row = level_matches.iloc[match_idx].to_dict()
        del result_row['combined']
        return result_row, best_match[1]

    return None, 0.0
