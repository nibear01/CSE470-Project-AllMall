import { Link } from "react-router-dom";

// TEMP DUMMY fallback data for dev routing
const dummyItems = [
  {
    id: 1,
    title: "Smart Watch",
    price: 120.99,
    quantity: 1,
    image: "https://via.placeholder.com/80x80.png?text=Watch",
  },
  {
    id: 2,
    title: "Running Shoes",
    price: 89.5,
    quantity: 2,
    image: "https://via.placeholder.com/80x80.png?text=Shoes",
  },
];

const Cart = ({ cartItems = dummyItems, onRemoveItem = () => {} }) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full max-w-full min-h-[50vh] h-auto mx-auto !p-4 bg-white rounded-lg shadow-md border-gray-200">
      <div className="max-w-[90%] !m-auto">
        <h2 className="text-2xl font-semibold text-center !my-6 text-[var(--hover-color)]">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between  !p-4 border-b-1 !border-gray-300  hover:shadow-sm transition-all"
              >
                <div className="flex items-center !gap-4">
                  <p>{item.id}.</p>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      Price: ${item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-col gap-9">
                  <p className="text-[var(--hover-color)] font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="mt-1 !px-3 !py-[2px] border-1 hover:border-[var(--hover-color)] hover:text-[var(--hover-color)] hover:bg-white bg-[var(--hover-color)] text-white rounded transition-all"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center !p-6 !mt-1">
              <span className="text-lg font-semibold text-gray-700">
                Total:
              </span>
              <span className="text-xl font-bold text-[var(--hover-color)]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="text-center !my-5">
              <Link
                to="/checkout"
                className="inline-block font-[500] 
                !p-2 border-1 hover:border-[var(--hover-color)] hover:text-[var(--hover-color)] hover:bg-white bg-[var(--hover-color)] text-white rounded transition-all"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
