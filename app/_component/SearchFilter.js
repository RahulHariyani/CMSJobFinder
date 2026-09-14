"use client"

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react";

const SearchFilter = () => {

    const parms = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const inputRef = useRef(null);

    function handleClick(e) {
        e.preventDefault()
        const searchparms = new URLSearchParams(parms)
        if (inputRef.current) {
            searchparms.set("job", inputRef.current.value)
            router.replace(`${pathname}?${searchparms.toString()}`)
        }
    }


    return (
        <form onSubmit={handleClick} className="flex w-full items-center gap-2 rounded-full border theme-border-line bg-white p-1.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-2 h-4 w-4 shrink-0 theme-text-soft"
                aria-hidden="true"
            >
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a1 1 0 01-1.42 1.42l-3.08-3.08A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
                type="text"
                placeholder="Search jobs by title, company…"
                name="search"
                ref={inputRef}
                className="w-full min-w-0 bg-transparent px-1 py-1.5 text-sm theme-text-main placeholder:theme-text-soft focus:outline-none"
            />
            <button
                type="submit"
                className="shrink-0 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
                Search
            </button>
        </form>
    )
}

export default SearchFilter