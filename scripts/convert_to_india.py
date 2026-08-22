import os
import csv

def process():
    uk_dir = os.path.join("finance agent", "finance agent", "data", "uk")
    india_dir = os.path.join("finance agent", "finance agent", "data", "india")
    
    if not os.path.exists(india_dir):
        os.makedirs(india_dir)

    money_columns = [
        'credit_limit', 'annual_salary', 'hourly_rate', 'cost_price', 'sell_price', 
        'subtotal', 'gst_amount', 'total_amount', 'amount', 'balance', 'price'
    ]

    string_replacements = {
        'London': 'Mumbai',
        'UK': 'India',
        'United Kingdom': 'India',
        'GBP': 'INR',
        '£': '₹',
        'Smith': 'Sharma',
        'Jones': 'Patel',
        'Williams': 'Singh',
        'Brown': 'Kumar',
        'Taylor': 'Gupta',
        'Davies': 'Reddy',
        'Evans': 'Rao',
        'Thomas': 'Naidu',
        'Tech Innovations UK': 'Tech Innovations India',
        'British': 'Indian',
        'England': 'Maharashtra'
    }

    for filename in os.listdir(uk_dir):
        if not filename.endswith(".csv"):
            continue
        
        in_path = os.path.join(uk_dir, filename)
        out_path = os.path.join(india_dir, filename)

        with open(in_path, 'r', encoding='utf-8-sig') as infile, open(out_path, 'w', encoding='utf-8-sig', newline='') as outfile:
            reader = csv.DictReader(infile)
            fieldnames = reader.fieldnames
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()

            for row in reader:
                # Apply numeric multipliers
                for col in money_columns:
                    if col in row and row[col]:
                        try:
                            val = float(row[col])
                            row[col] = str(round(val * 105, 2))
                        except ValueError:
                            pass
                
                # Apply string replacements across all values
                for k, v in row.items():
                    if isinstance(v, str):
                        for old_str, new_str in string_replacements.items():
                            if old_str in v:
                                v = v.replace(old_str, new_str)
                        row[k] = v

                writer.writerow(row)
                
    print("CSV conversion complete.")

if __name__ == "__main__":
    process()
