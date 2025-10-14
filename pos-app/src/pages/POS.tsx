import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useDatabase } from '../hooks/useDatabase';
import { useSettings } from '../hooks/useSettings';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem extends Product {
  cartQuantity: number;
}

const POS = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { products, sales } = useDatabase();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // حالة الدفع
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [discount, setDiscount] = useState(0);
  const taxRate = settings.tax_rate / 100;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await products.getAll();
      setProductList(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error(t('error_loading_products'));
    }
  };

  // حساب المجاميع
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discount;

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.cartQuantity >= product.quantity) {
          toast.error(t('out_of_stock'));
          return currentCart;
        }
        
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      
      return [...currentCart, { ...product, cartQuantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, cartQuantity: Math.min(quantity, item.quantity) }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error(t('cart_empty'));
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        items: cart,
        total,
        subtotal,
        tax,
        discount,
        payment_method: paymentMethod
      };

      await sales.create(saleData);
      await generateReceipt();
      
      // إعادة تعيين السلة
      // Reset cart
      setCart([]);
      setDiscount(0);
      setPaymentMethod('cash');
      
      toast.success(t('sale_complete'));
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(t('checkout_error'));
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = async () => {
    const doc = new jsPDF();
    const startY = 20;
    let currentY = startY;

    // ترويسة الفاتورة
    // Receipt header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(settings.company_name, 105, currentY, { align: 'center' });
    
    currentY += 15;
    doc.setFontSize(12);
    doc.text(new Date().toLocaleString(), 105, currentY, { align: 'center' });

    // تفاصيل المنتجات
    // Product details
    currentY += 15;
    doc.setFont('helvetica', 'normal');
    cart.forEach(item => {
      doc.text(`${item.name} x${item.cartQuantity}`, 20, currentY);
      doc.text(`${(item.price * item.cartQuantity).toFixed(2)}`, 180, currentY, { align: 'right' });
      currentY += 10;
    });

    // المجاميع
    // Totals
    currentY += 10;
    doc.text(`${t('subtotal')}: ${settings.currency} ${subtotal.toFixed(2)}`, 180, currentY, { align: 'right' });
    currentY += 10;
    doc.text(`${t('tax')} (${settings.tax_rate}%): ${settings.currency} ${tax.toFixed(2)}`, 180, currentY, { align: 'right' });
    currentY += 10;
    doc.text(`${t('discount')}: ${settings.currency} ${discount.toFixed(2)}`, 180, currentY, { align: 'right' });
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('total')}: ${settings.currency} ${total.toFixed(2)}`, 180, currentY, { align: 'right' });

    // تذييل الفاتورة
    // Receipt footer
    currentY += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(settings.receipt_footer, 105, currentY, { align: 'center' });

    // حفظ وطباعة
    // Save and print
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col md:flex-row gap-6"
    >
      {/* قائمة المنتجات */}
      {/* Products list */}
      <div className="md:w-2/3 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-neumorph">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_products')}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {productList
            .filter(product => 
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.code.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(product => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-lg shadow-neumorph text-center"
              >
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.code}</p>
                <p className="mt-2 text-primary-600 font-bold">
                  {settings.currency} {product.price.toFixed(2)}
                </p>
              </motion.button>
            ))
          }
        </div>
      </div>

      {/* سلة المشتريات */}
      {/* Shopping cart */}
      <div className="md:w-1/3 bg-white rounded-lg shadow-neumorph p-4 space-y-4">
        <h2 className="text-xl font-semibold">{t('cart')}</h2>
        
        <div className="flex-1 space-y-2">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 border-b">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {settings.currency} {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={item.cartQuantity}
                  onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded-md"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('subtotal')}:</span>
            <span>{settings.currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tax')} ({settings.tax_rate}%):</span>
            <span>{settings.currency} {tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{t('discount')}:</span>
            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded-md"
            />
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>{t('total')}:</span>
            <span>{settings.currency} {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2 rounded-md ${
                paymentMethod === 'cash'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t('cash')}
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2 rounded-md ${
                paymentMethod === 'card'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t('card')}
            </button>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className={`w-full py-3 rounded-md bg-primary-600 text-white font-medium ${
              loading || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
            }`}
          >
            {loading ? t('processing') : t('checkout')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default POS;