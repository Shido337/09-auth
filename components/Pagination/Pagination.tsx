import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

const Paginate =
  (ReactPaginate as unknown as { default: typeof ReactPaginate }).default || ReactPaginate;

interface PageChangeEvent {
  selected: number;
}

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pageCount, currentPage, onPageChange }: PaginationProps) => {
  return (
    <Paginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }: PageChangeEvent) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
};

export default Pagination;
