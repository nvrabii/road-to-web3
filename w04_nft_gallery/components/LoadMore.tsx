function LoadMore({ handler }: { handler: Function }) {
  return (
    <div className="container flex justify-center">
      <button
        className="block button text-gray-400 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-100 mb-2"
        onClick={(e) => {
          handler();
          e.preventDefault();
        }}
      >
        Load more
      </button>
    </div>
  );
}

export default LoadMore;
