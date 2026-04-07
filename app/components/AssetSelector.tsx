"use client";
import { useState, useEffect, useRef } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"

export function AssetSelector({ selectedToken, onSelect }: {
    selectedToken: TokenDetails, 
    onSelect: (asset: TokenDetails) => void
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);;

    useEffect(() => {
        function handleClickOutside(e: any) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return <div>
        <div ref={ref} className="relative w-56">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
                <div className="flex items-center gap-2">
                    <img
                        src={selectedToken.image}
                        alt={selectedToken.name}
                        className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-800">
                        {selectedToken.name}
                    </span>
                </div>

                <span className={`transition-transform text-gray-500 ${open ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </button>

            {open && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {SUPPORTED_TOKENS.map((token) => (
                        <button
                            key={token.name}
                            onClick={() => {
                                onSelect(token);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-gray-100 
                                ${selectedToken.name === token.name ? "bg-gray-100" : ""}`
                            }
                        >
                            <img src={token.image} alt={token.name} className="w-5 h-5 rounded-full"/>
                            <span className="text-gray-800">
                                {token.name}
                            </span>
                            {selectedToken.mint === token.mint && (
                                <span className="ml-auto text-blue-500 text-xs font-semibold">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
}