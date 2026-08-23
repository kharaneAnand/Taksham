import type {
  AdminCustomersResponse,
  Customer,
  CustomerSort,
} from "../types/customer";

/*
 * ========================================
 * API URL
 * ========================================
 */

const AUTH_API_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL ||
  "http://localhost:5001/api/v1/auth";

/*
 * ========================================
 * Customer Query
 * ========================================
 */

export interface GetCustomersParams {
  page?: number;

  limit?: number;

  search?: string;

  isVerified?:
    | "true"
    | "false";

  sort?: CustomerSort;
}

/*
 * ========================================
 * Request Helper
 * ========================================
 */

const request = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response =
    await fetch(
      url,
      {
        ...options,

        credentials:
          "include",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          ...(options.headers || {}),
        },
      },
    );

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "Admin Customer API error:",
      {
        url,
        status:
          response.status,
        result,
      },
    );

    const validationIssues =
      result?.errors ||
      result?.issues ||
      result?.data;

    const validationMessage =
      Array.isArray(
        validationIssues,
      )
        ? validationIssues
            .map(
              (issue) => {
                const field =
                  Array.isArray(
                    issue?.path,
                  )
                    ? issue.path.join(
                        ".",
                      )
                    : "";

                return field
                  ? `${field}: ${issue.message}`
                  : issue.message;
              },
            )
            .filter(Boolean)
            .join(", ")
        : "";

    throw new Error(
      validationMessage ||
        result?.message ||
        result?.error?.message ||
        "Something went wrong",
    );
  }

  return result.data as T;
};

/*
 * ========================================
 * Get All Customers
 *
 * GET /admin/customers
 * ========================================
 */

export const getAllCustomers = (
  params: GetCustomersParams = {},
): Promise<AdminCustomersResponse> => {
  const searchParams =
    new URLSearchParams();

  if (params.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (
    params.search &&
    params.search.trim()
  ) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.isVerified) {
    searchParams.set(
      "isVerified",
      params.isVerified,
    );
  }

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort,
    );
  }

  const queryString =
    searchParams.toString();

  const url =
    `${AUTH_API_URL}/admin/customers${
      queryString
        ? `?${queryString}`
        : ""
    }`;

  return request<
    AdminCustomersResponse
  >(
    url,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * Get Customer By ID
 *
 * GET /admin/customers/:id
 * ========================================
 */

export const getCustomerById = (
  customerId: string,
): Promise<Customer> => {
  return request<Customer>(
    `${AUTH_API_URL}/admin/customers/${encodeURIComponent(
      customerId,
    )}`,
    {
      method: "GET",
    },
  );
};