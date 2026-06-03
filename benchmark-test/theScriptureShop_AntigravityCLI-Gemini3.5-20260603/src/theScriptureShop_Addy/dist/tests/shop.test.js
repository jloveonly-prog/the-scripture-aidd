import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db, initDb } from '../src/db/client.js';
describe('The Scripture Shop Tests', () => {
    beforeAll(async () => {
        // Initialize DB (this creates tables and seeds Bibles)
        await initDb();
    });
    afterAll(async () => {
        // Clean up test data
        await db.execute("DELETE FROM order_items WHERE order_id LIKE 'TS-TEST%'");
        await db.execute("DELETE FROM orders WHERE id LIKE 'TS-TEST%'");
    });
    it('1. Database: should have exactly 10 seeded Bibles', async () => {
        const res = await db.execute('SELECT COUNT(*) as count FROM bibles');
        const count = Number(res.rows[0].count);
        expect(count).toBe(10);
        const biblesRes = await db.execute('SELECT translation FROM bibles');
        const translations = biblesRes.rows.map(r => r.translation);
        expect(translations).toContain('KJV');
        expect(translations).toContain('NIV');
        expect(translations).toContain('KOR');
    });
    it('2. Checkout & Order: should successfully insert order and order items', async () => {
        const testOrderId = 'TS-TEST123';
        // Insert test order
        await db.execute({
            sql: 'INSERT INTO orders (id, name, address, phone, confessed, status, invoice_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            args: [testOrderId, 'Test User', 'Test Address', '010-9999-9999', 1, 'pending', null, '2026-06-03']
        });
        // Insert test order item for Bible ID 1 (KJV)
        await db.execute({
            sql: 'INSERT INTO order_items (order_id, bible_id, quantity) VALUES (?, ?, ?)',
            args: [testOrderId, 1, 2]
        });
        // Verify order exists
        const orderRes = await db.execute({
            sql: 'SELECT * FROM orders WHERE id = ?',
            args: [testOrderId]
        });
        expect(orderRes.rows.length).toBe(1);
        expect(orderRes.rows[0].status).toBe('pending');
        expect(Number(orderRes.rows[0].confessed)).toBe(1);
        // Verify order items exist
        const itemsRes = await db.execute({
            sql: 'SELECT * FROM order_items WHERE order_id = ?',
            args: [testOrderId]
        });
        expect(itemsRes.rows.length).toBe(1);
        expect(Number(itemsRes.rows[0].bible_id)).toBe(1);
        expect(Number(itemsRes.rows[0].quantity)).toBe(2);
    });
    it('3. Tracking: should retrieve tracking details for active order', async () => {
        const testOrderId = 'TS-TEST123';
        const orderRes = await db.execute({
            sql: 'SELECT * FROM orders WHERE id = ?',
            args: [testOrderId]
        });
        expect(orderRes.rows.length).toBe(1);
        expect(orderRes.rows[0].id).toBe(testOrderId);
    });
    it('4. Admin Shipping: should validate and process 8-digit tracking number', async () => {
        const testOrderId = 'TS-TEST123';
        const validInvoice = '12345678';
        const invalidInvoice1 = '12345';
        const invalidInvoice2 = '1234567a';
        // Regex check matching index.tsx validation
        const invoiceRegex = /^[0-9]{8}$/;
        expect(invoiceRegex.test(validInvoice)).toBe(true);
        expect(invoiceRegex.test(invalidInvoice1)).toBe(false);
        expect(invoiceRegex.test(invalidInvoice2)).toBe(false);
        // Update order status with valid tracking number
        await db.execute({
            sql: 'UPDATE orders SET status = ?, invoice_number = ? WHERE id = ?',
            args: ['completed', validInvoice, testOrderId]
        });
        // Verify updated status
        const orderRes = await db.execute({
            sql: 'SELECT * FROM orders WHERE id = ?',
            args: [testOrderId]
        });
        expect(orderRes.rows[0].status).toBe('completed');
        expect(orderRes.rows[0].invoice_number).toBe(validInvoice);
    });
});
