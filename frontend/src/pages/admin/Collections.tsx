import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Edit,
  FolderOpen,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import type {
  Collection,
} from "../../types/collection";

import {
  deleteCollection,
  getCollections,
} from "../../api/collectionApi";

const AdminCollections = () => {
  const navigate = useNavigate();

  const [
    collections,
    setCollections,
  ] = useState<Collection[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(null);

  /* ========================================
   * FETCH COLLECTIONS
   * ========================================
   */

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCollections();

      setCollections(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load collections",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  /* ========================================
   * DELETE COLLECTION
   * ========================================
   */

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this collection?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteCollection(id);

      setCollections(
        (currentCollections) =>
          currentCollections.filter(
            (collection) =>
              collection._id !== id,
          ),
      );
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete collection",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ========================================
   * LOADING
   * ========================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-neutral-500"
          />

          <p className="mt-4 text-sm text-neutral-500">
            Loading collections...
          </p>
        </div>
      </div>
    );
  }

  /* ========================================
   * PAGE
   * ========================================
   */

  return (
    <div className="space-y-8">

      {/* ====================================
       * HEADER
       * ==================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Product Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Collections
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Create and manage curated product collections.
          </p>
        </div>

        <Link
          to="/admin/collections/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={18} />

          Add Collection
        </Link>

      </div>

      {/* ====================================
       * ERROR
       * ==================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <div className="flex items-center justify-between gap-4">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={fetchCollections}
              className="font-medium underline"
            >
              Try Again
            </button>

          </div>
        </div>
      )}

      {/* ====================================
       * COLLECTIONS
       * ==================================== */}

      {!error &&
        collections.length === 0 && (
          <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <FolderOpen
                size={28}
                className="text-neutral-500"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-neutral-900">
              No collections yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Create your first collection and group products
              together for your customers.
            </p>

            <Link
              to="/admin/collections/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={18} />

              Create Collection
            </Link>

          </div>
        )}

      {!error &&
        collections.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

            {/* TABLE HEADER */}

            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(120px,1fr)_120px_120px] gap-6 border-b border-neutral-200 bg-neutral-50 px-6 py-4 md:grid">

              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Collection
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Products
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Status
              </span>

              <span className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Actions
              </span>

            </div>

            {/* TABLE BODY */}

            <div className="divide-y divide-neutral-200">

              {collections.map(
                (collection) => (
                  <div
                    key={collection._id}
                    className="grid gap-4 px-5 py-5 transition hover:bg-neutral-50 md:grid-cols-[minmax(0,2fr)_minmax(120px,1fr)_120px_120px] md:items-center md:gap-6 md:px-6"
                  >

                    {/* COLLECTION */}

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">

                        {collection.image?.url ? (
                          <img
                            src={
                              collection.image.url
                            }
                            alt={
                              collection.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FolderOpen
                              size={22}
                              className="text-neutral-400"
                            />
                          </div>
                        )}

                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate text-sm font-semibold text-neutral-900">
                          {collection.name}
                        </h2>

                        <p className="mt-1 truncate text-xs text-neutral-500">
                          /{collection.slug}
                        </p>

                        {collection.description && (
                          <p className="mt-2 line-clamp-1 text-xs text-neutral-500">
                            {
                              collection.description
                            }
                          </p>
                        )}

                      </div>

                    </div>

                    {/* PRODUCTS */}

                    <div className="flex items-center gap-2">

                      <span className="text-sm font-medium text-neutral-900">
                        {
                          collection.products
                            .length
                        }
                      </span>

                      <span className="text-xs text-neutral-500">
                        products
                      </span>

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          collection.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {collection.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 md:justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/collections/${collection._id}/edit`,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-900"
                        aria-label="Edit collection"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            collection._id,
                          )
                        }
                        disabled={
                          deletingId ===
                          collection._id
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete collection"
                      >
                        {deletingId ===
                        collection._id ? (
                          <RefreshCw
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>

                    </div>

                  </div>
                ),
              )}

            </div>

          </div>
        )}

    </div>
  );
};

export default AdminCollections;