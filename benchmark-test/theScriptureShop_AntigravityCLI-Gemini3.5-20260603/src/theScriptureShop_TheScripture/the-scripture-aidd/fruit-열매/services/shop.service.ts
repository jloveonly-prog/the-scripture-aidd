import { db } from '../db/client.js';

export interface Bible {
  id: number;
  translation_name: string;
  cover_image: string;
  description: string;
  created_at: string;
}

export interface CartItem {
  bibleId: number;
  quantity: number;
}

export interface OrderInput {
  customerName: string;
  contact: string;
  address: string;
  believed: boolean;
  items: CartItem[];
}

export class ShopService {
  // REQ-001: Get list of 10 bibles
  static getBibles(): Bible[] {
    return db.prepare('SELECT * FROM bibles ORDER BY id ASC').all() as Bible[];
  }

  static getBibleById(id: number): Bible | undefined {
    return db.prepare('SELECT * FROM bibles WHERE id = ?').get(id) as Bible | undefined;
  }

  // REQ-003: Create non-member order
  static createOrder(input: OrderInput): string {
    // 3중 방어막 2선: Server-side validation
    const name = input.customerName?.trim() || '';
    const contact = input.contact?.trim() || '';
    const address = input.address?.trim() || '';

    if (!name || !contact || !address) {
      throw new Error('이름, 연락처, 배송지 주소를 모두 기입해 주셔야 합니다.');
    }

    if (!input.believed) {
      throw new Error('예수님을 구원자로 고백하고 동의하셔야 성경을 주문하실 수 있습니다.');
    }

    if (!input.items || input.items.length === 0) {
      throw new Error('장바구니가 비어 있습니다.');
    }

    // Generate unique order number (e.g., S-20260603-9A1F)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const orderNumber = `S-${dateStr}-${randHex}`;
    const believedAt = new Date().toISOString();

    db.exec('BEGIN TRANSACTION');
    try {
      // Insert order (believed is 1, default status is PENDING)
      const orderStmt = db.prepare(`
        INSERT INTO orders (order_number, customer_name, contact, address, believed, believed_at, status)
        VALUES (?, ?, ?, ?, 1, ?, 'PENDING')
      `);
      const result = orderStmt.run(orderNumber, name, contact, address, believedAt);
      
      // Node native sqlite returns lastInsertRowid as number/bigint
      const orderId = Number(result.lastInsertRowid);

      // Insert order items
      const itemStmt = db.prepare(`
        INSERT INTO order_items (order_id, bible_id, quantity)
        VALUES (?, ?, ?)
      `);

      for (const item of input.items) {
        if (item.quantity <= 0) {
          throw new Error('수량은 1개 이상이어야 합니다.');
        }
        itemStmt.run(orderId, item.bibleId, item.quantity);
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }

    return orderNumber;
  }

  // REQ-004: Track order by order number
  static trackOrder(orderNumber: string) {
    const order = db.prepare(`
      SELECT * FROM orders WHERE order_number = ?
    `).get(orderNumber.trim()) as any;

    if (!order) {
      return null;
    }

    const items = db.prepare(`
      SELECT oi.*, b.translation_name
      FROM order_items oi
      JOIN bibles b ON oi.bible_id = b.id
      WHERE oi.order_id = ?
    `).all(order.id) as any[];

    return {
      ...order,
      items
    };
  }
}
