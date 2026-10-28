const CONSTANTS = {
  // Виніс категорії в масив виключно для спрощення, хоча вони
  // можуть бути в окремій колекції для можливості нормально додавати нові
  CATEGORIES: [
    'Laptops',
    'Smartphones',
    'Tablets',
    'Desktop Computers',
    'Monitors',
    'Computer Components',
    'Computer Accessories',
    'Smartwatch & Wearables',
    'Audio Equipment',
    'Gaming Consoles',
  ],
  ORDER_STATUSES: ['new', 'processing', 'shipped', 'delivered', 'cancelled'],
  CLIENT_STATUSES: ['active', 'deleted'],
  PRICE_REGEX: /^\d{1,8}(\.\d{1,2})?$/,
};

module.exports = CONSTANTS;
