import '@components/feature/pagination/pagination.css'; // CSS 파일 임포트

interface Props {
    totalPage: number;
    size: number;
    countPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ totalPage, size, countPerPage, currentPage, onPageChange }: Props) => {
    const generatePageNumbers = () => {
        const pages = [];
        const halfCount = Math.floor(countPerPage / 2);
        let startPage = Math.max(1, currentPage - halfCount);
        let endPage = Math.min(totalPage, startPage + countPerPage - 1);

        if (currentPage - halfCount <= 0) {
            endPage = Math.min(countPerPage, totalPage);
        } else if (currentPage + halfCount > totalPage) {
            startPage = Math.max(totalPage - countPerPage + 1, 1);
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }
        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <div className="pagination">
            {currentPage > 1 && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="pagination-button"
                    aria-label="Previous"
                >
                    &lt;
                </button>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                >
                    {page}
                </button>
            ))}
            {currentPage < totalPage && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="pagination-button"
                    aria-label="Next"
                    
                >
                    &gt;
                </button>
            )}
        </div>
    );
};
