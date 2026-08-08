import {
  ArrowRight,
  Heart,
  Truck,
  ShieldCheck,
  LockKeyhole,
  UserRound,
  Headphones,
} from "lucide-react";

import sofa from "../../assets/images/products/sofa.png";
import diningTable from "../../assets/images/products/dining-table.png";
import accentChair from "../../assets/images/products/accent-chair.png";
import tvUnit from "../../assets/images/products/tv-unit.png";
import floorLamp from "../../assets/images/products/floor-lamp.png";
import storageCabinet from "../../assets/images/products/storage-cabinet.png";



const products = [
  {
    name: "Luna Sofa",
    type: "3 Seater Sofa",
    price: "₹29,990",
    image: sofa,
    isNew: true,
  },
  {
    name: "Nova Dining Table",
    type: "6 Seater Dining Table",
    price: "₹28,990",
    image: diningTable,
    isNew: false,
  },
  {
    name: "Aira Accent Chair",
    type: "Accent Chair",
    price: "₹12,990",
    image: accentChair,
    isNew: true,
  },
  {
    name: "Thyra TV Unit",
    type: "TV Unit",
    price: "₹18,990",
    image: tvUnit,
    isNew: false,
  },
  {
    name: "Riva Floor Lamp",
    type: "Floor Lamp",
    price: "₹4,990",
    image: floorLamp,
    isNew: false,
  },
  {
    name: "Vetra Storage Cabinet",
    type: "Storage Cabinet",
    price: "₹19,990",
    image: storageCabinet,
    isNew: false,
  },
];



const benefits = [
  {
    title: "Free Delivery",
    description: "On orders above ₹15,000",
    icon: Truck,
  },
  {
    title: "Expert Support",
    description: "Help whenever you need",
    icon: Headphones,
  },
  {
    title: "Quality Assurance",
    description: "Premium selected products",
    icon: ShieldCheck,
  },
  {
    title: "Secure Payments",
    description: "100% secure checkout",
    icon: LockKeyhole,
  },
  {
    title: "Design Support",
    description: "Expert interior advice",
    icon: UserRound,
  },
];



type Product = {
  name: string;
  type: string;
  price: string;
  image: string;
  isNew: boolean;
};

type ProductCardProps = {
  product: Product;
  mobile?: boolean;
};



const NewArrivals = () => {
  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-[#FAF8F5]
        py-3
        sm:py-4
        lg:py-5
      "
    >
     

      <div
        className="
          mx-auto
          w-full
          max-w-350
          px-4
          sm:px-6
          lg:px-8
        "
      >
        

        <div
          className="
            mb-7
            flex
            items-end
            justify-between
            sm:mb-8
            lg:mb-9
          "
        >
          <div>
            {/* Eyebrow */}

            <div className="mb-2 flex items-center gap-3">
              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#B18343]
                  sm:text-[10px]
                "
              >
                Just In
              </span>

              <span className="h-px w-7 bg-[#D2B27D]" />
            </div>

            {/* Heading */}

            <h2
              className="
                font-serif
                text-[32px]
                font-medium
                leading-none
                tracking-[-0.035em]
                text-[#1C1B19]
                sm:text-[37px]
                lg:text-[41px]
              "
            >
              New Arrivals
            </h2>
          </div>

          {/* View All */}

          <button
            className="
              group
              flex
              shrink-0
              items-center
              gap-2
              border-b
              border-transparent
              pb-1
              text-[10px]
              font-medium
              text-[#37332E]
              transition-all
              duration-300
              hover:border-[#B58A4A]
              hover:text-[#9A7138]
              sm:text-[11px]
              lg:text-[12px]
            "
          >
            <span>View all new arrivals</span>

            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>

       

        <div className="w-full min-w-0">
          

          <div
            className="
              flex
              w-full
              min-w-0
              gap-4
              overflow-x-auto
              pb-4
              scrollbar-none
              sm:hidden
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                mobile
              />
            ))}
          </div>


          <div
            className="
              hidden
              w-full
              min-w-0
              grid-cols-2
              gap-4
              sm:grid
              lg:hidden
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}
          </div>


          <div
            className="
              hidden
              w-full
              min-w-0
              grid-cols-6
              gap-4
              lg:grid
              xl:gap-5
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="
          mx-auto
          mt-12
          w-full
          max-w-350
          px-4
          sm:mt-14
          sm:px-6
          lg:mt-16
          lg:px-8
        "
      >
        <div
          className="
            w-full
            overflow-hidden
            rounded-[14px]
            border
            border-[#E0D6C8]
            bg-[#F3EEE6]
            shadow-[0_8px_30px_rgba(56,44,31,0.035)]
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-1
              divide-y
              divide-[#DDD2C4]
              sm:grid-cols-2
              sm:divide-x
              sm:divide-y-0
              lg:grid-cols-5
            "
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="
                    group
                    flex
                    min-w-0
                    items-center
                    gap-3
                    px-5
                    py-4
                    transition-colors
                    duration-300
                    hover:bg-[#F8F4ED]
                    sm:px-5
                    sm:py-5
                    lg:min-h-21
                    lg:px-5
                    xl:px-6
                  "
                >
                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D7C9B8]
                      bg-[#FAF8F5]
                      text-[#62584D]
                      transition-all
                      duration-300
                      group-hover:border-[#C7A46B]
                      group-hover:bg-white
                      group-hover:text-[#A47D3C]
                    "
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.45}
                    />
                  </div>

                  {/* Text */}

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-[10px]
                        font-semibold
                        text-[#2C2925]
                        sm:text-[11px]
                      "
                    >
                      {benefit.title}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[8px]
                        leading-tight
                        text-[#83786C]
                        sm:text-[9px]
                      "
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};


const ProductCard = ({
  product,
  mobile = false,
}: ProductCardProps) => {
  return (
    <article
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[13px]
        border
        border-[#E4DCCF]
        bg-white
        shadow-[0_2px_8px_rgba(45,37,29,0.025)]
        transition-all
        duration-500
        ease-out
        hover:-translate-y-1
        hover:border-[#D4C2A7]
        hover:shadow-[0_16px_35px_rgba(54,43,31,0.09)]

        ${
          mobile
            ? "w-[78vw] max-w-75 shrink-0"
            : "w-full"
        }
      `}
    >
      

      <div
        className="
          relative
          h-52.5
          w-full
          overflow-hidden
          bg-[#F5F1EB]
          sm:h-57.5
          lg:h-52.5
          xl:h-56.25
        "
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="
            block
            h-full
            w-full
            object-contain
            object-center
            p-0
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.025]
          "
        />

        {/* Soft image overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-black/2.5
            via-transparent
            to-white/6
          "
        />


        {product.isNew && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-[#DCA63F]
              px-2.5
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.13em]
              text-white
              shadow-[0_4px_12px_rgba(115,77,22,0.15)]
            "
          >
            New
          </span>
        )}


        <button
          aria-label={`Add ${product.name} to wishlist`}
          className="
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#E4DBCF]
            bg-[#FAF8F5]/95
            text-[#3C3935]
            shadow-[0_5px_16px_rgba(0,0,0,0.06)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:border-[#CDB48F]
            hover:bg-white
            hover:text-[#A47D3C]
          "
        >
          <Heart
            size={16}
            strokeWidth={1.6}
          />
        </button>
      </div>


      <div
        className="
          min-w-0
          bg-white
          px-4
          pb-4
          pt-4
          sm:px-4
          sm:pb-5
          sm:pt-4
        "
      >
        {/* Product type */}

        <p
          className="
            truncate
            text-[8px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-[#9A8F82]
            sm:text-[9px]
          "
        >
          {product.type}
        </p>

        {/* Product name */}

        <h3
          className="
            mt-1.5
            truncate
            text-[13px]
            font-semibold
            leading-tight
            tracking-[-0.01em]
            text-[#24221F]
            sm:text-[14px]
          "
        >
          {product.name}
        </h3>

        {/* Price */}

        <p
          className="
            mt-2.5
            text-[14px]
            font-semibold
            tracking-[-0.01em]
            text-[#171614]
            sm:text-[15px]
          "
        >
          {product.price}
        </p>
      </div>


      <span
        className="
          absolute
          bottom-0
          left-0
          h-0.5
          w-0
          bg-[#B99051]
          transition-all
          duration-500
          group-hover:w-full
        "
      />
    </article>
  );
};

export default NewArrivals;