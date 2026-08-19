import {
  ArrowRight,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Products",
      value: "0",
      icon: Package,
      description: "Products in catalogue",
    },
    {
      label: "Total Orders",
      value: "0",
      icon: ShoppingBag,
      description: "Orders received",
    },
    {
      label: "Customers",
      value: "0",
      icon: Users,
      description: "Registered customers",
    },
    {
      label: "Revenue",
      value: "₹0",
      icon: TrendingUp,
      description: "Total sales",
    },
  ];

  return (
    <div className="mx-auto max-w-375">
      {/* =====================================================
          WELCOME
      ===================================================== */}

      <section
        className="
          rounded-[22px]
          border
          border-[#E1D8CD]
          bg-[#F4EEE6]
          px-6
          py-7
          sm:px-8
          sm:py-9
          lg:px-10
          lg:py-10
        "
      >
        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.3em]
            text-[#A4773E]
          "
        >
          Overview
        </p>

        <div
          className="
            mt-3
            flex
            flex-col
            justify-between
            gap-5
            sm:flex-row
            sm:items-end
          "
        >
          <div>
            <h2
              className="
                font-serif
                text-[34px]
                leading-none
                tracking-[-0.045em]
                text-[#302B25]
                sm:text-[42px]
              "
            >
              Welcome to Taksham.
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-[10px]
                leading-5
                text-[#81776C]
                sm:text-[11px]
              "
            >
              Manage your products, orders and
              customers from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="
              group
              flex
              w-fit
              items-center
              gap-2
              rounded-xl
              bg-[#8F6B3F]
              px-5
              py-3
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              shadow-[0_8px_20px_rgba(143,107,63,0.15)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#795832]
            "
          >
            Manage Products

            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="mt-6">
        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {stats.map(
            ({
              label,
              value,
              icon: Icon,
              description,
            }) => (
              <div
                key={label}
                className="
                  rounded-[18px]
                  border
                  border-[#E2DAD0]
                  bg-white
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_28px_rgba(55,43,31,0.05)]
                "
              >
                <div className="flex items-start justify-between">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#F0E6D9]
                    "
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.4}
                      className="text-[#8F6B3F]"
                    />
                  </div>

                  <span
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#B0A69B]
                    "
                  >
                    Overview
                  </span>
                </div>

                <p
                  className="
                    mt-6
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[#81776C]
                  "
                >
                  {label}
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    text-[30px]
                    leading-none
                    tracking-[-0.04em]
                    text-[#302B25]
                  "
                >
                  {value}
                </p>

                <p
                  className="
                    mt-2
                    text-[9px]
                    text-[#A0988E]
                  "
                >
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="mt-6">
        <div className="mb-4">
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#A4773E]
            "
          >
            Quick actions
          </p>

          <h2
            className="
              mt-1.5
              font-serif
              text-[26px]
              leading-none
              tracking-[-0.035em]
              text-[#302B25]
            "
          >
            Manage your store
          </h2>
        </div>

        <div
          className="
            grid
            gap-3
            md:grid-cols-3
          "
        >
          {/* Products */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="
              group
              text-left
              rounded-[18px]
              border
              border-[#E2DAD0]
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CDB28B]
              hover:shadow-[0_14px_30px_rgba(55,43,31,0.06)]
            "
          >
            <div className="flex items-center justify-between">
              <Package
                size={19}
                strokeWidth={1.3}
                className="text-[#9A7138]"
              />

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="
                  text-[#A0988E]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-[#8F6B3F]
                "
              />
            </div>

            <h3
              className="
                mt-7
                font-serif
                text-[22px]
                tracking-tight
                text-[#302B25]
              "
            >
              Products
            </h3>

            <p
              className="
                mt-2
                text-[10px]
                leading-5
                text-[#81776C]
              "
            >
              Add, edit and manage your
              furniture catalogue.
            </p>
          </button>

          {/* Orders */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
            className="
              group
              text-left
              rounded-[18px]
              border
              border-[#E2DAD0]
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CDB28B]
              hover:shadow-[0_14px_30px_rgba(55,43,31,0.06)]
            "
          >
            <div className="flex items-center justify-between">
              <ShoppingBag
                size={19}
                strokeWidth={1.3}
                className="text-[#9A7138]"
              />

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="
                  text-[#A0988E]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-[#8F6B3F]
                "
              />
            </div>

            <h3
              className="
                mt-7
                font-serif
                text-[22px]
                tracking-tight
                text-[#302B25]
              "
            >
              Orders
            </h3>

            <p
              className="
                mt-2
                text-[10px]
                leading-5
                text-[#81776C]
              "
            >
              Review and manage customer
              orders.
            </p>
          </button>

          {/* Customers */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin/customers")
            }
            className="
              group
              text-left
              rounded-[18px]
              border
              border-[#E2DAD0]
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CDB28B]
              hover:shadow-[0_14px_30px_rgba(55,43,31,0.06)]
            "
          >
            <div className="flex items-center justify-between">
              <Users
                size={19}
                strokeWidth={1.3}
                className="text-[#9A7138]"
              />

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="
                  text-[#A0988E]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-[#8F6B3F]
                "
              />
            </div>

            <h3
              className="
                mt-7
                font-serif
                text-[22px]
                tracking-tight
                text-[#302B25]
              "
            >
              Customers
            </h3>

            <p
              className="
                mt-2
                text-[10px]
                leading-5
                text-[#81776C]
              "
            >
              View and manage registered
              customers.
            </p>
          </button>
        </div>
      </section>

      {/* =====================================================
          RECENT ACTIVITY PLACEHOLDER
      ===================================================== */}

      <section className="mt-6">
        <div
          className="
            rounded-[18px]
            border
            border-[#E2DAD0]
            bg-white
            p-5
            sm:p-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#A4773E]
                "
              >
                Activity
              </p>

              <h2
                className="
                  mt-1.5
                  font-serif
                  text-[25px]
                  leading-none
                  tracking-[-0.035em]
                  text-[#302B25]
                "
              >
                Recent activity
              </h2>
            </div>
          </div>

          <div
            className="
              flex
              min-h-38
              items-center
              justify-center
              text-center
            "
          >
            <div>
              <div
                className="
                  mx-auto
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3EDE5]
                "
              >
                <ShoppingBag
                  size={16}
                  strokeWidth={1.3}
                  className="text-[#A4773E]"
                />
              </div>

              <p
                className="
                  mt-3
                  text-[10px]
                  font-medium
                  text-[#71685E]
                "
              >
                No recent activity yet
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  text-[#A0988E]
                "
              >
                Activity will appear here once
                your store starts receiving data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;