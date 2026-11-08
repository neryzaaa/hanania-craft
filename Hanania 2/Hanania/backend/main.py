import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Hanania API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = os.path.join(os.path.dirname(__file__), "database.json")

def read_db():
    if not os.path.exists(DB_FILE):
        return {"products": [], "orders": [], "stocks": [], "reviews": [], "stock_logs": []}
    with open(DB_FILE, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

# --- PRODUCTS ---
@app.get("/api/products")
def get_products():
    db = read_db()
    return db.get("products", [])

@app.post("/api/products")
async def add_product(request: Request):
    data = await request.json()
    db = read_db()
    if "products" not in db: db["products"] = []
    db["products"].append(data)
    write_db(db)
    return {"message": "Success", "product": data}

@app.put("/api/products/{product_id}/featured")
async def update_product_featured(product_id: int, request: Request):
    data = await request.json()
    db = read_db()
    for p in db.get("products", []):
        if str(p.get("id")) == str(product_id):
            p["isFeatured"] = data.get("isFeatured", False)
            write_db(db)
            return {"message": "Success", "product": p}
    raise HTTPException(status_code=404, detail="Product not found")

@app.put("/api/products/{product_id}")
async def update_product(product_id: int, request: Request):
    data = await request.json()
    db = read_db()
    for p in db.get("products", []):
        if str(p.get("id")) == str(product_id):
            p["name"] = data.get("name", p.get("name"))
            p["category"] = data.get("category", p.get("category"))
            p["price"] = data.get("price", p.get("price"))
            p["status"] = data.get("status", p.get("status"))
            p["image"] = data.get("image", p.get("image"))
            write_db(db)
            return {"message": "Success", "product": p}
    raise HTTPException(status_code=404, detail="Product not found")
@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    db = read_db()
    db["products"] = [p for p in db.get("products", []) if str(p.get("id")) != str(product_id)]
    write_db(db)
    return {"message": "Deleted"}

# --- ORDERS ---
@app.get("/api/orders")
def get_orders():
    db = read_db()
    return db.get("orders", [])

@app.post("/api/orders")
async def add_order(request: Request):
    data = await request.json()
    db = read_db()
    if "orders" not in db: db["orders"] = []
    db["orders"].append(data)
    write_db(db)
    return {"message": "Success", "order": data}

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, request: Request):
    data = await request.json()
    db = read_db()
    for o in db.get("orders", []):
        if str(o.get("id")) == str(order_id):
            o["status"] = data.get("status")
            write_db(db)
            return {"message": "Success", "order": o}
    raise HTTPException(status_code=404, detail="Order not found")

# --- STOCKS ---
@app.get("/api/stocks")
def get_stocks():
    db = read_db()
    return db.get("stocks", [])

@app.post("/api/stocks")
async def add_stock(request: Request):
    data = await request.json()
    db = read_db()
    if "stocks" not in db: db["stocks"] = []
    db["stocks"].append(data)
    write_db(db)
    return {"message": "Success", "stock": data}

@app.put("/api/stocks/{stock_id}")
async def update_stock(stock_id: int, request: Request):
    data = await request.json()
    db = read_db()
    for s in db.get("stocks", []):
        if str(s.get("id")) == str(stock_id):
            s["qty"] = data.get("qty", s.get("qty"))
            s["status"] = data.get("status", s.get("status"))
            write_db(db)
            return {"message": "Success", "stock": s}
    raise HTTPException(status_code=404, detail="Stock not found")

@app.delete("/api/stocks/{stock_id}")
def delete_stock(stock_id: int):
    db = read_db()
    db["stocks"] = [s for s in db.get("stocks", []) if str(s.get("id")) != str(stock_id)]
    write_db(db)
    return {"message": "Deleted"}

# --- STOCK LOGS ---
@app.get("/api/stock_logs")
def get_stock_logs():
    db = read_db()
    return db.get("stock_logs", [])

@app.post("/api/stock_logs")
async def add_stock_log(request: Request):
    data = await request.json()
    db = read_db()
    if "stock_logs" not in db: db["stock_logs"] = []
    db["stock_logs"].append(data)
    write_db(db)
    return {"message": "Success", "log": data}

# --- REVIEWS ---
@app.get("/api/reviews")
def get_reviews():
    db = read_db()
    return db.get("reviews", [])

@app.post("/api/reviews")
async def add_review(request: Request):
    data = await request.json()
    db = read_db()
    if "reviews" not in db: db["reviews"] = []
    db["reviews"].append(data)
    write_db(db)
    return {"message": "Success", "review": data}

@app.put("/api/reviews/{review_id}/featured")
async def update_review_featured(review_id: int, request: Request):
    data = await request.json()
    db = read_db()
    for r in db.get("reviews", []):
        if str(r.get("id")) == str(review_id):
            r["isFeatured"] = data.get("isFeatured", False)
            write_db(db)
            return {"message": "Success", "review": r}
    raise HTTPException(status_code=404, detail="Review not found")

# --- LOGIN ---
@app.post("/api/login")
async def login_admin(request: Request):
    data = await request.json()
    db = read_db()
    for admin in db.get("admins", []):
        if admin.get("username") == data.get("username") and admin.get("password") == data.get("password"):
            return {"message": "Success", "token": "admin-token-123"}
    raise HTTPException(status_code=401, detail="Invalid username or password")
