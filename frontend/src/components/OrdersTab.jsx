import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Star, FilePen } from "lucide-react";
import { useProductStore } from "../store/useProductStore";

const OrdersTab = () => {
  const { updateOrderStatus, orders } = useProductStore();

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className=" min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Total Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Quantity
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Products
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {orders?.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // 24-hour format
              }
            );
            let actionClass = "bg-gray-700";
            if (order.status === "Pending") {
              actionClass = "bg-gray-700";
            } else if (order.status === "Done") {
              actionClass = "bg-green-800";
            } else if (order.status === "Canceled") {
              actionClass = "bg-red-800";
            } else if (order.status === "In Progress") {
              actionClass = "bg-yellow-600";
            }
            return (
              <tr key={order._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    ${Number(order.totalAmount)?.toFixed(2) || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {order.products.reduce(
                      (total, p) => total + (p.quantity || 0),
                      0
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <ul className="text-gray-300/40 list-disc">
                    {order.products.map((product, i) => (
                      <li key={i} className="text-gray-300/40  ">
                        {product.product.name}{" "}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className={` ${actionClass}  text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default OrdersTab;
