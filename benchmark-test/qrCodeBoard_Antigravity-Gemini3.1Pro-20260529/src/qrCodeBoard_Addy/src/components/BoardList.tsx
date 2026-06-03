import type { BoardItem } from '../db/schema';

export const BoardList = ({ items }: { items: BoardItem[] }) => {
  if (items.length === 0) {
    return (
      <div class="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        <p>No scans yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <>
      {items.map((item) => {
        const date = new Date(item.created_at);
        const relativeTime = getRelativeTime(date);
        
        return (
          <div class="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition-shadow">
            <p class="text-gray-800 break-all">{item.content}</p>
            <span class="text-xs text-gray-400 whitespace-nowrap ml-4" title={date.toLocaleString()}>{relativeTime}</span>
          </div>
        );
      })}
    </>
  );
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
