export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Over-ear headphones with active noise cancellation.",
    price: 89.99,
    image: "https://example.com/images/headphones.jpg",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracking smart watch with heart rate monitor.",
    price: 129.99,
    image: "https://example.com/images/smartwatch.jpg",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches.",
    price: 59.99,
    image: "https://example.com/images/keyboard.jpg",
  },
  {
    id: 4,
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots.",
    price: 34.99,
    image: "https://example.com/images/usbhub.jpg",
  },
  {
    id: 5,
    name: "Portable Speaker",
    description: "Waterproof Bluetooth speaker with 12-hour battery life.",
    price: 49.99,
    image: "https://example.com/images/speaker.jpg",
  },
];
