import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  createProduct,
  type CreateProductPayload,
  type CreateProductVariantPayload,
} from "../../api/product.api";

import {
  createCategory,
  createSubcategory,
  getCategories,
} from "../../api/category.api";

import {
  uploadProductImage,
  uploadProductImages,
} from "../../api/media.api";

import type {
  ProductImage,
} from "../../types/product";

import type {
  Category,
} from "../../types/category";

/*
 * ========================================
 * Local Variant Form Type
 * ========================================
 */

interface VariantFormData {
  color: string;

  price: string;

  stock: string;

  material: string;

  images: ProductImage[];

  files: File[];
}

/*
 * ========================================
 * Component
 * ========================================
 */

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [uploadingMainImage, setUploadingMainImage] =
    useState(false);

  const [uploadingGallery, setUploadingGallery] =
    useState(false);

  /*
   * ========================================
   * CATEGORY STATES
   * ========================================
   */

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [newCategoryName, setNewCategoryName] =
    useState("");

  const [
    newSubcategoryName,
    setNewSubcategoryName,
  ] = useState("");

  const [creatingCategory, setCreatingCategory] =
    useState(false);

  const [
    creatingSubcategory,
    setCreatingSubcategory,
  ] = useState(false);

  /*
   * ========================================
   * PRODUCT FORM
   * ========================================
   */

  const [formData, setFormData] =
    useState({
      name: "",
      slug: "",
      price: "",
      category: "",
      subcategory: "",
      room: "",
      material: "",
      colors: [] as string[],
      description: "",
      stock: "",
      isNewProduct: false,
    });

  /*
   * ========================================
   * MAIN COVER IMAGE
   * ========================================
   */

  const [mainImage, setMainImage] =
    useState<ProductImage | null>(
      null,
    );

  /*
   * ========================================
   * COMMON PRODUCT GALLERY
   * ========================================
   */

  const [images, setImages] =
    useState<ProductImage[]>([]);

  /*
   * ========================================
   * COLORS
   * ========================================
   */

  const [colorInput, setColorInput] =
    useState("");

  /*
   * ========================================
   * VARIANTS
   * ========================================
   */

  const [variants, setVariants] =
    useState<VariantFormData[]>([]);

  /*
   * ========================================
   * SLUG GENERATOR
   * ========================================
   */

  const generateSlug = (
    value: string,
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        "",
      )
      .replace(
        /\s+/g,
        "-",
      )
      .replace(
        /-+/g,
        "-",
      );
  };

  /*
   * ========================================
   * LOAD CATEGORIES
   * ========================================
   */

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const data =
        await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load categories",
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  /*
   * ========================================
   * SELECTED CATEGORY
   * ========================================
   */

  const selectedCategory =
    categories.find(
      (category) =>
        category.slug ===
        formData.category,
    ) ?? null;

  /*
   * ========================================
   * CREATE CATEGORY
   * ========================================
   */

  const handleCreateCategory = async () => {
    const name =
      newCategoryName.trim();

    if (!name) {
      toast.error(
        "Please enter a category name",
      );

      return;
    }

    const slug =
      generateSlug(name);

    if (!slug) {
      toast.error(
        "Please enter a valid category name",
      );

      return;
    }

    try {
      setCreatingCategory(true);

      const category =
        await createCategory({
          name,
          slug,
        });

      setCategories((current) => [
        ...current,
        category,
      ]);

      setFormData((current) => ({
        ...current,
        category: category.slug,
        subcategory: "",
      }));

      setNewCategoryName("");

      toast.success(
        "Category added successfully",
      );
    } catch (error) {
      console.error(
        "Failed to create category:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category",
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  /*
   * ========================================
   * CREATE SUBCATEGORY
   * ========================================
   */

  const handleCreateSubcategory = async () => {
    const name =
      newSubcategoryName.trim();

    if (!selectedCategory) {
      toast.error(
        "Please select a category first",
      );

      return;
    }

    if (!name) {
      toast.error(
        "Please enter a subcategory name",
      );

      return;
    }

    const slug =
      generateSlug(name);

    if (!slug) {
      toast.error(
        "Please enter a valid subcategory name",
      );

      return;
    }

    try {
      setCreatingSubcategory(true);

      const updatedCategory =
        await createSubcategory(
          selectedCategory._id,
          {
            name,
            slug,
          },
        );

      setCategories((current) =>
        current.map(
          (category) =>
            category._id ===
            updatedCategory._id
              ? updatedCategory
              : category,
        ),
      );

      setFormData((current) => ({
        ...current,
        subcategory: slug,
      }));

      setNewSubcategoryName("");

      toast.success(
        "Subcategory added successfully",
      );
    } catch (error) {
      console.error(
        "Failed to create subcategory:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create subcategory",
      );
    } finally {
      setCreatingSubcategory(false);
    }
  };

  /*
   * ========================================
   * INPUT CHANGE
   * ========================================
   */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    if (name === "name") {
      setFormData((current) => ({
        ...current,
        name: value,
        slug: generateSlug(value),
      }));

      return;
    }

    if (type === "checkbox") {
      const checked =
        (
          event.target as HTMLInputElement
        ).checked;

      setFormData((current) => ({
        ...current,
        [name]: checked,
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * ========================================
   * MAIN IMAGE UPLOAD
   * ========================================
   */

  const handleMainImageUpload = async (
    event: React.ChangeEvent<
      HTMLInputElement
    >,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingMainImage(true);

      const uploadedImage =
        await uploadProductImage(
          file,
        );

      setMainImage(
        uploadedImage,
      );

      toast.success(
        "Main image uploaded",
      );
    } catch (error) {
      console.error(
        "Main image upload failed:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Main image upload failed",
      );
    } finally {
      setUploadingMainImage(false);

      event.target.value = "";
    }
  };

  /*
   * ========================================
   * GALLERY IMAGE UPLOAD
   * ========================================
   */

  const handleGalleryUpload = async (
    event: React.ChangeEvent<
      HTMLInputElement
    >,
  ) => {
    const files =
      Array.from(
        event.target.files ?? [],
      );

    if (files.length === 0) {
      return;
    }

    try {
      setUploadingGallery(true);

      const uploadedImages =
        await uploadProductImages(
          files,
        );

      setImages((current) => [
        ...current,
        ...uploadedImages,
      ]);

      toast.success(
        `${uploadedImages.length} image${
          uploadedImages.length === 1
            ? ""
            : "s"
        } uploaded`,
      );
    } catch (error) {
      console.error(
        "Gallery upload failed:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Gallery upload failed",
      );
    } finally {
      setUploadingGallery(false);

      event.target.value = "";
    }
  };

  /*
   * ========================================
   * REMOVE GALLERY IMAGE
   * ========================================
   */

  const removeGalleryImage = (
    index: number,
  ) => {
    setImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  /*
   * ========================================
   * COLORS
   * ========================================
   */

  const addColor = () => {
    const color =
      colorInput.trim();

    if (!color) {
      return;
    }

    const alreadyExists =
      formData.colors.some(
        (item) =>
          item.toLowerCase() ===
          color.toLowerCase(),
      );

    if (alreadyExists) {
      toast.error(
        "This color is already added",
      );

      return;
    }

    setFormData((current) => ({
      ...current,
      colors: [
        ...current.colors,
        color,
      ],
    }));

    setColorInput("");
  };

  const removeColor = (
    color: string,
  ) => {
    setFormData((current) => ({
      ...current,
      colors:
        current.colors.filter(
          (item) =>
            item !== color,
        ),
    }));
  };

  /*
   * ========================================
   * VARIANTS
   * ========================================
   */

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        color: "",
        price: "",
        stock: "",
        material: "",
        images: [],
        files: [],
      },
    ]);
  };

  const removeVariant = (
    index: number,
  ) => {
    setVariants((current) =>
      current.filter(
        (_, variantIndex) =>
          variantIndex !== index,
      ),
    );
  };

  const updateVariant = (
    index: number,
    field:
      | "color"
      | "price"
      | "stock"
      | "material",
    value: string,
  ) => {
    setVariants((current) =>
      current.map(
        (variant, variantIndex) =>
          variantIndex === index
            ? {
                ...variant,
                [field]: value,
              }
            : variant,
      ),
    );
  };

  /*
   * ========================================
   * VARIANT IMAGE UPLOAD
   * ========================================
   */

  const handleVariantImageUpload = async (
    index: number,
    event: React.ChangeEvent<
      HTMLInputElement
    >,
  ) => {
    const files =
      Array.from(
        event.target.files ?? [],
      );

    if (files.length === 0) {
      return;
    }

    try {
      const uploadedImages =
        await uploadProductImages(
          files,
        );

      setVariants((current) =>
        current.map(
          (variant, variantIndex) =>
            variantIndex === index
              ? {
                  ...variant,
                  images: [
                    ...variant.images,
                    ...uploadedImages,
                  ],
                }
              : variant,
        ),
      );

      toast.success(
        "Variant images uploaded",
      );
    } catch (error) {
      console.error(
        "Variant image upload failed:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Variant image upload failed",
      );
    } finally {
      event.target.value = "";
    }
  };

  /*
   * ========================================
   * REMOVE VARIANT IMAGE
   * ========================================
   */

  const removeVariantImage = (
    variantIndex: number,
    imageIndex: number,
  ) => {
    setVariants((current) =>
      current.map(
        (variant, currentVariantIndex) =>
          currentVariantIndex ===
          variantIndex
            ? {
                ...variant,
                images:
                  variant.images.filter(
                    (
                      _,
                      currentImageIndex,
                    ) =>
                      currentImageIndex !==
                      imageIndex,
                  ),
              }
            : variant,
      ),
    );
  };

  /*
   * ========================================
   * SUBMIT
   * ========================================
   */

  const handleSubmit = async (
    event: React.FormEvent<
      HTMLFormElement
    >,
  ) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.slug.trim() ||
      !formData.price.trim() ||
      !formData.category.trim() ||
      !formData.room.trim() ||
      !formData.stock.trim()
    ) {
      toast.error(
        "Please fill all required fields",
      );

      return;
    }

    if (!mainImage) {
      toast.error(
        "Please upload a main product image",
      );

      return;
    }

    const price =
      Number(formData.price);

    const stock =
      Number(formData.stock);

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      toast.error(
        "Please enter a valid price",
      );

      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      toast.error(
        "Please enter a valid stock quantity",
      );

      return;
    }

    for (
      let index = 0;
      index < variants.length;
      index += 1
    ) {
      const variant =
        variants[index];

      if (
        variant.images.length === 0
      ) {
        toast.error(
          `Variant ${
            index + 1
          } must have at least one image`,
        );

        return;
      }

      if (
        variant.price !== "" &&
        (
          Number.isNaN(
            Number(variant.price),
          ) ||
          Number(variant.price) < 0
        )
      ) {
        toast.error(
          `Please enter a valid price for variant ${
            index + 1
          }`,
        );

        return;
      }

      if (
        variant.stock !== "" &&
        (
          Number.isNaN(
            Number(variant.stock),
          ) ||
          Number(variant.stock) < 0 ||
          !Number.isInteger(
            Number(variant.stock),
          )
        )
      ) {
        toast.error(
          `Please enter a valid stock for variant ${
            index + 1
          }`,
        );

        return;
      }
    }

    try {
      setLoading(true);

      const formattedVariants:
        CreateProductVariantPayload[] =
        variants.map(
          (variant) => ({
            ...(variant.color.trim()
              ? {
                  color:
                    variant.color.trim(),
                }
              : {}),

            images:
              variant.images,

            ...(variant.price !== ""
              ? {
                  price: Number(
                    variant.price,
                  ),
                }
              : {}),

            ...(variant.stock !== ""
              ? {
                  stock: Number(
                    variant.stock,
                  ),
                }
              : {}),

            ...(variant.material.trim()
              ? {
                  material:
                    variant.material.trim(),
                }
              : {}),
          }),
        );

      const payload:
        CreateProductPayload = {
        name:
          formData.name.trim(),

        slug:
          formData.slug.trim(),

        price,

        image:
          mainImage,

        ...(images.length > 0
          ? {
              images,
            }
          : {}),

        category:
          formData.category.trim(),

        room:
          formData.room.trim(),

        stock,

        isNewProduct:
          formData.isNewProduct,

        ...(formData.subcategory.trim()
          ? {
              subcategory:
                formData.subcategory.trim(),
            }
          : {}),

        ...(formData.material.trim()
          ? {
              material:
                formData.material.trim(),
            }
          : {}),

        ...(formData.colors.length > 0
          ? {
              colors:
                formData.colors,
            }
          : {}),

        ...(formData.description.trim()
          ? {
              description:
                formData.description.trim(),
            }
          : {}),

        ...(formattedVariants.length > 0
          ? {
              variants:
                formattedVariants,
            }
          : {}),
      };

      await createProduct(
        payload,
      );

      toast.success(
        "Product created successfully",
      );

      navigate(
        "/admin/products",
      );
    } catch (error) {
      console.error(
        "Failed to create product:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create product",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products",
              )
            }
            className="
              flex
              items-center
              gap-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#8A8075]
              transition
              hover:text-[#8F6B3F]
            "
          >
            <ArrowLeft size={14} />

            Back to Products
          </button>

          <p
            className="
              mt-7
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#A4773E]
            "
          >
            Catalogue
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-[34px]
              leading-none
              tracking-[-0.045em]
              text-[#302B25]
              sm:text-[40px]
            "
          >
            Add Product
          </h1>

          <p
            className="
              mt-3
              text-[10px]
              text-[#81776C]
            "
          >
            Add a new product with multiple views and
            color-specific images.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* PRODUCT INFORMATION */}

        <section
          className="
            rounded-[20px]
            border
            border-[#E2DAD0]
            bg-white
            p-5
            sm:p-6
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#A4773E]
            "
          >
            Product Information
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-[24px]
              text-[#302B25]
            "
          >
            The essentials
          </h2>

          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >
            {/* NAME */}

            <label className="block">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Product Name *
              </span>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Modern Nanded Sofa"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* SLUG */}

            <label className="block">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Product Slug *
              </span>

              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="modern-nanded-sofa"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* PRICE */}

            <label className="block">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Price *
              </span>

              <input
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="4999"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* STOCK */}

            <label className="block">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Stock *
              </span>

              <input
                type="number"
                min="0"
                step="1"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* CATEGORY */}

            <div className="md:col-span-2">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Category *
              </span>

              <div
                className="
                  mt-2
                  grid
                  gap-3
                  md:grid-cols-[1fr_auto]
                "
              >
                <select
                  value={formData.category}
                  disabled={loadingCategories}
                  onChange={(event) => {
                    const categorySlug =
                      event.target.value;

                    setFormData((current) => ({
                      ...current,
                      category: categorySlug,
                      subcategory: "",
                    }));
                  }}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DED5CB]
                    bg-[#FCFBF9]
                    px-4
                    text-[11px]
                    text-[#302B25]
                    outline-none
                    transition
                    focus:border-[#A4773E]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category._id}
                        value={category.slug}
                      >
                        {category.name}
                      </option>
                    ),
                  )}
                </select>

                <div
                  className="
                    flex
                    gap-2
                  "
                >
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(event) =>
                      setNewCategoryName(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter"
                      ) {
                        event.preventDefault();
                        void handleCreateCategory();
                      }
                    }}
                    placeholder="New category"
                    className="
                      h-12
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-[#DED5CB]
                      bg-[#FCFBF9]
                      px-4
                      text-[10px]
                      text-[#302B25]
                      outline-none
                      focus:border-[#A4773E]
                      md:w-48
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      void handleCreateCategory()
                    }
                    disabled={
                      creatingCategory ||
                      !newCategoryName.trim()
                    }
                    className="
                      flex
                      h-12
                      shrink-0
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#D4B58D]
                      bg-[#F8F0E5]
                      px-4
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#8F6B3F]
                      transition
                      hover:bg-[#F2E5D4]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {creatingCategory ? (
                      <Loader2
                        size={13}
                        className="animate-spin"
                      />
                    ) : (
                      <Plus size={13} />
                    )}

                    Add
                  </button>
                </div>
              </div>

              <p
                className="
                  mt-2
                  text-[8px]
                  text-[#9A9085]
                "
              >
                Select an existing category or create a
                new one.
              </p>
            </div>

            {/* SUBCATEGORY */}

            <div className="md:col-span-2">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Subcategory
              </span>

              <div
                className="
                  mt-2
                  grid
                  gap-3
                  md:grid-cols-[1fr_auto]
                "
              >
                <select
                  value={formData.subcategory}
                  disabled={!selectedCategory}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      subcategory:
                        event.target.value,
                    }))
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DED5CB]
                    bg-[#FCFBF9]
                    px-4
                    text-[11px]
                    text-[#302B25]
                    outline-none
                    transition
                    focus:border-[#A4773E]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <option value="">
                    {!selectedCategory
                      ? "Select a category first"
                      : "Select subcategory"}
                  </option>

                  {selectedCategory?.subcategories.map(
                    (subcategory) => (
                      <option
                        key={subcategory._id}
                        value={subcategory.slug}
                      >
                        {subcategory.name}
                      </option>
                    ),
                  )}
                </select>

                <div
                  className="
                    flex
                    gap-2
                  "
                >
                  <input
                    type="text"
                    value={newSubcategoryName}
                    disabled={!selectedCategory}
                    onChange={(event) =>
                      setNewSubcategoryName(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter"
                      ) {
                        event.preventDefault();
                        void handleCreateSubcategory();
                      }
                    }}
                    placeholder="New subcategory"
                    className="
                      h-12
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-[#DED5CB]
                      bg-[#FCFBF9]
                      px-4
                      text-[10px]
                      text-[#302B25]
                      outline-none
                      focus:border-[#A4773E]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      md:w-48
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      void handleCreateSubcategory()
                    }
                    disabled={
                      creatingSubcategory ||
                      !selectedCategory ||
                      !newSubcategoryName.trim()
                    }
                    className="
                      flex
                      h-12
                      shrink-0
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#D4B58D]
                      bg-[#F8F0E5]
                      px-4
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#8F6B3F]
                      transition
                      hover:bg-[#F2E5D4]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {creatingSubcategory ? (
                      <Loader2
                        size={13}
                        className="animate-spin"
                      />
                    ) : (
                      <Plus size={13} />
                    )}

                    Add
                  </button>
                </div>
              </div>

              <p
                className="
                  mt-2
                  text-[8px]
                  text-[#9A9085]
                "
              >
                Subcategories are linked to the selected
                category.
              </p>
            </div>

            {/* ROOM */}

            <label className="block">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Room *
              </span>

              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="Living Room"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* MATERIAL */}

            <label className="block">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Material
              </span>

              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="Solid wood"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* DESCRIPTION */}

            <label className="block md:col-span-2">
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#756B60]
                "
              >
                Description
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the product..."
                className="
                  mt-2
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#DED5CB]
                  bg-[#FCFBF9]
                  px-4
                  py-3
                  text-[11px]
                  text-[#302B25]
                  outline-none
                  transition
                  focus:border-[#A4773E]
                "
              />
            </label>

            {/* NEW PRODUCT */}

            <label
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-[#E4DDD4]
                bg-[#FCFBF9]
                px-4
                py-3
              "
            >
              <input
                type="checkbox"
                name="isNewProduct"
                checked={
                  formData.isNewProduct
                }
                onChange={handleChange}
                className="
                  h-4
                  w-4
                  accent-[#8F6B3F]
                "
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#756B60]
                "
              >
                Mark as new product
              </span>
            </label>
          </div>
        </section>

        {/* COLORS */}

        <section
          className="
            rounded-[20px]
            border
            border-[#E2DAD0]
            bg-white
            p-5
            sm:p-6
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#A4773E]
            "
          >
            Colors
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-[24px]
              text-[#302B25]
            "
          >
            Available finishes
          </h2>

          <div
            className="
              mt-5
              flex
              gap-3
            "
          >
            <input
              type="text"
              value={colorInput}
              onChange={(event) =>
                setColorInput(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  event.preventDefault();
                  addColor();
                }
              }}
              placeholder="Black, Walnut, Cream..."
              className="
                h-11
                min-w-0
                flex-1
                rounded-xl
                border
                border-[#DED5CB]
                bg-[#FCFBF9]
                px-4
                text-[10px]
                outline-none
                focus:border-[#A4773E]
              "
            />

            <button
              type="button"
              onClick={addColor}
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-[#D4B58D]
                bg-[#F8F0E5]
                px-4
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#8F6B3F]
              "
            >
              <Plus size={13} />

              Add
            </button>
          </div>

          {formData.colors.length > 0 && (
            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              {formData.colors.map(
                (color) => (
                  <span
                    key={color}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#E2D7C9]
                      bg-[#FCF8F2]
                      px-3
                      py-1.5
                      text-[8px]
                      text-[#6E6257]
                    "
                  >
                    {color}

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(color)
                      }
                      className="
                        text-[#A46A60]
                        hover:text-red-600
                      "
                    >
                      <X size={11} />
                    </button>
                  </span>
                ),
              )}
            </div>
          )}
        </section>

        {/* MAIN IMAGE */}

        <section
          className="
            rounded-[20px]
            border
            border-[#E2DAD0]
            bg-white
            p-5
            sm:p-6
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#A4773E]
            "
          >
            Main Image
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-[24px]
              text-[#302B25]
            "
          >
            Cover image
          </h2>

          <div className="mt-5">
            {mainImage ? (
              <div
                className="
                  relative
                  aspect-square
                  max-w-65
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E2DAD0]
                  bg-[#F7F3EE]
                "
              >
                <img
                  src={mainImage.url}
                  alt="Product cover"
                  className="
                    h-full
                    w-full
                    object-contain
                    p-3
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setMainImage(null)
                  }
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[#A46A60]
                    shadow
                  "
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                className="
                  flex
                  min-h-45
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-[#D7CABB]
                  bg-[#FCF9F5]
                  px-6
                  text-center
                  transition
                  hover:border-[#A4773E]
                "
              >
                {uploadingMainImage ? (
                  <Loader2
                    size={24}
                    className="
                      animate-spin
                      text-[#A4773E]
                    "
                  />
                ) : (
                  <Upload
                    size={24}
                    className="
                      text-[#A4773E]
                    "
                  />
                )}

                <span
                  className="
                    mt-3
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[#756B60]
                  "
                >
                  {uploadingMainImage
                    ? "Uploading image..."
                    : "Upload main image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingMainImage}
                  onChange={
                    handleMainImageUpload
                  }
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        {/* GALLERY */}

        <section
          className="
            rounded-[20px]
            border
            border-[#E2DAD0]
            bg-white
            p-5
            sm:p-6
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#A4773E]
            "
          >
            Product Gallery
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-[24px]
              text-[#302B25]
            "
          >
            Additional views
          </h2>

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              md:grid-cols-4
            "
          >
            {images.map(
              (image, index) => (
                <div
                  key={`${image.publicId}-${index}`}
                  className="
                    relative
                    aspect-square
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#E4DDD4]
                    bg-[#FCFAF7]
                  "
                >
                  <img
                    src={image.url}
                    alt={`Product view ${
                      index + 1
                    }`}
                    className="
                      h-full
                      w-full
                      object-contain
                      p-2
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeGalleryImage(
                        index,
                      )
                    }
                    className="
                      absolute
                      right-2
                      top-2
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#A46A60]
                      shadow
                    "
                  >
                    <X size={12} />
                  </button>
                </div>
              ),
            )}

            <label
              className="
                flex
                aspect-square
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-[#D7CABB]
                bg-[#FCF9F5]
                transition
                hover:border-[#A4773E]
              "
            >
              {uploadingGallery ? (
                <Loader2
                  size={20}
                  className="
                    animate-spin
                    text-[#A4773E]
                  "
                />
              ) : (
                <ImagePlus
                  size={20}
                  className="
                    text-[#A4773E]
                  "
                />
              )}

              <span
                className="
                  mt-2
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#756B60]
                "
              >
                {uploadingGallery
                  ? "Uploading"
                  : "Add images"}
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploadingGallery}
                onChange={
                  handleGalleryUpload
                }
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* VARIANTS */}

        <section
          className="
            rounded-[20px]
            border
            border-[#E2DAD0]
            bg-white
            p-5
            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#A4773E]
                "
              >
                Variants
              </p>

              <h2
                className="
                  mt-2
                  font-serif
                  text-[24px]
                  text-[#302B25]
                "
              >
                Color-specific products
              </h2>

              <p
                className="
                  mt-2
                  text-[9px]
                  text-[#8A8178]
                "
              >
                Add different colors, prices, stock and
                images.
              </p>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#D4B58D]
                bg-[#F8F0E5]
                px-5
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#8F6B3F]
              "
            >
              <Plus size={13} />

              Add Variant
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {variants.map(
              (variant, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-[#E6DED5]
                    bg-[#FCFBF9]
                    p-4
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-[#A4773E]
                        "
                      >
                        Variant {index + 1}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          index,
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-[#A46A60]
                        hover:bg-red-50
                      "
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div
                    className="
                      mt-4
                      grid
                      gap-4
                      sm:grid-cols-2
                      lg:grid-cols-4
                    "
                  >
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "color",
                          event.target.value,
                        )
                      }
                      placeholder="Color"
                      className="
                        h-11
                        rounded-xl
                        border
                        border-[#DED5CB]
                        bg-white
                        px-4
                        text-[10px]
                        outline-none
                        focus:border-[#A4773E]
                      "
                    />

                    <input
                      type="number"
                      min="0"
                      value={variant.price}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "price",
                          event.target.value,
                        )
                      }
                      placeholder="Price"
                      className="
                        h-11
                        rounded-xl
                        border
                        border-[#DED5CB]
                        bg-white
                        px-4
                        text-[10px]
                        outline-none
                        focus:border-[#A4773E]
                      "
                    />

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variant.stock}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "stock",
                          event.target.value,
                        )
                      }
                      placeholder="Stock"
                      className="
                        h-11
                        rounded-xl
                        border
                        border-[#DED5CB]
                        bg-white
                        px-4
                        text-[10px]
                        outline-none
                        focus:border-[#A4773E]
                      "
                    />

                    <input
                      type="text"
                      value={variant.material}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "material",
                          event.target.value,
                        )
                      }
                      placeholder="Material"
                      className="
                        h-11
                        rounded-xl
                        border
                        border-[#DED5CB]
                        bg-white
                        px-4
                        text-[10px]
                        outline-none
                        focus:border-[#A4773E]
                      "
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      className="
                        flex
                        min-h-25
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        border-[#D7CABB]
                        bg-white
                        text-center
                        transition
                        hover:border-[#A4773E]
                      "
                    >
                      <ImagePlus
                        size={18}
                        className="
                          text-[#A4773E]
                        "
                      />

                      <span
                        className="
                          mt-2
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-[#756B60]
                        "
                      >
                        Upload variant images
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) =>
                          void handleVariantImageUpload(
                            index,
                            event,
                          )
                        }
                        className="hidden"
                      />
                    </label>

                    {variant.images.length > 0 && (
                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-2
                          gap-3
                          sm:grid-cols-4
                        "
                      >
                        {variant.images.map(
                          (
                            image,
                            imageIndex,
                          ) => (
                            <div
                              key={`${image.publicId}-${imageIndex}`}
                              className="
                                relative
                                aspect-square
                                overflow-hidden
                                rounded-lg
                                border
                                border-[#E4DDD4]
                                bg-white
                              "
                            >
                              <img
                                src={image.url}
                                alt={`Variant ${
                                  index + 1
                                }`}
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-2
                                "
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeVariantImage(
                                    index,
                                    imageIndex,
                                  )
                                }
                                className="
                                  absolute
                                  right-1.5
                                  top-1.5
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-white
                                  text-[#A46A60]
                                  shadow
                                "
                              >
                                <X size={11} />
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* ACTIONS */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            pb-8
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              navigate(
                "/admin/products",
              )
            }
            className="
              h-12
              rounded-xl
              border
              border-[#DDD3C7]
              px-6
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#756B60]
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              creatingCategory ||
              creatingSubcategory
            }
            className="
              flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#8F6B3F]
              px-7
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              shadow-[0_8px_20px_rgba(143,107,63,0.16)]
              transition
              hover:bg-[#795832]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />

                Creating Product
              </>
            ) : (
              <>
                <Check size={14} />

                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;