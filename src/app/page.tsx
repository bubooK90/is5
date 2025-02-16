'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Masonry from "react-masonry-css";

const MAX_PAGES = 7; // 设置最大页面数常量

interface Item {
  jobid: string;
  index: number;
  prompt: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(MAX_PAGES);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function fetchData(page: number) {
      const response = await fetch(`/data/page_${page}.json`); // 替换为你的 API 端点
      const data: Item[] = await response.json();
      setItems(prevItems => [...prevItems, ...data]);
      if (page < 2) {
        setHasMore(false);
      }
    }

    fetchData(page);
  }, [page]);

  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage - 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const breakpointColumnsObj = {
    default: 5,
    1024: 4,
    768: 3,
    640: 2
  };

  const handleCardClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <main className="py-5 px-5 sm:px-10 md:px-15 lg:px-20">
      <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        <div key="intelli.show" className='p-5 bg-stone-900/80 text-stone-100/80 rounded-lg'>
          <div className='mt-2 mb-20 text-xl font-bold'>imagined: <span className='text-stone-100/50'>reality</span></div>
          <div className='text-right text-xs text-stone-100/30'>kevin.p.gao@gmail.com</div>
        </div>
        {items.map((item, index) => {
          if (index === items.length - 1) {
            return (
              <div ref={lastItemRef} key={index} onClick={() => handleCardClick(item)}>
                <img
                  className="lazy rounded-lg cursor-pointer"
                  src={`https://cdn.midjourney.com/${item.jobid}/${item.index}.png`}
                  alt={`${item.prompt}`}
                  loading="lazy"
                />
              </div>
            );
          } else {
            return (
              <div key={index} onClick={() => handleCardClick(item)}>
                <img
                  className="lazy rounded-lg cursor-pointer"
                  src={`https://cdn.midjourney.com/${item.jobid}/${item.index}.png`}
                  alt={`${item.prompt}`}
                  loading="lazy"
                />
              </div>
            );
          }
        })}
      </Masonry>
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-stone-100 p-5 rounded-lg max-w-3xl w-full">
            <button className="absolute top-5 right-5 text-stone-900/80 font-bold" onClick={handleClose}>Close</button>
            <img
              width="50%"
              src={`https://cdn.midjourney.com/${selectedItem.jobid}/${selectedItem.index}.png`}
              alt={`${selectedItem.prompt}`}
            />
            <p className="mt-4 text-xs text-stone-900/80">{selectedItem.prompt}</p>
          </div>
        </div>
      )}
      <div className="my-10 p-5 bg-stone-900/10 rounded-lg text-right">
        <div className="mt-20 text-2xl font-extrabold text-stone-900/80">intelli.<span className="text-stone-900/40">show</span></div>
        <div className="mb-2 text-xs text-stone-900/40">&copy; 2024-2025, Kevin Gao @ Toronto</div>
      </div>
    </main>   
  );
}
