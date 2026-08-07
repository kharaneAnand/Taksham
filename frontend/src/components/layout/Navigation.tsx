const navigationLinks = [
  "Shop by Room",
  "Shop by Product",
  "Collections",
  "Ideas & Inspiration",
  "Interior Services",
  "Projects",
  "Offers",
];

// Temporary active item
const active = "Shop by Product";

const Navigation = () => {
  return (
    <nav className="bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        {/* Offset for logo */}
        <ul className="ml-22 flex items-center gap-12">
          {navigationLinks.map((item) => (
            <li key={item}>
              <button
                className={`
                  relative
                  py-5
                  text-[15px]
                  font-medium
                  transition-all
                  duration-300
                  after:absolute
                  after:bottom-0
                  after:left-0
                  after:h-0.5
                  after:bg-[#D9B36A]
                  after:transition-all
                  after:duration-300
                  ${
                    item === active
                      ? "text-black after:w-full"
                      : "text-[#555] hover:text-black after:w-0 hover:after:w-full"
                  }
                `}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;