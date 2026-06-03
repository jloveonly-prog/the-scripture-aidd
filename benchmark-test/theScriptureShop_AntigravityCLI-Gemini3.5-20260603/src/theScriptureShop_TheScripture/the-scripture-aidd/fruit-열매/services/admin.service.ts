import { db } from '../db/client.js';

export class AdminService {
  // REQ-005: List orders by status (PENDING / SHIPPED)
  static getOrdersByStatus(status: 'PENDING' | 'SHIPPED') {
    return db.prepare(`
      SELECT * FROM orders 
      WHERE status = ? 
      ORDER BY created_at DESC
    `).all(status);
  }

  // REQ-005: Get single order details including faith confession agreement
  static getOrderDetail(id: number) {
    const order = db.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).get(id) as any;

    if (!order) {
      return null;
    }

    const items = db.prepare(`
      SELECT oi.*, b.translation_name
      FROM order_items oi
      JOIN bibles b ON oi.bible_id = b.id
      WHERE oi.order_id = ?
    `).all(id) as any[];

    return {
      ...order,
      items
    };
  }

  // REQ-005: Update order status with 8-digit tracking number
  static shipOrder(id: number, trackingNumber: string) {
    const trimmed = trackingNumber?.trim() || '';

    // Validate 8-digit numeric tracking number
    if (!/^\d{8}$/.test(trimmed)) {
      throw new Error('송장번호는 반드시 8자리 숫자여야 합니다.');
    }

    const result = db.prepare(`
      UPDATE orders 
      SET tracking_number = ?, status = 'SHIPPED'
      WHERE id = ? AND status = 'PENDING'
    `).run(trimmed, id);

    if (result.changes === 0) {
      throw new Error('주문을 찾을 수 없거나 이미 발송 완료된 주문입니다.');
    }

    return true;
  }
}
