import { useState, useEffect } from "react";
import { books } from "./GetScriptures.js";

const ScriptureNavigation = ({ book, chapter }) => {
    const [prevChapter, setPrevChapter] = useState(null);
    const [nextChapter, setNextChapter] = useState(null);

    useEffect(() => {
        const calculateNextChapter = () => {
            let nextChapterValue = chapter + 1;
            let nextBookId = book[0].id;

            if (nextChapterValue > books[book[0].id].numChapters) {
                nextChapterValue = 1;
                nextBookId += 1;

                while (!books[nextBookId].numChapters && nextBookId < 67) {
                    nextBookId += 1;
                }
            }

            setNextChapter({
                bookId: nextBookId,
                chapter: nextChapterValue,
                title: titleForBookChapter(books[nextBookId], nextChapterValue),
            });
        };

        const calculatePreviousChapter = () => {
            let previousChapterValue = chapter - 1;
            let previousBookId = book[0].id;

            if (previousChapterValue < 1) {
                previousBookId -= 1;

                while (
                    !books[previousBookId].numChapters &&
                    previousBookId > 1
                ) {
                    previousBookId -= 1;
                }

                previousChapterValue = books[previousBookId].numChapters;
            }

            setPrevChapter({
                bookId: previousBookId,
                chapter: previousChapterValue,
                title: titleForBookChapter(
                    books[previousBookId],
                    previousChapterValue
                ),
            });
        };

        calculateNextChapter();
        calculatePreviousChapter();
    }, [book, chapter]);

    const handleNavigation = (direction) => {
        const [targetBookId, targetChapter] =
            direction === "prev"
                ? [prevChapter.bookId, prevChapter.chapter]
                : [nextChapter.bookId, nextChapter.chapter];

        window.location.hash = `${books[targetBookId].parentBookId}:${targetBookId}:${targetChapter}:${direction}`;
    };

    return (
        <div className="crumbs bread-onscreen">
            {prevChapter && (
                <button
                    className="btn arrow"
                    title={prevChapter.title}
                    onClick={() => handleNavigation("prev")}>
                    <i
                        className="fa fa-angle-double-left"
                        aria-hidden="true"></i>
                </button>
            )}
            {nextChapter && (
                <button
                    className="btn arrow"
                    title={nextChapter.title}
                    onClick={() => handleNavigation("next")}>
                    <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"></i>
                </button>
            )}
        </div>
    );
};

const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

export default ScriptureNavigation;
