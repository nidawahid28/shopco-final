"use client";

import React, { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const sanity = sanityClient({
  projectId: "abxbskhb",
  dataset: "production",
  apiVersion: "2025-01-13",
  useCdn: true,
});

interface Product {
  _id: string;
  _type: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPercent: number;
  isNew: boolean;
  colors: string[];
  sizes: string[];
  image: string; // The URL of the image
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const query = `
        *[_type == "products"] {
          _id,
          _type,
          name,
          description,
          price,
          discountPercent,
          category,
          sizes,
          colors,
          isNew,
          "image": image.asset._ref,
          _createdAt,
          _updatedAt,
          _rev
        }
      `;
      const data = await sanity.fetch(query);
      setProducts(data);
    } catch (error) {
      console.error("Error Fetching Products", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} has been added to your cart!`);
  };

  const truncateDescription = (description: string) => {
    return description.length > 100
      ? description.substring(0, 100) + "..."
      : description;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-center text-slate-800 mt-4 mb-4">
        Products From API's Data
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg gap-4 hover:shadow-lg transition duration-300"
            >
              <Image
                src={urlFor(product.image).url()}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-4 p-4">
                {product.isNew && (
                  <span className="text-xs text-white bg-green-600 px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-500 text-sm italic">
                  Category: {product.category}
                </p>
                <p className="text-slate-800 mt-2 text-sm">
                  {truncateDescription(product.description)}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Available Colors:</p>
                  <div className="flex gap-2 mt-1">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className={`w-6 h-6 rounded-full border`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">Sizes:</p>
                  <div className="flex gap-2 mt-1">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs border rounded-md text-gray-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-black font-bold">${product.price}</p>
                    {product.discountPercent > 0 && (
                      <p className="text-sm text-pink-700">
                        {product.discountPercent}% OFF
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>
      Cart Summary
      <div className="mt-8 bg-slate-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-black text-red-800">Cart Summary</h2>
        {Array.isArray(cart) && cart.length > 0 ? (
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white shadow-sm p-4 rounded-md"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-blue-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <Image
                  src={urlFor(item.image).url()}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>Your Cart Is Empty Please Add Products</p>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
