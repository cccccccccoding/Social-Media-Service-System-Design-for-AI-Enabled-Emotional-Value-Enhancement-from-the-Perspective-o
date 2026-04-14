  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // 记录初始鼠标位置
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 处理拖拽移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      // 计算鼠标移动的距离
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // 更新位置
      const newX = position.x + deltaX;
      const newY = position.y + deltaY;

      // 更新 dragStart 为当前鼠标位置，以便下次计算 delta
      setDragStart({ x: e.clientX, y: e.clientY });

      // 交互层尺寸（800x800px，scale 缩放）
      const baseSize = 800;
      const scaledSize = baseSize * scale;
      const halfScaled = scaledSize / 2; // 缩放后的半尺寸

      // 世界窗口半尺寸（400）
      const windowHalf = baseSize / 2;

      // 当 scale >= 1 时，需要限制边界
      // 容器中心点位置范围：[-(windowHalf - halfScaled), (windowHalf - halfScaled)]
      // 即容器的左边缘 >= -windowHalf，右边缘 <= windowHalf
      if (scale >= 1) {
        const maxPos = windowHalf - halfScaled; // 最大位置
        const minPos = -maxPos; // 最小位置（负数）

        // 限制位置范围
        const clampedX = Math.max(minPos, Math.min(maxPos, newX));
        const clampedY = Math.max(minPos, Math.min(maxPos, newY));

        setPosition({ x: clampedX, y: clampedY });
      } else {
        // 当 scale < 1 时，容器比窗口小，不需要限制
        setPosition({ x: newX, y: newY });
      }
    }
  };
