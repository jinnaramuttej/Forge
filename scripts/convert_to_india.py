import os
import csv
import random
import shutil

def process():
    uk_dir = os.path.join("finance agent", "finance agent", "data", "uk")
    india_dir = os.path.join("finance agent", "finance agent", "data", "india")
    
    # Fresh regeneration
    if os.path.exists(india_dir):
        shutil.rmtree(india_dir)
    os.makedirs(india_dir)

    money_columns = [
        'credit_limit', 'annual_salary', 'hourly_rate', 'cost_price', 'sell_price', 
        'subtotal', 'gst_amount', 'total_amount', 'amount', 'balance', 'price'
    ]

    cities_states = [
        ("Mumbai", "Maharashtra"), ("Delhi", "Delhi"), ("Bengaluru", "Karnataka"), 
        ("Hyderabad", "Telangana"), ("Chennai", "Tamil Nadu"), ("Pune", "Maharashtra"),
        ("Ahmedabad", "Gujarat"), ("Kolkata", "West Bengal")
    ]
    
    first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Rohan", "Pooja", "Arjun", "Anjali", "Karan", "Riya"]
    last_names = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Rao", "Naidu", "Desai", "Joshi", "Iyer", "Nair"]
    company_prefixes = ["Reliance", "Tata", "Infosys", "Wipro", "Adani", "Mahindra", "Birla", "Godrej", "Bajaj", "TVS", "Tech", "Apex"]
    company_suffixes = ["Pvt Ltd", "Technologies", "Enterprises", "Solutions", "Industries", "Group"]
    streets = ["MG Road", "Link Road", "Station Road", "Ring Road", "High Street", "Main Road", "Temple Road"]

    def rand_company():
        return f"{random.choice(company_prefixes)} {random.choice(company_suffixes)}"
    
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
                # 1. Scale monetary columns
                for col in money_columns:
                    if col in row and row[col]:
                        try:
                            val = float(row[col])
                            row[col] = str(round(val * 105, 2))
                        except ValueError:
                            pass
                
                # 2. Randomize Geography
                city_state = random.choice(cities_states)
                if 'city' in row:
                    row['city'] = city_state[0]
                if 'state' in row:
                    row['state'] = city_state[1]
                if 'billing_city' in row:
                    row['billing_city'] = city_state[0]
                if 'billing_state' in row:
                    row['billing_state'] = city_state[1]
                if 'country' in row:
                    row['country'] = 'India'
                if 'billing_country' in row:
                    row['billing_country'] = 'India'
                if 'postcode' in row:
                    row['postcode'] = str(random.randint(110000, 800000))
                if 'street' in row:
                    row['street'] = f"{random.randint(1, 999)}, {random.choice(streets)}"
                
                # 3. Randomize Persons
                if 'first_name' in row:
                    row['first_name'] = random.choice(first_names)
                if 'last_name' in row:
                    row['last_name'] = random.choice(last_names)
                
                # 4. Randomize Companies
                # In companies.csv and customers.csv, the 'name' column holds company names.
                # In chart_of_accounts/departments, 'name' holds generic entity names which shouldn't be touched.
                if filename in ['companies.csv', 'customers.csv']:
                    if 'name' in row:
                        new_comp = rand_company()
                        row['name'] = new_comp
                        if 'trading_name' in row:
                            row['trading_name'] = new_comp
                
                # 5. Fix currencies in journal/orders if they explicitly have GBP
                if 'currency' in row and row['currency'] == 'GBP':
                    row['currency'] = 'INR'

                writer.writerow(row)
                
    print("CSV conversion complete with full Indian mocking.")

if __name__ == "__main__":
    process()
