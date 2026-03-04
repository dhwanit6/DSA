"use client";

import { useState, useCallback } from "react";
import { toggleProblem, isProblemSolved, isMarkedForRevision, toggleRevisionMark } from "@/lib/progress";

interface Problem {
    id: string;
    name: string;
    url: string;
    lc: string;
    pattern: string;
    track: string;
    video?: string;
    time?: string;
    space?: string;
}

const TIER1: Problem[] = [
    { id: "t1-1", name: "Two Sum", url: "https://leetcode.com/problems/two-sum/", lc: "1", pattern: "Hash Map", track: "Both", video: "https://youtu.be/KLlXCFG5TnA", time: "O(N)", space: "O(N)" },
    { id: "t1-2", name: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", lc: "121", pattern: "Prefix", track: "Both", video: "https://youtu.be/1pkOgXD63yU", time: "O(N)", space: "O(1)" },
    { id: "t1-3", name: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", lc: "238", pattern: "Prefix Sum", track: "Both", video: "https://youtu.be/bNvIQI2wAWE", time: "O(N)", space: "O(1)" },
    { id: "t1-4", name: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", lc: "53", pattern: "Kadane's", track: "Both", video: "https://youtu.be/5WZl3MMT0Eg", time: "O(N)", space: "O(1)" },
    { id: "t1-5", name: "3Sum", url: "https://leetcode.com/problems/3sum/", lc: "15", pattern: "Two Pointers", track: "FT", video: "https://youtu.be/jzZsG8n2R9A", time: "O(N²)", space: "O(N)" },
    { id: "t1-6", name: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", lc: "11", pattern: "Two Pointers", track: "Both", video: "https://youtu.be/UuiTKBwPgAo", time: "O(N)", space: "O(1)" },
    { id: "t1-7", name: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", lc: "42", pattern: "Monotonic Stack", track: "FT", video: "https://youtu.be/ZI2z5pq0TqA", time: "O(N)", space: "O(N)" },
    { id: "t1-8", name: "Longest Substring Without Repeating", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", lc: "3", pattern: "Sliding Window", track: "Both", video: "https://youtu.be/wiGpQwVHdE0", time: "O(N)", space: "O(K)" },
    { id: "t1-9", name: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", lc: "76", pattern: "Sliding Window", track: "FT", video: "https://youtu.be/jSto0O4pzvc", time: "O(N+M)", space: "O(K)" },
    { id: "t1-10", name: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", lc: "33", pattern: "Binary Search", track: "Both", video: "https://youtu.be/U8XENwh8Oy8", time: "O(log N)", space: "O(1)" },
    { id: "t1-11", name: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", lc: "875", pattern: "BS on Answer", track: "FT", video: "https://youtu.be/U2SozAs9RzA" },
    { id: "t1-12", name: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", lc: "560", pattern: "Prefix + Hash", track: "Both", video: "https://youtu.be/fFVZt-6sgyo" },
    { id: "t1-13", name: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", lc: "84", pattern: "Monotonic Stack", track: "FT", video: "https://youtu.be/zx5Sw9130L0" },
    { id: "t1-14", name: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", lc: "56", pattern: "Intervals", track: "Both", video: "https://youtu.be/44H3cEC2fFM" },
    { id: "t1-15", name: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", lc: "4", pattern: "Binary Search", track: "FT", video: "https://youtu.be/q6IEA26zSmQ" },
    { id: "t1-16", name: "Subsets", url: "https://leetcode.com/problems/subsets/", lc: "78", pattern: "Backtracking", track: "Both", video: "https://youtu.be/REOH22XvnEg" },
    { id: "t1-17", name: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", lc: "39", pattern: "Backtracking", track: "Both", video: "https://youtu.be/GBKI9VSKdGg" },
    { id: "t1-18", name: "Permutations", url: "https://leetcode.com/problems/permutations/", lc: "46", pattern: "Backtracking", track: "Both", video: "https://youtu.be/s7AvT7cGdSo" },
    { id: "t1-19", name: "N-Queens", url: "https://leetcode.com/problems/n-queens/", lc: "51", pattern: "Backtracking", track: "FT", video: "https://youtu.be/Ph95IHmRp5M" },
    { id: "t1-20", name: "Word Search", url: "https://leetcode.com/problems/word-search/", lc: "79", pattern: "DFS Grid", track: "Both", video: "https://youtu.be/pfiQ_PS1g8E" },
    { id: "t1-21", name: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", lc: "206", pattern: "Linked List", track: "Both" },
    { id: "t1-22", name: "Linked List Cycle II", url: "https://leetcode.com/problems/linked-list-cycle-ii/", lc: "142", pattern: "Floyd's", track: "Both" },
    { id: "t1-23", name: "Merge K Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", lc: "23", pattern: "Min Heap", track: "FT" },
    { id: "t1-24", name: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", lc: "146", pattern: "Hash + DLL", track: "FT" },
    { id: "t1-25", name: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", lc: "739", pattern: "Monotonic Stack", track: "Both" },
    { id: "t1-26", name: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", lc: "104", pattern: "DFS", track: "Both" },
    { id: "t1-27", name: "LCA of Binary Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", lc: "236", pattern: "DFS", track: "Both" },
    { id: "t1-28", name: "Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", lc: "102", pattern: "BFS", track: "Both" },
    { id: "t1-29", name: "Binary Tree Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view/", lc: "199", pattern: "BFS/DFS", track: "Both" },
    { id: "t1-30", name: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", lc: "124", pattern: "DFS", track: "FT" },
    { id: "t1-31", name: "Validate BST", url: "https://leetcode.com/problems/validate-binary-search-tree/", lc: "98", pattern: "DFS Bounds", track: "Both" },
    { id: "t1-32", name: "Kth Smallest in BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", lc: "230", pattern: "Inorder", track: "Both" },
    { id: "t1-33", name: "Serialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", lc: "297", pattern: "BFS/DFS", track: "FT" },
    { id: "t1-34", name: "Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", lc: "208", pattern: "Trie", track: "FT" },
    { id: "t1-35", name: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", lc: "295", pattern: "Two Heaps", track: "FT" },
    { id: "t1-36", name: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", lc: "200", pattern: "BFS/DFS Grid", track: "Both" },
    { id: "t1-37", name: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", lc: "994", pattern: "Multi-BFS", track: "Both" },
    { id: "t1-38", name: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", lc: "207", pattern: "Topo Sort", track: "FT" },
    { id: "t1-39", name: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/", lc: "210", pattern: "Kahn's", track: "FT" },
    { id: "t1-40", name: "Number of Provinces", url: "https://leetcode.com/problems/number-of-provinces/", lc: "547", pattern: "Union-Find", track: "Both" },
    { id: "t1-41", name: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", lc: "127", pattern: "BFS", track: "FT" },
    { id: "t1-42", name: "Cheapest Flights K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", lc: "787", pattern: "Bellman-Ford", track: "FT" },
    { id: "t1-43", name: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", lc: "743", pattern: "Dijkstra", track: "FT" },
    { id: "t1-44", name: "Min Cost Connect Points", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", lc: "1584", pattern: "MST", track: "FT" },
    { id: "t1-45", name: "Is Graph Bipartite", url: "https://leetcode.com/problems/is-graph-bipartite/", lc: "785", pattern: "2-Coloring", track: "Both" },
    { id: "t1-46", name: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", lc: "70", pattern: "1D DP", track: "Both" },
    { id: "t1-47", name: "House Robber", url: "https://leetcode.com/problems/house-robber/", lc: "198", pattern: "1D DP", track: "Both" },
    { id: "t1-48", name: "House Robber II", url: "https://leetcode.com/problems/house-robber-ii/", lc: "213", pattern: "1D DP Cycle", track: "Both" },
    { id: "t1-49", name: "Coin Change", url: "https://leetcode.com/problems/coin-change/", lc: "322", pattern: "Unbounded KS", track: "Both" },
    { id: "t1-50", name: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", lc: "416", pattern: "0/1 Knapsack", track: "FT" },
    { id: "t1-51", name: "LIS", url: "https://leetcode.com/problems/longest-increasing-subsequence/", lc: "300", pattern: "LIS DP", track: "FT" },
    { id: "t1-52", name: "LCS", url: "https://leetcode.com/problems/longest-common-subsequence/", lc: "1143", pattern: "LCS 2D DP", track: "FT" },
    { id: "t1-53", name: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", lc: "72", pattern: "LCS Variant", track: "FT" },
    { id: "t1-54", name: "Word Break", url: "https://leetcode.com/problems/word-break/", lc: "139", pattern: "DP + Hash", track: "Both" },
    { id: "t1-55", name: "Burst Balloons", url: "https://leetcode.com/problems/burst-balloons/", lc: "312", pattern: "Interval DP", track: "FT" },
    { id: "t1-56", name: "Jump Game", url: "https://leetcode.com/problems/jump-game/", lc: "55", pattern: "Greedy/DP", track: "Both" },
    { id: "t1-57", name: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", lc: "62", pattern: "Grid DP", track: "Both" },
    { id: "t1-58", name: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", lc: "347", pattern: "Heap", track: "Both" },
    { id: "t1-59", name: "Single Number", url: "https://leetcode.com/problems/single-number/", lc: "136", pattern: "XOR", track: "Both" },
    { id: "t1-60", name: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", lc: "128", pattern: "Hash Set", track: "Both" },
];

function ProblemRow({ problem }: { problem: Problem }) {
    const [solved, setSolved] = useState(() => isProblemSolved(problem.id));
    const [revision, setRevision] = useState(() => isMarkedForRevision(problem.id));

    const handleToggle = useCallback(() => {
        const newState = toggleProblem(problem.id);
        setSolved(newState);
        if (newState && revision) {
            toggleRevisionMark(problem.id);
            setRevision(false);
        }
    }, [problem.id, revision]);

    const handleRevisionToggle = useCallback(() => {
        setRevision(toggleRevisionMark(problem.id));
    }, [problem.id]);

    return (
        <tr className={`group border-b border-border transition-all duration-300 ${solved ? "opacity-60 bg-muted/30" : "hover:bg-muted/50"}`}>
            <td className="px-6 py-4 w-12 text-center">
                <button
                    onClick={handleToggle}
                    className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center shadow-sm ${solved
                        ? "bg-primary border-primary text-white"
                        : "border-border hover:border-primary/50"
                        }`}
                    aria-label={solved ? "Mark as unsolved" : "Mark as solved"}
                >
                    {solved && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                </button>
            </td>
            <td className="px-6 py-4 font-semibold text-foreground">
                <div className="flex items-center gap-3">
                    <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm hover:text-primary transition-colors ${solved ? "line-through text-muted-fg" : ""}`}
                    >
                        {problem.name}
                    </a>
                    {problem.video && (
                        <a href={problem.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-fg hover:text-red-500 transition-colors px-1.5 py-0.5 rounded border border-transparent hover:border-red-500/20 hover:bg-red-500/5" title="Video Explanation">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            Video
                        </a>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 hidden md:table-cell">
                <span className="text-xs font-medium text-muted-fg bg-muted px-2.5 py-1 rounded-md border border-border">
                    {problem.pattern}
                </span>
            </td>
            <td className="px-6 py-4 text-xs font-mono text-muted-fg hidden lg:table-cell">{problem.time || "—"}</td>
            <td className="px-6 py-4 text-xs font-mono text-muted-fg hidden lg:table-cell">{problem.space || "—"}</td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={handleRevisionToggle}
                    className={`text-xs font-semibold px-4 py-1.5 rounded border transition-all ${revision
                        ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900"
                        : "text-muted-fg border-transparent hover:border-border hover:bg-muted"
                        }`}
                >
                    {revision ? "Revise" : "Mark"}
                </button>
            </td>
        </tr>
    );
}

export default function ProblemsPage() {
    const solvedCount = TIER1.filter((p) => isProblemSolved(p.id)).length;

    return (
        <div className="max-w-[960px] mx-auto px-6 py-10 lg:py-16">
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Practice</span>
                    <span className="text-muted-fg/30">·</span>
                    <span className="text-[11px] text-muted-fg">{solvedCount} / 60 solved</span>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">Problem Set</h1>
                <p className="text-base text-muted-fg leading-relaxed max-w-xl mb-6">
                    120 curated problems organized by pattern. Focus on understanding the underlying reasoning, not memorizing solutions.
                </p>

                <div className="h-1.5 w-full max-w-xs bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-foreground/60 transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${(solvedCount / 60) * 100}%` }}
                    />
                </div>
            </header>

            {/* Problem List */}
            <section className="mb-20">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-sm font-semibold">Core Fundamentals</h2>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <div className="bg-surface-1 rounded-lg overflow-hidden border border-border">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-4 text-xs font-semibold text-muted-fg w-12 text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-fg">Problem Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-fg hidden md:table-cell">Methodology</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-fg hidden lg:table-cell">Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-fg hidden lg:table-cell">Space</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-fg text-right">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {TIER1.map((p) => (
                                <ProblemRow key={p.id} problem={p} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
