"use client";

import Link from "next/link";

function Pagination({
  page,
  total,
  perPage,
  basePath,
}: {
  page: number;
  total: number;
  perPage: number;
  basePath: string;
}) {
  const lastPage = Math.ceil(total / perPage);
  const prevPage = Math.max(page - 1, 1);
  const nextPage = Math.min(page + 1, lastPage);

  return (
    <div className="d-flex gap-2 align-items-center">
      <small>
        {total} registros — Página {page} de {lastPage}
      </small>
      <Link
        href={`${basePath.replace(/&?page=[^&]*/, "")}&page=${prevPage}`}
        className="btn btn-sm btn-primary"
        aria-disabled={page <= 1}
      >
        <i className="bi bi-caret-left-fill"></i>
      </Link>
      <Link
        href={`${basePath.replace(/&?page=[^&]*/, "")}&page=${nextPage}`}
        className="btn btn-sm btn-primary"
        aria-disabled={page >= lastPage}
      >
        <i className="bi bi-caret-right-fill"></i>
      </Link>
    </div>
  );
}

export default Pagination;
