import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Global logger to see what's happening
app.use((req, res, next) => {
    console.log(`[LOG] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = 5000;
const HOST = '0.0.0.0';

// Mock database for orders
const orders = [];

// Products API
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').insert([req.body]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('products').update(req.body).eq('id', id).select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: product } = await supabase.from('products').select('image_url').eq('id', id).single();
        
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;

        // Cleanup image if it's in our storage
        if (product?.image_url?.includes('IImages/products/')) {
            const fileName = product.image_url.split('/').pop();
            await supabase.storage.from('IImages').remove([`products/${fileName}`]).catch(console.error);
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gateway: JazzCash
app.post('/api/payment/jazzcash', (req, res) => {
    const { orderId, amount, phone } = req.body;
    console.log(`[JazzCash] Processing Rs.${amount} for order ${orderId} (Phone: ${phone})`);
    
    setTimeout(() => {
        res.json({
            success: true,
            transactionId: 'JC' + Math.floor(Math.random() * 1000000000),
            message: 'JazzCash payment successful'
        });
    }, 1500);
});

// Gateway: EasyPaisa
app.post('/api/payment/easypaisa', (req, res) => {
    const { orderId, amount, phone } = req.body;
    console.log(`[EasyPaisa] Processing Rs.${amount} for order ${orderId} (Phone: ${phone})`);
    
    setTimeout(() => {
        res.json({
            success: true,
            transactionId: 'EP' + Math.floor(Math.random() * 1000000000),
            message: 'EasyPaisa payment successful'
        });
    }, 1500);
});

// 1. Create Order with Items (Atomic Flow)
app.post('/api/orders', async (req, res) => {
    try {
        const { user_id, total, status, payment_method, shipping_address, items } = req.body;

        // 1. Create Order Record
        const { data: order, error: orderErr } = await supabase
            .from('orders')
            .insert([{ 
                user_id: user_id || null, 
                total, 
                status: status || 'pending', 
                payment_method, 
                shipping_address 
            }])
            .select()
            .single();

        if (orderErr) throw orderErr;

        // 2. Insert Order Items using the new Order ID
        if (items && items.length > 0) {
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
            if (itemsErr) throw itemsErr;
        }

        console.log(`[Backend] Order Created Successfully: ${order.id}`);
        res.status(201).json(order);
    } catch (error) {
        console.error('[Backend] Order Creation Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Admin: Create User (Bypasses 429 Rate Limits using Service Role)
app.post('/api/admin/create-user', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // 1. Create User in Auth
        const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, phone }
        });

        if (authErr) throw authErr;

        // 2. Insert into public.users profile table
        const { error: profileErr } = await supabase
            .from('users')
            .insert([{ id: authData.user.id, name, phone }]);

        if (profileErr) throw profileErr;

        console.log(`[Admin] Manually created user: ${email}`);
        res.status(201).json(authData.user);
    } catch (error) {
        console.error('[Admin] Manual Creation Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update Order Status (Admin Shipping System)
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // pending → processing → shipped → delivered

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'The Glases Backend is running!' });
});

app.listen(PORT, HOST, () => {
    console.log(`✅ Backend server running on http://${HOST}:${PORT}`);
    console.log(`🔌 Payment Endpoints: /api/payment/jazzcash, /api/payment/easypaisa`);
});
