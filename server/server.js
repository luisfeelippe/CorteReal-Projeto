const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'cortereal'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
    } else {
        console.log('Sucesso: Conectado ao MySQL do XAMPP!');
    }
});

app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products WHERE is_active = 1";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/admin/products', (req, res) => {
    const sql = "SELECT * FROM products"; 
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3001, () => {
    console.log("Servidor Back-end rodando na porta 3001");
});

app.post('/register', (req, res) => {
    const { name, email, cpf, birth_date, password } = req.body;
    const sql = "INSERT INTO users (name, email, cpf, birth_date, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, cpf, birth_date, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao cadastrar usuário (Email já existe?)" });
        }
        return res.json({ message: "Usuário cadastrado com sucesso!" });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro interno" });
        
        if (result.length > 0) {
            const user = result[0];
            return res.json({ 
                message: "Login realizado!", 
                user: { id: user.id, name: user.name, is_admin: user.is_admin } 
            });
        } else {
            return res.status(401).json({ error: "Email ou senha incorretos" });
        }
    });
});

app.post('/checkout', (req, res) => {
    const { userId, total, address, paymentMethod, items } = req.body;

    const sqlOrder = "INSERT INTO orders (user_id, total, status, address, payment_method, created_at) VALUES (?, ?, 'Pendente', ?, ?, NOW())";
    
    db.query(sqlOrder, [userId, total, address, paymentMethod], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar pedido" });

        const orderId = result.insertId;
        const itemsValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
        const sqlItems = "INSERT INTO order_items (order_id, product_id, quantity, price_at_moment) VALUES ?";
        
        db.query(sqlItems, [itemsValues], (errItems) => {
            if (errItems) return res.status(500).json({ error: "Erro nos itens" });
            items.forEach(item => {
                db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.id]);
            });

            res.json({ message: "Sucesso!", orderId: orderId });
        });
    });
});

app.get('/my-orders/:userId', (req, res) => {
    const { userId } = req.params;
    
    const sql = `
        SELECT o.id as order_id, o.total, o.status, o.created_at,
               oi.product_id, oi.quantity, oi.price_at_moment,
               p.name, p.image_url
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar pedidos" });
        }
        const orders = [];
        results.forEach(row => {
            let order = orders.find(o => o.id === row.order_id);
            if (!order) {
                order = {
                    id: row.order_id,
                    total: row.total,
                    status: row.status,
                    date: row.created_at,
                    items: []
                };
                orders.push(order);
            } 
            order.items.push({
                name: row.name,
                image: row.image_url,
                quantity: row.quantity,
                price: row.price_at_moment
            });
        });
        res.json(orders);
    });
});

app.post('/products', (req, res) => { 
    const { name, price, category, image, stock } = req.body;
    const sql = "INSERT INTO products (name, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, price, category, image, stock], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao cadastrar" });
        res.json({ message: "Produto cadastrado!" });
    });
});

app.put('/products/:id', (req, res) => { 
    const { id } = req.params;
    const { name, price, category, image, stock } = req.body;
    const sql = "UPDATE products SET name=?, price=?, category=?, image_url=?, stock=? WHERE id=?";
    db.query(sql, [name, price, category, image, stock, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar" });
        res.json({ message: "Produto atualizado!" });
    });
});

app.get('/admin/orders', (req, res) => {
    const sql = `
        SELECT o.id as order_id, o.total, o.status, o.created_at, o.address, o.payment_method,
               u.name as user_name, u.email as user_email, u.cpf as user_cpf,
               oi.quantity, oi.price_at_moment,
               p.name as product_name, p.image_url
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar pedidos" });
        const ordersMap = new Map();
        results.forEach(row => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    id: row.order_id,
                    user_name: row.user_name,
                    user_email: row.user_email,
                    user_cpf: row.user_cpf,        
                    address: row.address,          
                    payment_method: row.payment_method, 
                    date: row.created_at,
                    total: row.total,
                    status: row.status,
                    items: []
                });
            }
            ordersMap.get(row.order_id).items.push({
                name: row.product_name,
                image: row.image_url,
                quantity: row.quantity,
                price: row.price_at_moment
            });
        });
        res.json(Array.from(ordersMap.values()));
    });
});

app.put('/admin/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar" });
        res.json({ message: "Status atualizado!" });
    });
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(409).json({ error: "Produto possui vendas registradas." });
        }
        res.json({ message: "Produto excluído permanentemente!" });
    });
});

app.put('/products/:id/status', (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    const sql = "UPDATE products SET is_active = ? WHERE id = ?";
    db.query(sql, [is_active, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar status" });
        res.json({ message: is_active ? "Produto Reativado!" : "Produto Ocultado!" });
    });
});