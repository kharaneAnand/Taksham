import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronRight,
  Edit,
  FolderPlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  Category,
  Subcategory,
} from "../../types/category";

import {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  getCategories,
  updateCategory,
  updateSubcategory,
} from "../../api/category.api";

/*
 * ========================================
 * HELPERS
 * ========================================
 */

const createSlug = (
  value: string,
): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/*
 * ========================================
 * COMPONENT
 * ========================================
 */

const AdminCategories = () => {
  /*
   * ========================================
   * DATA STATE
   * ========================================
   */

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [expandedCategories, setExpandedCategories] =
    useState<Set<string>>(
      new Set(),
    );

  /*
   * ========================================
   * CATEGORY MODAL STATE
   * ========================================
   */

  const [categoryModalOpen, setCategoryModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(
      null,
    );

  const [categoryName, setCategoryName] =
    useState("");

  const [categorySlug, setCategorySlug] =
    useState("");

  /*
   * ========================================
   * SUBCATEGORY MODAL STATE
   * ========================================
   */

  const [
    subcategoryModalOpen,
    setSubcategoryModalOpen,
  ] = useState(false);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<Category | null>(
    null,
  );

  const [
    editingSubcategory,
    setEditingSubcategory,
  ] = useState<Subcategory | null>(
    null,
  );

  const [
    subcategoryName,
    setSubcategoryName,
  ] = useState("");

  const [
    subcategorySlug,
    setSubcategorySlug,
  ] = useState("");

  /*
   * ========================================
   * ACTION STATE
   * ========================================
   */

  const [submitting, setSubmitting] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  /*
   * ========================================
   * FETCH CATEGORIES
   * ========================================
   */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCategories();

      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /*
   * ========================================
   * FILTERED CATEGORIES
   * ========================================
   */

  const filteredCategories =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return categories;
      }

      return categories.filter(
        (category) => {
          const categoryMatches =
            category.name
              .toLowerCase()
              .includes(query) ||
            category.slug
              .toLowerCase()
              .includes(query);

          const subcategoryMatches =
            category.subcategories.some(
              (subcategory) =>
                subcategory.name
                  .toLowerCase()
                  .includes(query) ||
                subcategory.slug
                  .toLowerCase()
                  .includes(query),
            );

          return (
            categoryMatches ||
            subcategoryMatches
          );
        },
      );
    }, [
      categories,
      search,
    ]);

  /*
   * ========================================
   * EXPAND CATEGORY
   * ========================================
   */

  const toggleCategory = (
    categoryId: string,
  ) => {
    setExpandedCategories(
      (previous) => {
        const next =
          new Set(previous);

        if (next.has(categoryId)) {
          next.delete(categoryId);
        } else {
          next.add(categoryId);
        }

        return next;
      },
    );
  };

  /*
   * ========================================
   * OPEN CREATE CATEGORY
   * ========================================
   */

  const openCreateCategory = () => {
    setEditingCategory(null);

    setCategoryName("");
    setCategorySlug("");

    setActionError("");

    setCategoryModalOpen(true);
  };

  /*
   * ========================================
   * OPEN EDIT CATEGORY
   * ========================================
   */

  const openEditCategory = (
    category: Category,
  ) => {
    setEditingCategory(category);

    setCategoryName(category.name);
    setCategorySlug(category.slug);

    setActionError("");

    setCategoryModalOpen(true);
  };

  /*
   * ========================================
   * CLOSE CATEGORY MODAL
   * ========================================
   */

  const closeCategoryModal = () => {
    if (submitting) {
      return;
    }

    setCategoryModalOpen(false);

    setEditingCategory(null);

    setCategoryName("");
    setCategorySlug("");

    setActionError("");
  };

  /*
   * ========================================
   * SAVE CATEGORY
   * ========================================
   */

  const handleSaveCategory =
    async () => {
      const name =
        categoryName.trim();

      const slug =
        categorySlug.trim();

      if (!name || !slug) {
        setActionError(
          "Category name and slug are required",
        );

        return;
      }

      try {
        setSubmitting(true);
        setActionError("");

        if (editingCategory) {
          await updateCategory(
            editingCategory._id,
            {
              name,
              slug,
            },
          );
        } else {
          await createCategory({
            name,
            slug,
          });
        }

        await fetchCategories();

        closeCategoryModal();
      } catch (err) {
        setActionError(
          err instanceof Error
            ? err.message
            : "Failed to save category",
        );
      } finally {
        setSubmitting(false);
      }
    };

  /*
   * ========================================
   * DELETE CATEGORY
   * ========================================
   */

  const handleDeleteCategory =
    async (
      category: Category,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${category.name}"?\n\nAll its subcategories will also be deleted.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionError("");

        await deleteCategory(
          category._id,
        );

        await fetchCategories();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete category",
        );
      }
    };

  /*
   * ========================================
   * OPEN CREATE SUBCATEGORY
   * ========================================
   */

  const openCreateSubcategory = (
    category: Category,
  ) => {
    setSelectedCategory(category);

    setEditingSubcategory(null);

    setSubcategoryName("");
    setSubcategorySlug("");

    setActionError("");

    setSubcategoryModalOpen(true);
  };

  /*
   * ========================================
   * OPEN EDIT SUBCATEGORY
   * ========================================
   */

  const openEditSubcategory = (
    category: Category,
    subcategory: Subcategory,
  ) => {
    setSelectedCategory(category);

    setEditingSubcategory(
      subcategory,
    );

    setSubcategoryName(
      subcategory.name,
    );

    setSubcategorySlug(
      subcategory.slug,
    );

    setActionError("");

    setSubcategoryModalOpen(true);
  };

  /*
   * ========================================
   * CLOSE SUBCATEGORY MODAL
   * ========================================
   */

  const closeSubcategoryModal = () => {
    if (submitting) {
      return;
    }

    setSubcategoryModalOpen(false);

    setSelectedCategory(null);

    setEditingSubcategory(null);

    setSubcategoryName("");
    setSubcategorySlug("");

    setActionError("");
  };

  /*
   * ========================================
   * SAVE SUBCATEGORY
   * ========================================
   */

  const handleSaveSubcategory =
    async () => {
      if (!selectedCategory) {
        return;
      }

      const name =
        subcategoryName.trim();

      const slug =
        subcategorySlug.trim();

      if (!name || !slug) {
        setActionError(
          "Subcategory name and slug are required",
        );

        return;
      }

      try {
        setSubmitting(true);
        setActionError("");

        if (editingSubcategory) {
          await updateSubcategory(
            selectedCategory._id,
            editingSubcategory._id,
            {
              name,
              slug,
            },
          );
        } else {
          await createSubcategory(
            selectedCategory._id,
            {
              name,
              slug,
            },
          );
        }

        await fetchCategories();

        setExpandedCategories(
          (previous) =>
            new Set([
              ...previous,
              selectedCategory._id,
            ]),
        );

        closeSubcategoryModal();
      } catch (err) {
        setActionError(
          err instanceof Error
            ? err.message
            : "Failed to save subcategory",
        );
      } finally {
        setSubmitting(false);
      }
    };

  /*
   * ========================================
   * DELETE SUBCATEGORY
   * ========================================
   */

  const handleDeleteSubcategory =
    async (
      category: Category,
      subcategory: Subcategory,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${subcategory.name}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionError("");

        await deleteSubcategory(
          category._id,
          subcategory._id,
        );

        await fetchCategories();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete subcategory",
        );
      }
    };

  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage product categories
            and subcategories.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreateCategory
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />

          Add Category
        </button>

      </div>

      {/* SEARCH */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search categories..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="flex min-h-75  items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-slate-500"
          />
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredCategories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <FolderPlus
              size={38}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first product
              category to get started.
            </p>

            <button
              type="button"
              onClick={
                openCreateCategory
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus size={17} />

              Add Category
            </button>

          </div>
        )}

      {/* CATEGORY LIST */}

      {!loading &&
        filteredCategories.length > 0 && (
          <div className="space-y-4">

            {filteredCategories.map(
              (category) => {
                const isExpanded =
                  expandedCategories.has(
                    category._id,
                  );

                return (
                  <div
                    key={category._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >

                    {/* CATEGORY HEADER */}

                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                      <button
                        type="button"
                        onClick={() =>
                          toggleCategory(
                            category._id,
                          )
                        }
                        className="flex min-w-0 items-center gap-4 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                          {isExpanded ? (
                            <ChevronDown
                              size={20}
                            />
                          ) : (
                            <ChevronRight
                              size={20}
                            />
                          )}

                        </div>

                        <div className="min-w-0">

                          <h2 className="truncate font-semibold text-slate-900">
                            {category.name}
                          </h2>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                            <span>
                              {category.slug}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {
                                category
                                  .subcategories
                                  .length
                              }{" "}
                              subcategories
                            </span>

                          </div>

                        </div>

                      </button>

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openCreateSubcategory(
                              category,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Plus size={16} />

                          Subcategory
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditCategory(
                              category,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                          aria-label="Edit category"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCategory(
                              category,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                          aria-label="Delete category"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                      </div>

                    </div>

                    {/* SUBCATEGORIES */}

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50 p-5">

                        {category
                          .subcategories
                          .length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">

                            <p className="text-sm text-slate-500">
                              No subcategories yet.
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                openCreateSubcategory(
                                  category,
                                )
                              }
                              className="mt-3 text-sm font-medium text-slate-900 hover:underline"
                            >
                              Add one now
                            </button>

                          </div>
                        ) : (
                          <div className="space-y-2">

                            {category.subcategories.map(
                              (
                                subcategory,
                              ) => (
                                <div
                                  key={
                                    subcategory._id
                                  }
                                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                                >

                                  <div>

                                    <p className="text-sm font-medium text-slate-800">
                                      {
                                        subcategory.name
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                      {
                                        subcategory.slug
                                      }
                                    </p>

                                  </div>

                                  <div className="flex items-center gap-2">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openEditSubcategory(
                                          category,
                                          subcategory,
                                        )
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                      <Edit
                                        size={
                                          15
                                        }
                                      />

                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteSubcategory(
                                          category,
                                          subcategory,
                                        )
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2
                                        size={
                                          15
                                        }
                                      />

                                      Delete
                                    </button>

                                  </div>

                                </div>
                              ),
                            )}

                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              },
            )}

          </div>
        )}

      {/* CATEGORY MODAL */}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a product category.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeCategoryModal
                }
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="mt-6 space-y-5">

              {actionError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {actionError}
                </div>
              )}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category Name
                </label>

                <input
                  value={categoryName}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setCategoryName(value);

                    if (
                      !editingCategory
                    ) {
                      setCategorySlug(
                        createSlug(value),
                      );
                    }
                  }}
                  placeholder="Furniture"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Slug
                </label>

                <input
                  value={categorySlug}
                  onChange={(event) =>
                    setCategorySlug(
                      createSlug(
                        event.target.value,
                      ),
                    )
                  }
                  placeholder="furniture"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                type="button"
                onClick={
                  closeCategoryModal
                }
                disabled={submitting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveCategory
                }
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >

                {submitting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {editingCategory
                  ? "Save Changes"
                  : "Create Category"}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* SUBCATEGORY MODAL */}

      {subcategoryModalOpen &&
        selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    {editingSubcategory
                      ? "Edit Subcategory"
                      : "Add Subcategory"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Category:{" "}
                    <span className="font-medium text-slate-700">
                      {
                        selectedCategory.name
                      }
                    </span>
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    closeSubcategoryModal
                  }
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="mt-6 space-y-5">

                {actionError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {actionError}
                  </div>
                )}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Subcategory Name
                  </label>

                  <input
                    value={
                      subcategoryName
                    }
                    onChange={(
                      event,
                    ) => {
                      const value =
                        event.target.value;

                      setSubcategoryName(
                        value,
                      );

                      if (
                        !editingSubcategory
                      ) {
                        setSubcategorySlug(
                          createSlug(
                            value,
                          ),
                        );
                      }
                    }}
                    placeholder="Sofas"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Slug
                  </label>

                  <input
                    value={
                      subcategorySlug
                    }
                    onChange={(
                      event,
                    ) =>
                      setSubcategorySlug(
                        createSlug(
                          event.target
                            .value,
                        ),
                      )
                    }
                    placeholder="sofas"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />

                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={
                    closeSubcategoryModal
                  }
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveSubcategory
                  }
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >

                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingSubcategory
                    ? "Save Changes"
                    : "Add Subcategory"}

                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default AdminCategories;