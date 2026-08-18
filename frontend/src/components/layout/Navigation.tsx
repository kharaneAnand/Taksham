import {
  NavLink,
} from "react-router-dom";

interface NavigationLink {
  label: string;
  path: string;
}

const navigationLinks: NavigationLink[] = [
  {
    label: "Shop by Room",
    path: "/rooms",
  },
  {
    label: "Shop by Product",
    path: "/products",
  },
  {
    label: "Collections",
    path: "/collections",
  },
  {
    label: "Ideas & Inspiration",
    path: "/ideas",
  },
  {
    label: "Interior Services",
    path: "/interior-services",
  },
  {
    label: "Projects",
    path: "/projects",
  },
  {
    label: "Offers",
    path: "/offers",
  },
];

const Navigation = () => {
  return (
    <nav className="bg-white">
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          px-6
        "
      >
        <ul
          className="
            ml-22
            flex
            items-center
            gap-12
          "
        >
          {navigationLinks.map(
            ({ label, path }) => (
              <li key={label}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `
                    relative
                    flex
                    items-center
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
                      isActive
                        ? `
                          text-black
                          after:w-full
                        `
                        : `
                          text-[#555]
                          after:w-0
                          hover:text-black
                          hover:after:w-full
                        `
                    }
                  `
                  }
                >
                  {label}
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;