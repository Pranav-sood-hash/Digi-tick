import re
from typing import Tuple, Optional, Dict, List

CATEGORY_KEYWORDS = {
    "Produce": [
        "apple", "banana", "orange", "lemon", "lime", "potato", "onion", "tomato",
        "lettuce", "spinach", "carrot", "broccoli", "cucumber", "pepper", "garlic",
        "ginger", "avocado", "berry", "strawberry", "blueberry", "grape", "mango",
        "watermelon", "cabbage", "cauliflower", "mushroom", "cilantro", "mint", "fruit", "vegetable"
    ],
    "Dairy & Eggs": [
        "milk", "cheese", "butter", "egg", "eggs", "yogurt", "curd", "paneer",
        "cream", "sour cream", "cheddar", "mozzarella", "parmesan", "tofu"
    ],
    "Bakery": [
        "bread", "bagel", "bun", "buns", "croissant", "toast", "pita", "tortilla",
        "muffin", "cake", "cookie", "cookies", "pastry", "baguette", "roll", "rolls"
    ],
    "Pantry & Staples": [
        "rice", "flour", "pasta", "spaghetti", "noodle", "noodles", "sugar", "salt",
        "olive oil", "vegetable oil", "oil", "spice", "spices", "pulse", "pulses",
        "lentil", "lentils", "dal", "bean", "beans", "cereal", "oats", "sauce",
        "ketchup", "mayonnaise", "vinegar", "honey", "peanut butter", "jam"
    ],
    "Beverages": [
        "coffee", "tea", "green tea", "juice", "orange juice", "apple juice", "soda",
        "cola", "water", "sparkling water", "beer", "wine", "energy drink", "lemonade"
    ],
    "Meat & Seafood": [
        "chicken", "beef", "pork", "fish", "salmon", "tuna", "prawn", "prawns",
        "shrimp", "bacon", "sausage", "sausages", "turkey", "lamb", "mutton", "steak"
    ],
    "Snacks": [
        "chips", "popcorn", "chocolate", "candy", "cracker", "crackers", "pretzel",
        "nachos", "nuts", "almonds", "cashews", "granola bar"
    ],
    "Personal Care": [
        "shampoo", "conditioner", "soap", "body wash", "toothpaste", "toothbrush",
        "mouthwash", "lotion", "moisturizer", "deodorant", "perfume", "razor",
        "shaving cream", "face wash", "sanitizer", "floss"
    ],
    "Household": [
        "detergent", "laundry", "dish soap", "sponge", "paper towel", "paper towels",
        "toilet paper", "trash bag", "trash bags", "foil", "aluminum foil", "cleaner",
        "bleach", "wipe", "wipes", "battery", "batteries", "lightbulb"
    ],
}

UNIT_PATTERNS = [
    (r"\b(kg|kgs|kilogram|kilograms)\b", "kg"),
    (r"\b(g|gms|gram|grams)\b", "g"),
    (r"\b(lb|lbs|pound|pounds)\b", "lb"),
    (r"\b(oz|ounces)\b", "oz"),
    (r"\b(l|liter|liters|litre|litres)\b", "liter"),
    (r"\b(ml|milliliter|milliliters)\b", "ml"),
    (r"\b(packet|packets|pkt|pkts)\b", "packet"),
    (r"\b(bottle|bottles|btl)\b", "bottle"),
    (r"\b(box|boxes)\b", "box"),
    (r"\b(can|cans)\b", "can"),
    (r"\b(bag|bags)\b", "bag"),
    (r"\b(loaf|loaves)\b", "loaf"),
    (r"\b(dozen|dozens)\b", "dozen"),
    (r"\b(piece|pieces|pc|pcs)\b", "pieces"),
    (r"\b(pack|packs)\b", "pack"),
    (r"\b(bunch|bunches)\b", "bunch"),
]

def detect_category(item_name: str) -> str:
    """Guess the category of an item based on its name."""
    clean_name = item_name.lower().strip()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if re.search(rf"\b{re.escape(kw)}\b", clean_name):
                return category
    return "Other"

def parse_item_text(raw_text: str) -> Dict:
    """
    Parses a single line or entry into {name, quantity, unit, category}.
    Examples:
    '2 kg Apple' -> name: 'Apple', quantity: 2.0, unit: 'kg', category: 'Produce'
    'Milk 2 packets' -> name: 'Milk', quantity: 2.0, unit: 'packet', category: 'Dairy & Eggs'
    '5 Eggs' -> name: 'Eggs', quantity: 5.0, unit: 'pieces', category: 'Dairy & Eggs'
    '1 loaf Bread' -> name: 'Bread', quantity: 1.0, unit: 'loaf', category: 'Bakery'
    'Shampoo' -> name: 'Shampoo', quantity: 1.0, unit: 'item', category: 'Personal Care'
    """
    text = raw_text.strip()
    # Strip leading bullets or numbers like "1.", "1)", "-", "*"
    text = re.sub(r"^[\d\.\-\*\)\s]+", "", text).strip()
    
    quantity = 1.0
    unit = "item"
    
    # 1. Check for leading quantity like "2.5 kg" or "2"
    leading_match = re.match(r"^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$", text)
    if leading_match:
        qty_str, possible_unit, rest = leading_match.groups()
        try:
            quantity = float(qty_str)
        except ValueError:
            quantity = 1.0
            
        unit_found = False
        if possible_unit:
            for pattern, std_unit in UNIT_PATTERNS:
                if re.match(pattern, possible_unit, re.IGNORECASE):
                    unit = std_unit
                    unit_found = True
                    break
        
        if unit_found:
            text = rest
        elif possible_unit:
            # Maybe the possible_unit was actually part of the name (e.g. "2 Gala Apples")
            text = f"{possible_unit} {rest}"
        else:
            text = rest

    # 2. Check for trailing quantity like "Apple 2 kg" or "Eggs 1 dozen"
    trailing_match = re.search(r"[-–—:\s]+(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?$", text)
    if trailing_match and unit == "item" and quantity == 1.0:
        qty_str, possible_unit = trailing_match.groups()
        try:
            quantity = float(qty_str)
            text = text[:trailing_match.start()].strip()
            if possible_unit:
                for pattern, std_unit in UNIT_PATTERNS:
                    if re.match(pattern, possible_unit, re.IGNORECASE):
                        unit = std_unit
                        break
        except ValueError:
            pass

    # 3. If unit is still "item", search within text for unit words
    if unit == "item":
        for pattern, std_unit in UNIT_PATTERNS:
            found = re.search(pattern, text, re.IGNORECASE)
            if found:
                unit = std_unit
                # Remove unit word from item name
                text = re.sub(pattern, "", text, flags=re.IGNORECASE).strip()
                break

    # Clean name
    clean_name = re.sub(r"\s+", " ", text).strip().strip("-,:;.")
    if not clean_name:
        clean_name = raw_text.strip()
        
    # Title-case clean name
    clean_name = clean_name.capitalize()
    category = detect_category(clean_name)
    
    return {
        "name": clean_name,
        "quantity": max(0.1, quantity),
        "unit": unit,
        "category": category,
        "notes": None
    }

