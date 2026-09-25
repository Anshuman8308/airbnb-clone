import os
import re
import urllib.request
import sqlite3
import hashlib

os.makedirs('frontend/public/listings', exist_ok=True)

# 1. Download images from DB
conn = sqlite3.connect('backend/airbnb.db')
c = conn.cursor()
c.execute('SELECT id, url FROM listing_images')
images = c.fetchall()

url_map = {}

print(f"Found {len(images)} images in database.")
for row in images:
    img_id, url = row
    if url.startswith('http') and 'unsplash' in url:
        if url not in url_map:
            h = hashlib.md5(url.encode()).hexdigest()[:10]
            filename = f"image_{h}.jpg"
            filepath = os.path.join('frontend/public/listings', filename)
            if not os.path.exists(filepath):
                try:
                    urllib.request.urlretrieve(url, filepath)
                except Exception as e:
                    print(f"Failed to download {url}: {e}")
            url_map[url] = f"/listings/{filename}"
        
        # Update DB
        c.execute('UPDATE listing_images SET url = ? WHERE id = ?', (url_map[url], img_id))

# Update fallbackData.ts
fallback_path = 'frontend/src/data/fallbackData.ts'
with open(fallback_path, 'r', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'(https://images\.unsplash\.com/[^"]+)', content)
print(f"Found {len(urls)} unsplash urls in fallbackData.")
for url in urls:
    if url not in url_map:
        h = hashlib.md5(url.encode()).hexdigest()[:10]
        filename = f"image_{h}.jpg"
        filepath = os.path.join('frontend/public/listings', filename)
        if not os.path.exists(filepath):
            try:
                urllib.request.urlretrieve(url, filepath)
            except Exception as e:
                print(f"Failed to download {url}: {e}")
        url_map[url] = f"/listings/{filename}"
        
for old_url, new_url in url_map.items():
    content = content.replace(old_url, new_url)

with open(fallback_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Remove Sofia Rossi
c.execute("UPDATE users SET name = 'Sarah Chen', email = 'sarah.chen@example.com', avatar_url = 'https://ui-avatars.com/api/?name=Sarah+Chen&background=0D8ABC&color=fff&rounded=true' WHERE name = 'Sofia Rossi'")

conn.commit()
conn.close()
print("Done processing images and removing Sofia Rossi.")
