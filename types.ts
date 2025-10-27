interface AdditionalDetails {
  hobby?: string;
  country?: string;
  bio?: string;
}

export interface RegisterRequestType {
  username: string;
  password: string;
  email: string;
  phoneNo: string;
  additional_dtls?: AdditionalDetails;
  profile_image?: string;
}

export interface ProductDataType {
  barcode: string;
  name: string;
  price: string;
  description: string;
  stock: number;
  product_image?: string; // optional
}
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phoneNo: string;
  additional_dtls?: AdditionalDetails;
  profile_image?: string;
}

interface AdditionalDetails {
  hobby?: string;
  country?: string;
  bio?: string;
}

export interface UpdateStockType {
  barcode: string;
  price: number;
  quantity: number;
}

interface AddProductType {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string;
  category: string;
  brand: string;
  add_dtls: string;
  discount: number;
  unit: string;
  mfgDate: string;
  expDate: string;
}

export interface LoginDataType {
  username: string;
  password: string;
}

interface FinalizeSaleType {
  customerName: string;
  customerPhone: number;
  paymentMode: string;
  cartId: string;
}

interface BillType {
  message: string;
  bill: Bill;
}

interface Bill {
  customerName: string;
  customerPhone: number;
  paymentMode: string;
  items: Item[];
  totalAmount: string;
  date: string;
  paymentLink: string;
}

interface Item {
  name: string;
  price: number;
  description: string;
}

interface ProceedCartType {
  barcodes: string[];
}

interface ProceedCartResponseType {
  message: string;
  cartId: string;
  totalAmount: number;
  items: Items[];
}

interface Items {
  name: string;
  description: string;
  price: number;
}

// sales type
export interface SalesData {
  itemDetails: {
    cart_id: string;
    customer_details: string;
    barcode: string | null;
    product_name: string;
    cart_amount: string;
    payment_mode: string;
    sales_date: string;
  }[];
  totalAmount: number | null;
  top5Products: {
    barcode: string;
    name: string;
    sales_count: string;
  }[];
  least5Products: {
    barcode: string;
    name: string;
    sales_count: string;
  }[];
  sellChartData: {
    name: string;
    sales: number;
  }[];
}
