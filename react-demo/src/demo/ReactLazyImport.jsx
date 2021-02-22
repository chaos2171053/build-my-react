import React from 'react';

const Spinner = () => {
  return (
    <>
      Spinner...
    </>
  );
};

const SomeComponent = React.lazy(() => import('./CloneElementDemo'));

export default function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 SomeComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <SomeComponent />
      </div>
    </React.Suspense>
  );
}