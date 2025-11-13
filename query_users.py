import psycopg2
conn = psycopg2.connect(host="localhost", port=5432, user="postgres", password="postgres", dbname="servicios_hogar")
cur = conn.cursor()
cur.execute("SELECT id, email, user_type FROM users ORDER BY id")
rows = cur.fetchall()
for row in rows:
    print(row)
cur.close()
conn.close()
