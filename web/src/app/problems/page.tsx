"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
    getProgressServerSnapshot,
    getProgressSnapshot,
    subscribeProgress,
    toggleProblem,
    toggleRevisionMark,
} from "@/lib/progress";

interface Problem {
    id: string;
    name: string;
    url: string;
    lc: string;
    pattern: string;
    track: string;
    note?: string;
    video?: string;
    time?: string;
    space?: string;
}

const TIER1: Problem[] = [
    { id: "t1-1", name: "Two Sum", url: "https://leetcode.com/problems/two-sum/", lc: "1", pattern: "Hash Map", track: "Both", video: "https://youtu.be/KLlXCFG5TnA", time: "O(N)", space: "O(N)" },
    { id: "t1-2", name: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", lc: "121", pattern: "Prefix", track: "Both", video: "https://youtu.be/1pkOgXD63yU", time: "O(N)", space: "O(1)" },
    { id: "t1-3", name: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", lc: "238", pattern: "Prefix Sum", track: "Both", video: "https://youtu.be/bNvIQI2wAWE", time: "O(N)", space: "O(1)" },
    { id: "t1-4", name: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", lc: "53", pattern: "Kadane's", track: "Both", video: "https://youtu.be/5WZl3MMT0Eg", time: "O(N)", space: "O(1)" },
    { id: "t1-5", name: "3Sum", url: "https://leetcode.com/problems/3sum/", lc: "15", pattern: "Two Pointers", track: "FT", video: "https://youtu.be/jzZsG8n2R9A", time: "O(N^2)", space: "O(N)" },
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

const TIER2: Problem[] = [
    { id: "t2-61", name: "Sliding Window Maximum", url: "https://leetcode.com/problemset/all/?search=239", lc: "239", pattern: "Monotonic Deque", track: "FT", note: "Hard, frequently asked" },
    { id: "t2-62", name: "Count of Range Sum", url: "https://leetcode.com/problemset/all/?search=327", lc: "327", pattern: "Merge Sort / BIT", track: "FT", note: "Divide and conquer" },
    { id: "t2-63", name: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problemset/all/?search=417", lc: "417", pattern: "Multi-source BFS/DFS", track: "FT", note: "Grid with two-source BFS" },
    { id: "t2-64", name: "Surrounded Regions", url: "https://leetcode.com/problemset/all/?search=130", lc: "130", pattern: "DFS from boundary", track: "FT", note: "Mark safe first" },
    { id: "t2-65", name: "01 Matrix", url: "https://leetcode.com/problems/01-matrix/", lc: "542", pattern: "Multi-source BFS", track: "FT", note: "Distance-to-nearest source BFS" },
    { id: "t2-66", name: "Redundant Connection", url: "https://leetcode.com/problemset/all/?search=684", lc: "684", pattern: "Union-Find", track: "FT", note: "DSU cycle detection" },
    { id: "t2-67", name: "Alien Dictionary", url: "https://leetcode.com/problemset/all/?search=269", lc: "269", pattern: "Topological Sort", track: "FT", note: "Hard, pure topo sort" },
    { id: "t2-68", name: "Reconstruct Itinerary", url: "https://leetcode.com/problemset/all/?search=332", lc: "332", pattern: "Hierholzer\'s", track: "FT", note: "Euler Path DFS" },
    { id: "t2-69", name: "Critical Connections", url: "https://leetcode.com/problemset/all/?search=1192", lc: "1192", pattern: "Tarjan\'s Bridges", track: "FT", note: "Amazon, LinkedIn" },
    { id: "t2-70", name: "Clone Graph", url: "https://leetcode.com/problemset/all/?search=133", lc: "133", pattern: "BFS + HashMap", track: "FT", note: "Graph reconstruction" },
    { id: "t2-71", name: "Max Product Subarray", url: "https://leetcode.com/problemset/all/?search=152", lc: "152", pattern: "DP min/max tracking", track: "FT", note: "Maintain both min and max" },
    { id: "t2-72", name: "Longest Palindromic Subsequence", url: "https://leetcode.com/problems/longest-palindromic-subsequence/", lc: "516", pattern: "2D DP", track: "FT", note: "Classic interval-style string DP" },
    { id: "t2-73", name: "Decode Ways", url: "https://leetcode.com/problemset/all/?search=91", lc: "91", pattern: "1D DP", track: "FT", note: "State design is key" },
    { id: "t2-74", name: "Palindromic Substrings", url: "https://leetcode.com/problemset/all/?search=647", lc: "647", pattern: "Expand Around Center", track: "FT", note: "Faster than 2D DP" },
    { id: "t2-75", name: "Regex Matching", url: "https://leetcode.com/problemset/all/?search=10", lc: "10", pattern: "2D DP", track: "FT", note: "Hard DP" },
    { id: "t2-76", name: "Interleaving String", url: "https://leetcode.com/problemset/all/?search=97", lc: "97", pattern: "2D DP", track: "FT", note: "Classic structure" },
    { id: "t2-77", name: "Distinct Subsequences", url: "https://leetcode.com/problemset/all/?search=115", lc: "115", pattern: "2D DP", track: "FT", note: "Count variant" },
    { id: "t2-78", name: "Cherry Pickup II", url: "https://leetcode.com/problemset/all/?search=1463", lc: "1463", pattern: "3D DP", track: "FT", note: "Two agents on grid" },
    { id: "t2-79", name: "Maximum Rectangle", url: "https://leetcode.com/problemset/all/?search=85", lc: "85", pattern: "Histogram DP", track: "FT", note: "LC 84 as subproblem" },
    { id: "t2-80", name: "House Robber III", url: "https://leetcode.com/problemset/all/?search=337", lc: "337", pattern: "DP on Trees", track: "FT", note: "Two states" },
    { id: "t2-81", name: "Min Cost to Cut Stick", url: "https://leetcode.com/problemset/all/?search=1547", lc: "1547", pattern: "Interval DP", track: "FT", note: "Ordering matters" },
    { id: "t2-82", name: "Target Sum", url: "https://leetcode.com/problemset/all/?search=494", lc: "494", pattern: "0/1 Knapsack count", track: "FT", note: "Subset sum variant" },
    { id: "t2-83", name: "Coin Change II", url: "https://leetcode.com/problemset/all/?search=518", lc: "518", pattern: "Unbounded count", track: "FT", note: "Loop order matters" },
    { id: "t2-84", name: "Last Stone Weight II", url: "https://leetcode.com/problemset/all/?search=1049", lc: "1049", pattern: "0/1 Knapsack", track: "FT", note: "Reduce to partition" },
    { id: "t2-85", name: "Longest Valid Parens", url: "https://leetcode.com/problemset/all/?search=32", lc: "32", pattern: "DP / Stack", track: "FT", note: "Both valid" },
    { id: "t2-86", name: "Queue using Stacks", url: "https://leetcode.com/problemset/all/?search=232", lc: "232", pattern: "Stack manipulation", track: "FT", note: "Classic design" },
    { id: "t2-87", name: "Min Stack", url: "https://leetcode.com/problemset/all/?search=155", lc: "155", pattern: "Stack + auxiliary", track: "FT", note: "Classic design" },
    { id: "t2-88", name: "Design Twitter", url: "https://leetcode.com/problemset/all/?search=355", lc: "355", pattern: "Heap + HashMap", track: "FT", note: "DSA + design hybrid" },
    { id: "t2-89", name: "Insert Delete Random O(1)", url: "https://leetcode.com/problemset/all/?search=380", lc: "380", pattern: "HashMap + Array", track: "FT", note: "Random = array index" },
    { id: "t2-90", name: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/", lc: "287", pattern: "Floyd's Cycle", track: "FT", note: "Array-as-linked-list insight" },
    { id: "t2-91", name: "Gas Station", url: "https://leetcode.com/problemset/all/?search=134", lc: "134", pattern: "Greedy circular", track: "FT", note: "Running sum insight" },
    { id: "t2-92", name: "Jump Game II", url: "https://leetcode.com/problemset/all/?search=45", lc: "45", pattern: "Greedy DP", track: "FT", note: "BFS layer interpretation" },
    { id: "t2-93", name: "Non-overlapping Intervals", url: "https://leetcode.com/problemset/all/?search=435", lc: "435", pattern: "Greedy intervals", track: "FT", note: "Activity selection" },
    { id: "t2-94", name: "Meeting Rooms II", url: "https://leetcode.com/problemset/all/?search=253", lc: "253", pattern: "Greedy + Heap", track: "FT", note: "Events array approach" },
    { id: "t2-95", name: "Range Sum Mutable", url: "https://leetcode.com/problemset/all/?search=307", lc: "307", pattern: "Segment Tree / BIT", track: "FT", note: "First seg tree app" },
    { id: "t2-96", name: "Count Smaller After Self", url: "https://leetcode.com/problemset/all/?search=315", lc: "315", pattern: "Merge Sort / BIT", track: "FT", note: "Merge sort counting" },
    { id: "t2-97", name: "Queue by Height", url: "https://leetcode.com/problemset/all/?search=406", lc: "406", pattern: "Greedy sort+insert", track: "FT", note: "Counter-intuitive order" },
    { id: "t2-98", name: "Swim in Rising Water", url: "https://leetcode.com/problemset/all/?search=778", lc: "778", pattern: "Dijkstra / BS+BFS", track: "FT", note: "Two approaches" },
    { id: "t2-99", name: "Evaluate Division", url: "https://leetcode.com/problemset/all/?search=399", lc: "399", pattern: "Weighted graph BFS", track: "FT", note: "Edge weights as ratios" },
    { id: "t2-100", name: "Bus Routes", url: "https://leetcode.com/problemset/all/?search=815", lc: "815", pattern: "Multi-source BFS", track: "FT", note: "Meta-graph of routes" },
    { id: "t2-101", name: "City Smallest Neighbors", url: "https://leetcode.com/problemset/all/?search=1334", lc: "1334", pattern: "Floyd-Warshall", track: "FT", note: "All-pairs shortest" },
    { id: "t2-102", name: "Min Window to Sort", url: "https://leetcode.com/problemset/all/?search=581", lc: "581", pattern: "Two Pointers", track: "FT", note: "Linear scan insight" },
    { id: "t2-103", name: "K Closest Points", url: "https://leetcode.com/problemset/all/?search=973", lc: "973", pattern: "Heap / Quick Select", track: "FT", note: "O(N) average" },
    { id: "t2-104", name: "BT from Inorder+Preorder", url: "https://leetcode.com/problemset/all/?search=105", lc: "105", pattern: "Recursion + HashMap", track: "FT", note: "O(1) index lookup" },
    { id: "t2-105", name: "Binary Tree Zigzag Level Order", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", lc: "103", pattern: "BFS level order", track: "FT", note: "Alternating level direction" },
    { id: "t2-106", name: "Count Good Nodes", url: "https://leetcode.com/problemset/all/?search=1448", lc: "1448", pattern: "DFS + max tracking", track: "FT", note: "Pass max down" },
    { id: "t2-107", name: "Add/Search Words", url: "https://leetcode.com/problemset/all/?search=211", lc: "211", pattern: "Trie + DFS wildcard", track: "FT", note: "Trie with wildcard" },
    { id: "t2-108", name: "Redundant Connection II", url: "https://leetcode.com/problemset/all/?search=685", lc: "685", pattern: "DSU + edge cases", track: "FT", note: "Directed graph" },
    { id: "t2-109", name: "Ops to Connect Graph", url: "https://leetcode.com/problemset/all/?search=1319", lc: "1319", pattern: "Union-Find components", track: "FT", note: "Count edges needed" },
    { id: "t2-110", name: "MST (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Kruskal\'s", track: "FT", note: "Build DSU + sort" },
    { id: "t2-111", name: "Shortest Paths Neg (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Bellman-Ford", track: "FT", note: "Detect negative cycle" },
    { id: "t2-112", name: "Max Subarray Sum (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Kadane\'s prefix", track: "FT", note: "Prefix sum variant" },
    { id: "t2-113", name: "Josephus Problem (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Math + Recursion", track: "FT", note: "Circular elimination" },
    { id: "t2-114", name: "Range Min Query (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Sparse Table", track: "FT", note: "O(1) query" },
    { id: "t2-115", name: "Dynamic Range Sum (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Fenwick Tree", track: "FT", note: "BIT prefix sum" },
    { id: "t2-116", name: "SCC (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Kosaraju\'s", track: "FT", note: "Two-pass DFS" },
    { id: "t2-117", name: "Bitmask DP Hamilton (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Bitmask DP", track: "FT", note: "dp[mask][v]" },
    { id: "t2-118", name: "Giant Pizza 2-SAT (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "2-SAT", track: "FT", note: "Implication graph" },
    { id: "t2-119", name: "Histogram Queries (CSES)", url: "https://cses.fi/problemset/", lc: "CSES", pattern: "Segment Tree", track: "FT", note: "Range query" },
    { id: "t2-120", name: "Subsets II (revisit)", url: "https://leetcode.com/problemset/all/?search=90", lc: "90", pattern: "Backtracking + Dedup", track: "FT", note: "Dedup is the skill" },
];

const ALL_PROBLEMS: Problem[] = [...TIER1, ...TIER2];

interface ProblemRowProps {
    problem: Problem;
    solved: boolean;
    revision: boolean;
    onToggleSolved: (id: string) => void;
    onToggleRevision: (id: string) => void;
}

function ProblemRow({ problem, solved, revision, onToggleSolved, onToggleRevision }: ProblemRowProps) {
    return (
        <tr className={`group border-b border-border transition-all duration-300 ${solved ? "opacity-60 bg-muted/30" : "hover:bg-muted/50"}`}>
            <td className="px-6 py-4 w-12 text-center">
                <button
                    onClick={() => onToggleSolved(problem.id)}
                    className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center shadow-sm ${solved ? "bg-primary border-primary text-white" : "border-border hover:border-primary/50"}`}
                    aria-label={solved ? "Mark as unsolved" : "Mark as solved"}
                >
                    {solved && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                </button>
            </td>
            <td className="px-6 py-4 font-semibold text-foreground">
                <div className="flex flex-wrap items-center gap-2.5">
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
                {problem.note && <p className="mt-1 text-[11px] font-normal text-muted-fg">{problem.note}</p>}
            </td>
            <td className="px-6 py-4 hidden md:table-cell">
                <span className="text-xs font-medium text-muted-fg bg-muted px-2.5 py-1 rounded-md border border-border">
                    {problem.pattern}
                </span>
            </td>
            <td className="px-6 py-4 text-xs font-mono text-muted-fg hidden lg:table-cell">{problem.time || "-"}</td>
            <td className="px-6 py-4 text-xs font-mono text-muted-fg hidden lg:table-cell">{problem.space || "-"}</td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={() => onToggleRevision(problem.id)}
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

function ProblemTable({
    problems,
    solvedIds,
    revisionIds,
    onToggleSolved,
    onToggleRevision,
}: {
    problems: Problem[];
    solvedIds: Set<string>;
    revisionIds: Set<string>;
    onToggleSolved: (id: string) => void;
    onToggleRevision: (id: string) => void;
}) {
    return (
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
                    {problems.map((problem) => (
                        <ProblemRow
                            key={problem.id}
                            problem={problem}
                            solved={solvedIds.has(problem.id)}
                            revision={revisionIds.has(problem.id)}
                            onToggleSolved={onToggleSolved}
                            onToggleRevision={onToggleRevision}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ProblemsPage() {
    const progress = useSyncExternalStore(
        subscribeProgress,
        getProgressSnapshot,
        getProgressServerSnapshot,
    );
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved" | "revision">("all");
    const [trackFilter, setTrackFilter] = useState<"all" | "Both" | "FT">("all");
    const [tierFilter, setTierFilter] = useState<"all" | "tier1" | "tier2">("all");
    const [patternFilter, setPatternFilter] = useState<string>("all");

    const solvedIds = useMemo(() => new Set(progress.solvedProblems), [progress.solvedProblems]);
    const revisionIds = useMemo(() => new Set(progress.revisionMarks), [progress.revisionMarks]);

    const solvedTier1 = useMemo(() => TIER1.filter((problem) => solvedIds.has(problem.id)).length, [solvedIds]);
    const solvedTier2 = useMemo(() => TIER2.filter((problem) => solvedIds.has(problem.id)).length, [solvedIds]);
    const solvedCount = solvedTier1 + solvedTier2;

    const totalCount = ALL_PROBLEMS.length;
    const progressPercent = (solvedCount / totalCount) * 100;
    const normalizedQuery = query.trim().toLowerCase();
    const patternOptions = useMemo(
        () => ["all", ...Array.from(new Set(ALL_PROBLEMS.map((problem) => problem.pattern))).sort((a, b) => a.localeCompare(b))],
        [],
    );

    const filteredTier1 = useMemo(
        () =>
            TIER1.filter((problem) => {
                if (normalizedQuery) {
                    const haystack = `${problem.name} ${problem.pattern} ${problem.lc}`.toLowerCase();
                    if (!haystack.includes(normalizedQuery)) return false;
                }
                if (trackFilter !== "all" && problem.track !== trackFilter) return false;
                if (patternFilter !== "all" && problem.pattern !== patternFilter) return false;
                if (statusFilter === "solved" && !solvedIds.has(problem.id)) return false;
                if (statusFilter === "unsolved" && solvedIds.has(problem.id)) return false;
                if (statusFilter === "revision" && !revisionIds.has(problem.id)) return false;
                return true;
            }),
        [normalizedQuery, trackFilter, patternFilter, statusFilter, solvedIds, revisionIds],
    );

    const filteredTier2 = useMemo(
        () =>
            TIER2.filter((problem) => {
                if (normalizedQuery) {
                    const haystack = `${problem.name} ${problem.pattern} ${problem.lc}`.toLowerCase();
                    if (!haystack.includes(normalizedQuery)) return false;
                }
                if (trackFilter !== "all" && problem.track !== trackFilter) return false;
                if (patternFilter !== "all" && problem.pattern !== patternFilter) return false;
                if (statusFilter === "solved" && !solvedIds.has(problem.id)) return false;
                if (statusFilter === "unsolved" && solvedIds.has(problem.id)) return false;
                if (statusFilter === "revision" && !revisionIds.has(problem.id)) return false;
                return true;
            }),
        [normalizedQuery, trackFilter, patternFilter, statusFilter, solvedIds, revisionIds],
    );

    const filteredCount = filteredTier1.length + filteredTier2.length;

    const handleToggleSolved = (id: string) => {
        toggleProblem(id);
    };

    const handleToggleRevision = (id: string) => {
        toggleRevisionMark(id);
    };

    return (
        <div className="max-w-[960px] mx-auto px-6 py-10 lg:py-16">
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Practice</span>
                    <span className="text-muted-fg/30">|</span>
                    <span className="text-[11px] text-muted-fg">{solvedCount} / {totalCount} solved</span>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">Problem Set</h1>
                <p className="text-base text-muted-fg leading-relaxed max-w-xl mb-6">
                    120 curated problems organized by pattern. Focus on understanding reasoning and recall, not memorization.
                </p>

                <div className="h-1.5 w-full max-w-xs bg-muted rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-foreground/60 transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-muted-fg">{solvedTier1} / {TIER1.length} Tier 1, {solvedTier2} / {TIER2.length} Tier 2</p>
            </header>

            <section className="mb-10 p-4 rounded-lg border border-border bg-surface-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by name, pattern, or LC #"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                    />
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as "all" | "solved" | "unsolved" | "revision")}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                    >
                        <option value="all">Status: All</option>
                        <option value="solved">Status: Solved</option>
                        <option value="unsolved">Status: Unsolved</option>
                        <option value="revision">Status: Revision</option>
                    </select>
                    <select
                        value={trackFilter}
                        onChange={(event) => setTrackFilter(event.target.value as "all" | "Both" | "FT")}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                    >
                        <option value="all">Track: All</option>
                        <option value="Both">Track: Both</option>
                        <option value="FT">Track: FT</option>
                    </select>
                    <select
                        value={tierFilter}
                        onChange={(event) => setTierFilter(event.target.value as "all" | "tier1" | "tier2")}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                    >
                        <option value="all">Tier: All</option>
                        <option value="tier1">Tier: Tier 1</option>
                        <option value="tier2">Tier: Tier 2</option>
                    </select>
                    <select
                        value={patternFilter}
                        onChange={(event) => setPatternFilter(event.target.value)}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
                    >
                        <option value="all">Pattern: All</option>
                        {patternOptions.map((pattern) =>
                            pattern === "all" ? null : (
                                <option key={pattern} value={pattern}>
                                    {pattern}
                                </option>
                            ),
                        )}
                    </select>
                </div>
                <p className="mt-3 text-xs text-muted-fg">{filteredCount} problems match current filters.</p>
            </section>

            {(tierFilter === "all" || tierFilter === "tier1") && (
                <section className="mb-14">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-sm font-semibold">Tier 1 - Core Fundamentals</h2>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <ProblemTable
                        problems={filteredTier1}
                        solvedIds={solvedIds}
                        revisionIds={revisionIds}
                        onToggleSolved={handleToggleSolved}
                        onToggleRevision={handleToggleRevision}
                    />
                </section>
            )}

            {(tierFilter === "all" || tierFilter === "tier2") && (
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-sm font-semibold">Tier 2 - Pattern Deepeners</h2>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <ProblemTable
                        problems={filteredTier2}
                        solvedIds={solvedIds}
                        revisionIds={revisionIds}
                        onToggleSolved={handleToggleSolved}
                        onToggleRevision={handleToggleRevision}
                    />
                </section>
            )}

            {filteredCount === 0 && (
                <p className="text-sm text-muted-fg pb-20">No problems match these filters. Clear one filter and try again.</p>
            )}
        </div>
    );
}
